/**
 * 更新記憶命途角色的完整資料（含憶靈技），並將所有文字轉換為繁體中文
 * 執行：node scripts/update-memory-chars.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Converter } from 'opencc-js';

const BASE = 'https://static.nanoka.cc/hsr/4.1.52+14427120/zh';
const DATA_PATH = join(process.cwd(), 'data', 'characters.json');

const toTW = Converter({ from: 'cn', to: 'tw' });

// ── 輔助函式 ────────────────────────────────────────────────────

function stripFormatOnly(desc) {
  if (!desc) return '';
  return desc
    .replace(/<color=[^>]+>/g, '')
    .replace(/<\/color>/g, '')
    .replace(/<\/?unbreak>/g, '')
    .replace(/\{RUBY_B#[^}]+\}/g, '')
    .replace(/\{RUBY_E#\}/g, '')
    .replace(/<\/?u>/g, '')
    .replace(/<\/?b>/g, '')
    .replace(/<icon[^>]*>/g, '')
    .replace(/\\n/g, '\n')
    .trim();
}

function cleanDesc(desc) {
  if (!desc) return '';
  return stripFormatOnly(desc)
    .replace(/#\d+\[f\d+\]%?/g, '?')
    .replace(/#\d+\[i\]%?/g, '?');
}

function resolveDesc(template, params) {
  return template.replace(/#(\d+)\[([^\]]+)\](%)?/g, (_, n, fmt, pct) => {
    const p = params[parseInt(n) - 1] ?? 0;
    const val = pct ? p * 100 : p;
    if (fmt === 'i') return Math.round(val) + (pct ? '%' : '');
    const decimals = parseInt(fmt.replace('f', '')) || 1;
    return val.toFixed(decimals).replace(/\.0+$/, '') + (pct ? '%' : '');
  });
}

function resolveDescFloor(template, params) {
  return template.replace(/#(\d+)\[([^\]]+)\](%)?/g, (_, n, fmt, pct) => {
    const p = params[parseInt(n) - 1] ?? 0;
    const val = pct ? p * 100 : p;
    if (fmt === 'i') return Math.floor(val) + (pct ? '%' : '');
    const decimals = parseInt(fmt.replace('f', '')) || 1;
    return val.toFixed(decimals).replace(/\.0+$/, '') + (pct ? '%' : '');
  });
}

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return r.json();
}

// ── 繁體中文轉換（遞迴處理所有字串欄位）────────────────────────

const SKIP_KEYS = new Set(['id', 'anchor', 'statType', 'image', 'nameEn', 'icon', 'type', 'rank']);

function convertObjectToTW(obj) {
  if (typeof obj === 'string') return toTW(obj);
  if (Array.isArray(obj)) return obj.map(convertObjectToTW);
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      if (SKIP_KEYS.has(k) || typeof v === 'number' || typeof v === 'boolean') {
        result[k] = v;
      } else {
        result[k] = convertObjectToTW(v);
      }
    }
    return result;
  }
  return obj;
}

// ── 抓取記憶命途角色的完整資料 ──────────────────────────────────

const SKILL_TYPE_MAP = {
  Normal: 'basic', BPSkill: 'skill', Ultra: 'ult', Maze: 'technique',
};

async function fetchFullCharacter(id) {
  const d = await fetchJson(`${BASE}/character/${id}.json`);

  // ── 技能 ──
  const skillSlots = {};
  for (const skill of Object.values(d.skills || {})) {
    const slotKey = skill.type === null ? 'talent' : (SKILL_TYPE_MAP[skill.type] ?? null);
    if (!slotKey || skillSlots[slotKey]) continue;
    const template = toTW(stripFormatOnly(skill.desc));
    const levels = skill.level ? Object.keys(skill.level).sort((a, b) => +a - +b) : [];
    const descriptions = levels.length > 0
      ? levels.map(lv => resolveDesc(template, skill.level[lv].param_list))
      : [toTW(cleanDesc(skill.desc))];
    skillSlots[slotKey] = {
      name: toTW(skill.name),
      description: descriptions[0] ?? '',
      descriptions,
      type: skill.type ?? 'Talent',
    };
  }
  const empty = { name: '', description: '', descriptions: [], type: '' };
  const skills = {
    basic:     skillSlots.basic     ?? empty,
    skill:     skillSlots.skill     ?? empty,
    ult:       skillSlots.ult       ?? empty,
    talent:    skillSlots.talent    ?? empty,
    technique: skillSlots.technique ?? empty,
  };

  // ── 命座 ──
  const eidolons = Object.entries(d.ranks || {}).map(([rank, r]) => ({
    rank: parseInt(rank),
    name: toTW(r.name),
    description: resolveDesc(toTW(stripFormatOnly(r.desc)), r.param_list ?? []),
    image: `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${id}_rank${rank}.png`,
  }));

  // ── 行迹 ──
  const traces = [];
  if (d.skill_trees) {
    for (const pointLevels of Object.values(d.skill_trees)) {
      const node = Object.values(pointLevels)[0];
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

  // ── 詩行跡（昔漣專屬）──
  if (d.memosprite?.skills) {
    const poemSkills = Object.entries(d.memosprite.skills)
      .filter(([, s]) => s.type === 'Servant' && s.name?.includes('「'))
      .sort(([a], [b]) => +a - +b);
    for (const [skillId, skill] of poemSkills) {
      const template = toTW(stripFormatOnly(skill.desc));
      const levelKeys = Object.keys(skill.level || {}).sort((a, b) => +a - +b);
      const descriptions = levelKeys.slice(0, 7).map(lv =>
        resolveDescFloor(template, skill.level[lv].param_list)
      );
      traces.push({
        anchor: `poem_${skillId}`,
        type: 'ability',
        name: toTW(skill.name),
        description: descriptions[0],
        descriptions,
      });
    }
  }

  // ── 憶靈技 ──
  let memosprite;
  if (d.memosprite?.skills && d.memosprite.name) {
    const seen = new Set();
    const memoSkills = [];
    for (const [skillId, skill] of Object.entries(d.memosprite.skills).sort(([a], [b]) => +a - +b)) {
      if (!skill.desc) continue;
      const key = skill.name + '|' + skill.desc.slice(0, 30);
      if (seen.has(key)) continue;
      seen.add(key);
      const template = toTW(stripFormatOnly(skill.desc));
      const levelKeys = Object.keys(skill.level || {}).sort((a, b) => +a - +b);
      const descriptions = levelKeys.map(lv =>
        resolveDescFloor(template, skill.level[lv].param_list ?? [])
      );
      memoSkills.push({
        id: skillId,
        name: toTW(skill.name),
        description: descriptions[0] || template,
        descriptions,
      });
    }
    if (memoSkills.length > 0) {
      memosprite = { name: toTW(d.memosprite.name), skills: memoSkills };
    }
  }

  return { skills, eidolons, traces, memosprite };
}

// ── 主流程 ────────────────────────────────────────────────────

const MEMORY_IDS = ['1402', '1407', '1409', '1413', '1415', '8007', '8008'];

(async () => {
  console.log('📖 讀取 characters.json...');
  let characters = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  // 1. 將所有文字轉換為繁體中文
  console.log('🔄 轉換繁體中文...');
  characters = characters.map(char => convertObjectToTW(char));
  console.log('   ✓ 繁體中文轉換完成');

  // 2. 重新抓取記憶命途角色的完整資料（修正 ? 佔位符 + 加入憶靈技）
  console.log('\n📥 更新記憶命途角色資料...');
  for (const id of MEMORY_IDS) {
    const idx = characters.findIndex(c => c.id === id);
    if (idx === -1) { console.log(`   [${id}] 未找到`); continue; }

    process.stdout.write(`   [${id}] ${characters[idx].name}...`);
    try {
      const { skills, eidolons, traces, memosprite } = await fetchFullCharacter(id);
      characters[idx].skills = skills;
      characters[idx].eidolons = eidolons;
      characters[idx].traces = traces;
      if (memosprite) {
        characters[idx].memosprite = memosprite;
      } else {
        delete characters[idx].memosprite;
      }
      const memoInfo = memosprite ? ` 憶靈: ${memosprite.name} (${memosprite.skills.length} 技)` : '';
      process.stdout.write(` ✓${memoInfo}\n`);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      process.stdout.write(` ✗ ${err.message}\n`);
    }
  }

  // 3. 儲存
  console.log('\n💾 儲存 characters.json...');
  writeFileSync(DATA_PATH, JSON.stringify(characters, null, 2), 'utf8');
  console.log('✅ 完成！');
})();
