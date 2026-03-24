/**
 * 從 static.nanoka.cc API 抓取星穹鐵道角色與光錐資料
 * 圖片使用 Mar-7th/StarRailRes CDN
 *
 * 執行方式：npx tsx scripts/fetch-data.ts
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Character, LightCone, Path, Element, Skill, Eidolon, CharacterTrace } from '../lib/types';

const MANIFEST_URL = 'https://static.nanoka.cc/manifest.json';
const IMG_BASE = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master';
const DATA_DIR = join(process.cwd(), 'data');

// ─── 對照表 ─────────────────────────────────────────

const PATH_MAP: Record<string, Path> = {
  Knight:  '存護',
  Rogue:   '巡獵',
  Warrior: '毀滅',
  Mage:    '智識',
  Shaman:  '同諧',
  Warlock: '虛無',
  Priest:  '豐饒',
  Memory:  '記憶',
  Elation: '歡愉',
};

const ELEMENT_MAP: Record<string, Element> = {
  Ice:       '冰',
  Fire:      '火',
  Thunder:   '雷',
  Wind:      '風',
  Physical:  '物理',
  Quantum:   '量子',
  Imaginary: '虛數',
};

// skill.type → 技能槽 key
// type 為 null 代表天賦（Talent）
const SKILL_TYPE_MAP: Record<string, keyof Character['skills']> = {
  Normal:  'basic',
  BPSkill: 'skill',
  Ultra:   'ult',
  Maze:    'technique',
};

// ─── 輔助函式 ─────────────────────────────────────────

/** SkillIcon 後綴 → Mar-7th CDN 檔名後綴 */
const RANK_ICON_SUFFIX: Record<string, string> = {
  Ultra:   'ultimate',
  BP:      'skill',
  Normal:  'basic_atk',
  Talent:  'talent',
  Maze:    'technique',
};

/** 將 API 的 icon 欄位轉換為 Mar-7th CDN 圖片 URL */
function rankIconToUrl(id: string, iconName: string): string {
  // e.g. "SkillIcon_1001_Ultra.png" → "1001_ultimate.png"
  const match = iconName.match(/SkillIcon_\d+_(.+)\.png$/);
  if (!match) return `${IMG_BASE}/icon/skill/${id}_rank1.png`; // fallback
  const suffix = match[1];
  if (suffix.startsWith('Rank')) {
    return `${IMG_BASE}/icon/skill/${id}_rank${suffix.slice(4)}.png`;
  }
  const mapped = RANK_ICON_SUFFIX[suffix] ?? suffix.toLowerCase();
  return `${IMG_BASE}/icon/skill/${id}_${mapped}.png`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

/** 從「CombatPowerAvatarRarityType4」或「CombatPowerLightconeRarity3」等字串取出數字 */
function parseRarity(rank: string): number {
  const match = rank.match(/(\d)$/);
  return match ? parseInt(match[1]) : 4;
}

/** 移除所有格式標記，數值佔位符替換為 ? */
function cleanDesc(desc: string | null | undefined): string {
  if (!desc) return '';
  return desc
    .replace(/<color=[^>]+>/g, '')
    .replace(/<\/color>/g, '')
    .replace(/<\/?unbreak>/g, '')
    .replace(/\{RUBY_B#[^}]+\}/g, '')
    .replace(/\{RUBY_E#\}/g, '')
    .replace(/<\/?u>/g, '')
    .replace(/<\/?b>/g, '')
    .replace(/#\d+\[f\d+\]%?/g, '?')
    .replace(/#\d+\[i\]%?/g, '?')
    .replace(/\\n/g, '\n')
    .trim();
}

/** 移除格式標記但保留 #N[...] 佔位符 */
function stripFormatOnly(desc: string | null | undefined): string {
  if (!desc) return '';
  return desc
    .replace(/<color=[^>]+>/g, '')
    .replace(/<\/color>/g, '')
    .replace(/<\/?unbreak>/g, '')
    .replace(/\{RUBY_B#[^}]+\}/g, '')
    .replace(/\{RUBY_E#\}/g, '')
    .replace(/<\/?u>/g, '')
    .replace(/<\/?b>/g, '')
    .replace(/\\n/g, '\n')
    .trim();
}

/** 將 param_list 填入描述模板，生成指定等級的技能描述 */
function resolveDesc(template: string, params: number[]): string {
  // 替換 #N[i]% → Math.round(p*100)%
  // 替換 #N[fX]% → (p*100).toFixed(X)%（去掉尾部 .0）
  // 替換 #N[i] → Math.round(p) 或整數
  // 替換 #N[fX] → p.toFixed(X)
  return template.replace(/#(\d+)\[([^\]]+)\](%)?/g, (_, n, fmt, pct) => {
    const p = params[parseInt(n) - 1] ?? 0;
    const val = pct ? p * 100 : p;
    if (fmt === 'i') {
      return Math.round(val) + (pct ? '%' : '');
    }
    const decimals = parseInt(fmt.replace('f', '')) || 1;
    const formatted = val.toFixed(decimals).replace(/\.0+$/, '');
    return formatted + (pct ? '%' : '');
  });
}

// ─── 角色資料 ─────────────────────────────────────────

interface ApiCharacterList {
  [id: string]: {
    rank: string;
    baseType: string;
    damageType: string;
    icon: string;
    zh: string;
    en: string;
  };
}

interface ApiSkill {
  name: string;
  desc: string | null;
  type: string | null;  // Normal | BPSkill | Ultra | null (talent) | Maze | MazeNormal
  tag: string;
  level?: Record<string, { param_list: number[] }>;
}

interface ApiRank {
  id: number;
  name: string;
  desc: string;
  icon: string;  // 例如 "SkillIcon_1001_Rank1.png"
  param_list: number[];
}

interface ApiTraceNode {
  anchor: string;
  point_type: number;
  point_name: string | null;
  point_desc: string | null;
  status_add_list: {
    $type: string;
    property_type: string;
    value: number;
    name: string;
  }[];
  param_list: number[];
}

interface ApiCharacterDetail {
  name: string;
  skills: Record<string, ApiSkill>;
  ranks: Record<string, ApiRank>;
  skill_trees?: Record<string, Record<string, ApiTraceNode>>;
}

async function fetchCharacters(baseUrl: string): Promise<Character[]> {
  console.log('📥 抓取角色列表...');
  const list = await fetchJson<ApiCharacterList>(`${baseUrl}/character.json`);

  const characters: Character[] = [];
  const ids = Object.keys(list).filter(id => {
    const e = list[id];
    // 跳過沒有命途或屬性的異常條目
    return e.baseType && e.damageType;
  });
  console.log(`   共 ${ids.length} 個角色`);

  for (const id of ids) {
    const entry = list[id];
    try {
      process.stdout.write(`   [${id}] ${entry.zh || entry.en}...`);
      const detail = await fetchJson<ApiCharacterDetail>(
        `${baseUrl}/zh/character/${id}.json`
      );

      // ── 整理技能 ──
      const skillSlots: Partial<Character['skills']> = {};
      for (const skill of Object.values(detail.skills)) {
        const slotKey = skill.type === null ? 'talent' : (SKILL_TYPE_MAP[skill.type] ?? null);
        if (!slotKey || skillSlots[slotKey]) continue;

        // 生成各等級描述（1–15 級，若無資料則只有 1 筆）
        const template = stripFormatOnly(skill.desc);
        const levels = skill.level ? Object.keys(skill.level).sort((a, b) => +a - +b) : [];
        const descriptions = levels.length > 0
          ? levels.map(lv => resolveDesc(template, skill.level![lv].param_list))
          : [cleanDesc(skill.desc)];

        skillSlots[slotKey] = {
          name: skill.name,
          description: descriptions[0] ?? cleanDesc(skill.desc),
          descriptions,
          type: skill.type ?? 'Talent',
        };
      }

      const empty: Skill = { name: '', description: '', descriptions: [], type: '' };
      const skills: Character['skills'] = {
        basic:     skillSlots.basic     ?? empty,
        skill:     skillSlots.skill     ?? empty,
        ult:       skillSlots.ult       ?? empty,
        talent:    skillSlots.talent    ?? empty,
        technique: skillSlots.technique ?? empty,
      };

      // ── 整理命座 ──
      const eidolons: Eidolon[] = Object.entries(detail.ranks).map(([rank, r]) => ({
        rank: parseInt(rank) as Eidolon['rank'],
        name: r.name,
        // 使用 param_list 解析實際數值，替代 ? 佔位符
        description: resolveDesc(stripFormatOnly(r.desc), r.param_list ?? []),
        image: rankIconToUrl(id, r.icon),
      }));

      // ── 整理行迹 ──
      const traces: CharacterTrace[] = [];
      if (detail.skill_trees) {
        for (const pointLevels of Object.values(detail.skill_trees)) {
          const node = Object.values(pointLevels)[0] as ApiTraceNode;
          if (!node) continue;
          if (node.point_type === 3 && node.point_name) {
            // 能力型行迹（有名稱與描述）
            traces.push({
              anchor: node.anchor,
              type: 'ability',
              name: node.point_name,
              description: cleanDesc(node.point_desc),
            });
          } else if (node.point_type === 1 && node.status_add_list?.length) {
            // 屬性強化型行迹
            const stat = node.status_add_list[0];
            traces.push({
              anchor: node.anchor,
              type: 'stat',
              name: stat.name,
              statType: stat.property_type,
              value: stat.value,
            });
          }
        }
      }

      const rarity = parseRarity(entry.rank);
      characters.push({
        id,
        name: detail.name || entry.zh || entry.en,
        nameEn: entry.en || undefined,
        rarity: (rarity === 5 ? 5 : 4) as Character['rarity'],
        path:    PATH_MAP[entry.baseType]    ?? '巡獵',
        element: ELEMENT_MAP[entry.damageType] ?? '物理',
        image: `${IMG_BASE}/icon/character/${id}.png`,
        skills,
        eidolons,
        traces,
      });

      process.stdout.write(' ✓\n');
      await new Promise(r => setTimeout(r, 60));
    } catch (err) {
      console.error(`\n   ⚠ 跳過 ${id}:`, (err as Error).message);
    }
  }

  return characters;
}

// ─── 光錐資料 ─────────────────────────────────────────

interface ApiLightConeList {
  [id: string]: {
    rank: string;
    baseType: string;
    zh: string;
    en: string;
  };
}

interface ApiLightConeDetail {
  name: string;
  rarity?: string;
  base_type?: string;
  refinements: {
    name: string;
    desc: string;
    level: Record<string, { param_list: number[] }>;
  };
}

async function fetchLightCones(baseUrl: string): Promise<LightCone[]> {
  console.log('\n📥 抓取光錐列表...');
  const list = await fetchJson<ApiLightConeList>(`${baseUrl}/lightcone.json`);

  const lightCones: LightCone[] = [];
  const ids = Object.keys(list).filter(id => list[id].baseType);
  console.log(`   共 ${ids.length} 個光錐`);

  for (const id of ids) {
    const entry = list[id];
    try {
      process.stdout.write(`   [${id}] ${entry.zh || entry.en}...`);
      const detail = await fetchJson<ApiLightConeDetail>(
        `${baseUrl}/zh/lightcone/${id}.json`
      );

      const ref = detail.refinements;
      const rarity = parseRarity(entry.rank);

      // 用不同精煉等級的數值生成描述陣列
      const levels = ref?.level ? Object.keys(ref.level).sort() : ['1'];
      const descriptions = levels.map(lv => {
        const params = ref?.level?.[lv]?.param_list ?? [];
        let desc = cleanDesc(ref?.desc);
        // 將 ? 佔位符替換成實際數值（百分比則 ×100）
        params.forEach(p => {
          desc = desc.replace('?', p < 1 ? `${Math.round(p * 100)}%` : String(p));
        });
        return desc;
      });

      lightCones.push({
        id,
        name: detail.name || entry.zh || entry.en,
        rarity: ([3, 4, 5].includes(rarity) ? rarity : 3) as LightCone['rarity'],
        path:  PATH_MAP[entry.baseType] ?? '巡獵',
        image: `${IMG_BASE}/icon/light_cone/${id}.png`,
        passive: {
          name: ref?.name ?? '',
          description: descriptions,
        },
      });

      process.stdout.write(' ✓\n');
      await new Promise(r => setTimeout(r, 60));
    } catch (err) {
      console.error(`\n   ⚠ 跳過 ${id}:`, (err as Error).message);
    }
  }

  return lightCones;
}

// ─── 主程式 ─────────────────────────────────────────

async function main() {
  console.log('🚀 HSR Database 資料抓取工具\n');
  mkdirSync(DATA_DIR, { recursive: true });

  // 1. 取得最新版本號
  console.log('📋 取得遊戲版本...');
  const manifest = await fetchJson<{ hsr: { live: string; latest: string } }>(MANIFEST_URL);
  const version = manifest.hsr.live;  // 使用已上線版本（截止 4.0）
  const BASE_URL = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`   版本：${version}（live）\n`);

  // 2. 抓取角色
  const characters = await fetchCharacters(BASE_URL);
  writeFileSync(
    join(DATA_DIR, 'characters.json'),
    JSON.stringify(characters, null, 2),
    'utf-8'
  );
  console.log(`\n✅ 已儲存 ${characters.length} 個角色 → data/characters.json`);

  // 3. 抓取光錐
  const lightCones = await fetchLightCones(BASE_URL);
  writeFileSync(
    join(DATA_DIR, 'lightcones.json'),
    JSON.stringify(lightCones, null, 2),
    'utf-8'
  );
  console.log(`✅ 已儲存 ${lightCones.length} 個光錐 → data/lightcones.json`);

  console.log('\n🎉 完成！');
}

main().catch(err => {
  console.error('❌ 發生錯誤：', err);
  process.exit(1);
});
