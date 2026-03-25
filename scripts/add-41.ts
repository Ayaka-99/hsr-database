/**
 * 新增 4.1 版本內容：不死途（1504）與其簽名光錐（23056）
 * 執行方式：npx tsx scripts/add-41.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Converter } = require('opencc-js') as { Converter: (opts: { from: string; to: string }) => (s: string) => string };
import type { Character, LightCone, Path, Element, Skill, Eidolon, CharacterTrace, CharacterStats } from '../lib/types';

const toTW = Converter({ from: 'cn', to: 'tw' });
const DATA_DIR = join(process.cwd(), 'data');
const IMG_BASE = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master';

const PATH_MAP: Record<string, Path> = {
  Knight: '存護', Rogue: '巡獵', Warrior: '毀滅', Mage: '智識',
  Shaman: '同諧', Warlock: '虛無', Priest: '豐饒', Memory: '記憶', Elation: '歡愉',
};
const ELEMENT_MAP: Record<string, Element> = {
  Ice: '冰', Fire: '火', Thunder: '雷', Wind: '風',
  Physical: '物理', Quantum: '量子', Imaginary: '虛數',
};
const SKILL_TYPE_MAP: Record<string, keyof Character['skills']> = {
  Normal: 'basic', BPSkill: 'skill', Ultra: 'ult', Maze: 'technique',
};
const RANK_ICON_SUFFIX: Record<string, string> = {
  Ultra: 'ultimate', BP: 'skill', Normal: 'basic_atk', Talent: 'talent', Maze: 'technique',
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

function stripFormatOnly(desc: string | null | undefined): string {
  if (!desc) return '';
  return desc
    .replace(/<color=[^>]+>/g, '').replace(/<\/color>/g, '')
    .replace(/<\/?unbreak>/g, '').replace(/\{RUBY_B#[^}]+\}/g, '')
    .replace(/\{RUBY_E#\}/g, '').replace(/<\/?u>/g, '').replace(/<\/?b>/g, '')
    .replace(/\\n/g, '\n').trim();
}

function cleanDesc(desc: string | null | undefined): string {
  if (!desc) return '';
  return stripFormatOnly(desc)
    .replace(/#\d+\[f\d+\]%?/g, '?').replace(/#\d+\[i\]%?/g, '?').trim();
}

function resolveDesc(template: string, params: number[]): string {
  return template.replace(/#(\d+)\[([^\]]+)\](%)?/g, (_, n, fmt, pct) => {
    const p = params[parseInt(n) - 1] ?? 0;
    const val = pct ? p * 100 : p;
    if (fmt === 'i') return Math.round(val) + (pct ? '%' : '');
    const dec = parseInt(fmt.replace('f', '')) || 1;
    return val.toFixed(dec).replace(/\.0+$/, '') + (pct ? '%' : '');
  });
}

function rankIconToUrl(id: string, iconName: string): string {
  const match = iconName.match(/SkillIcon_\d+_(.+)\.png$/);
  if (!match) return `${IMG_BASE}/icon/skill/${id}_rank1.png`;
  const suffix = match[1];
  if (suffix.startsWith('Rank')) return `${IMG_BASE}/icon/skill/${id}_rank${suffix.slice(4)}.png`;
  return `${IMG_BASE}/icon/skill/${id}_${RANK_ICON_SUFFIX[suffix] ?? suffix.toLowerCase()}.png`;
}

function parseRarity(rank: string): number {
  const match = rank.match(/(\d)$/);
  return match ? parseInt(match[1]) : 4;
}

// ─── 抓取角色 ─────────────────────────────────────────

interface ApiSkill {
  name: string; desc: string | null; type: string | null; tag: string;
  level?: Record<string, { param_list: number[] }>;
}
interface ApiRank {
  id: number; name: string; desc: string; icon: string; param_list: number[];
}
interface ApiTraceNode {
  anchor: string; point_type: number; point_name: string | null; point_desc: string | null;
  status_add_list: { property_type: string; value: number; name: string }[];
  param_list: number[];
}
interface ApiStatEntry {
  attack_base: number; attack_add: number; defence_base: number; defence_add: number;
  hp_base: number; hp_add: number; speed_base: number;
  critical_chance: number; critical_damage: number;
}
interface ApiCharDetail {
  name: string;
  skills: Record<string, ApiSkill>;
  ranks: Record<string, ApiRank>;
  skill_trees?: Record<string, Record<string, ApiTraceNode>>;
  stats?: Record<string, ApiStatEntry>;
}

async function fetchCharacter(baseUrl: string, id: string, entry: { rank: string; baseType: string; damageType: string; en: string; zh: string }): Promise<Character> {
  const detail = await fetchJson<ApiCharDetail>(`${baseUrl}/zh/character/${id}.json`);

  // 技能
  const skillSlots: Partial<Character['skills']> = {};
  for (const skill of Object.values(detail.skills)) {
    const slotKey = skill.type === null ? 'talent' : (SKILL_TYPE_MAP[skill.type] ?? null);
    if (!slotKey || skillSlots[slotKey]) continue;
    const template = toTW(stripFormatOnly(skill.desc));
    const levels = skill.level ? Object.keys(skill.level).sort((a, b) => +a - +b) : [];
    const descriptions = levels.length > 0
      ? levels.map(lv => resolveDesc(template, skill.level![lv].param_list))
      : [toTW(cleanDesc(skill.desc))];
    skillSlots[slotKey] = {
      name: toTW(skill.name),
      description: descriptions[0] ?? toTW(cleanDesc(skill.desc)),
      descriptions,
      type: skill.type ?? 'Talent',
    };
  }
  const empty: Skill = { name: '', description: '', descriptions: [], type: '' };
  const skills: Character['skills'] = {
    basic: skillSlots.basic ?? empty, skill: skillSlots.skill ?? empty,
    ult: skillSlots.ult ?? empty, talent: skillSlots.talent ?? empty,
    technique: skillSlots.technique ?? empty,
  };

  // 命座
  const eidolons: Eidolon[] = Object.entries(detail.ranks).map(([rank, r]) => ({
    rank: parseInt(rank) as Eidolon['rank'],
    name: toTW(r.name),
    description: resolveDesc(toTW(stripFormatOnly(r.desc)), r.param_list ?? []),
    image: rankIconToUrl(id, r.icon),
  }));

  // 行跡
  const traces: CharacterTrace[] = [];
  if (detail.skill_trees) {
    for (const pointLevels of Object.values(detail.skill_trees)) {
      const node = Object.values(pointLevels)[0] as ApiTraceNode;
      if (!node) continue;
      if (node.point_type === 3 && node.point_name) {
        traces.push({
          anchor: node.anchor,
          type: 'ability',
          name: toTW(node.point_name),
          description: resolveDesc(toTW(stripFormatOnly(node.point_desc)), node.param_list ?? []),
        });
      } else if (node.point_type === 1 && node.status_add_list?.length) {
        const stat = node.status_add_list[0];
        traces.push({ anchor: node.anchor, type: 'stat', name: stat.name, statType: stat.property_type, value: stat.value });
      }
    }
  }

  // 屬性
  let stats: CharacterStats | undefined;
  if (detail.stats?.['6']) {
    const s = detail.stats['6'];
    stats = {
      hp:       Math.round(s.hp_base + s.hp_add * 10),
      atk:      Math.round(s.attack_base + s.attack_add * 10),
      def:      Math.round(s.defence_base + s.defence_add * 10),
      spd:      Math.round(s.speed_base * 10) / 10,
      critRate: Math.round(s.critical_chance * 1000) / 10,
      critDmg:  Math.round(s.critical_damage * 1000) / 10,
    };
  }

  const rarity = parseRarity(entry.rank);
  return {
    id, name: toTW(detail.name || entry.zh || entry.en), nameEn: entry.en || undefined,
    rarity: (rarity === 5 ? 5 : 4) as Character['rarity'],
    path: PATH_MAP[entry.baseType] ?? '巡獵',
    element: ELEMENT_MAP[entry.damageType] ?? '物理',
    image: `${IMG_BASE}/icon/character/${id}.png`,
    stats, skills, eidolons, traces,
  };
}

// ─── 抓取光錐 ─────────────────────────────────────────

interface ApiLcDetail {
  name: string;
  refinements: { name: string; desc: string; level: Record<string, { param_list: number[] }> };
  stats: { max_level: number; base_hp: number; base_hp_add: number; base_attack: number; base_attack_add: number; base_defence: number; base_defence_add: number }[];
}

async function fetchLightCone(baseUrl: string, id: string, entry: { rank: string; baseType: string }): Promise<LightCone> {
  const detail = await fetchJson<ApiLcDetail>(`${baseUrl}/zh/lightcone/${id}.json`);
  const ref = detail.refinements;
  const levels = ref?.level ? Object.keys(ref.level).sort() : ['1'];
  const descriptions = levels.map(lv => {
    const params = ref?.level?.[lv]?.param_list ?? [];
    let desc = toTW(cleanDesc(ref?.desc));
    params.forEach(p => { desc = desc.replace('?', p < 1 ? `${Math.round(p * 100)}%` : String(p)); });
    return desc;
  });

  // 滿級屬性
  const maxStage = detail.stats?.find(s => s.max_level === 80);
  const stats = maxStage ? {
    hp:  Math.round(maxStage.base_hp + maxStage.base_hp_add * 10),
    atk: Math.round(maxStage.base_attack + maxStage.base_attack_add * 10),
    def: Math.round(maxStage.base_defence + maxStage.base_defence_add * 10),
  } : undefined;

  return {
    id, name: toTW(detail.name),
    rarity: ([3, 4, 5].includes(parseRarity(entry.rank)) ? parseRarity(entry.rank) : 3) as LightCone['rarity'],
    path: PATH_MAP[entry.baseType] ?? '巡獵',
    image: `${IMG_BASE}/icon/light_cone/${id}.png`,
    stats,
    passive: { name: ref?.name ?? '', description: descriptions },
  };
}

// ─── 主程式 ─────────────────────────────────────────

async function main() {
  const manifest = await fetchJson<{ hsr: { latest: string } }>('https://static.nanoka.cc/manifest.json');
  const version = manifest.hsr.latest;
  const BASE_URL = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`版本：${version}\n`);

  const [charList, lcList] = await Promise.all([
    fetchJson<Record<string, { rank: string; baseType: string; damageType: string; en: string; zh: string }>>(`${BASE_URL}/character.json`),
    fetchJson<Record<string, { rank: string; baseType: string; en: string; zh: string }>>(`${BASE_URL}/lightcone.json`),
  ]);

  // ── 新增角色 ──
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const characters = require(join(DATA_DIR, 'characters.json')) as Character[];
  const charIdsToAdd = ['1504'];

  for (const id of charIdsToAdd) {
    if (characters.find(c => c.id === id)) { console.log(`角色 ${id} 已存在，略過`); continue; }
    const entry = charList[id];
    if (!entry) { console.log(`找不到角色 ${id}`); continue; }
    console.log(`抓取角色 [${id}] ${entry.zh}...`);
    const char = await fetchCharacter(BASE_URL, id, entry);
    characters.unshift(char); // 最新角色排最前
    console.log(`  ✓ ${char.name}（${char.path}・${char.element}）`);
  }

  writeFileSync(join(DATA_DIR, 'characters.json'), JSON.stringify(characters, null, 2), 'utf-8');
  console.log(`\n✅ 角色已儲存 → data/characters.json`);

  // ── 新增光錐 ──
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const lightcones = require(join(DATA_DIR, 'lightcones.json')) as LightCone[];
  const lcIdsToAdd = ['23056']; // 一場謊言的終幕（不死途簽名光錐）

  for (const id of lcIdsToAdd) {
    if (lightcones.find(l => l.id === id)) { console.log(`\n光錐 ${id} 已存在，略過`); continue; }
    const entry = lcList[id];
    if (!entry) { console.log(`\n找不到光錐 ${id}`); continue; }
    console.log(`\n抓取光錐 [${id}] ${entry.zh}...`);
    const lc = await fetchLightCone(BASE_URL, id, entry);
    lightcones.unshift(lc);
    console.log(`  ✓ ${lc.name}（${lc.path}，${lc.rarity}★）`);
  }

  writeFileSync(join(DATA_DIR, 'lightcones.json'), JSON.stringify(lightcones, null, 2), 'utf-8');
  console.log(`✅ 光錐已儲存 → data/lightcones.json`);

  console.log('\n🎉 完成！');
}

main().catch(err => { console.error('❌', err); process.exit(1); });
