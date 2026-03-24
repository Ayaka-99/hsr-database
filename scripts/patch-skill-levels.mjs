/**
 * 為 characters.json 中所有角色的技能加入各等級描述（descriptions[]）
 * 執行方式：node scripts/patch-skill-levels.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'characters.json');

// 技能槽 key → API type 值
const TYPE_TO_SLOT = {
  Normal: 'basic',
  BPSkill: 'skill',
  Ultra: 'ult',
  Maze: 'technique',
};

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
    .replace(/\\n/g, '\n')
    .trim();
}

function resolveDesc(template, params) {
  return template.replace(/#(\d+)\[([^\]]+)\](%)?/g, (_, n, fmt, pct) => {
    const p = params[parseInt(n) - 1] ?? 0;
    const val = pct ? p * 100 : p;
    if (fmt === 'i') return Math.round(val) + (pct ? '%' : '');
    const decimals = parseInt(fmt.replace('f', '')) || 1;
    const formatted = val.toFixed(decimals).replace(/\.0+$/, '');
    return formatted + (pct ? '%' : '');
  });
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function main() {
  console.log('📥 取得版本號...');
  const manifest = await fetchJson('https://static.nanoka.cc/manifest.json');
  const version = manifest.hsr.latest;
  const BASE = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`   版本：${version}\n`);

  const characters = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  let updated = 0;

  for (const char of characters) {
    try {
      process.stdout.write(`[${char.id}] ${char.name}...`);
      const detail = await fetchJson(`${BASE}/zh/character/${char.id}.json`);

      for (const apiSkill of Object.values(detail.skills)) {
        const slotKey = apiSkill.type === null
          ? 'talent'
          : (TYPE_TO_SLOT[apiSkill.type] ?? null);
        if (!slotKey || !char.skills[slotKey] || !char.skills[slotKey].name) continue;

        const template = stripFormatOnly(apiSkill.desc);
        const levels = apiSkill.level
          ? Object.keys(apiSkill.level).sort((a, b) => +a - +b)
          : [];

        if (levels.length > 0) {
          char.skills[slotKey].descriptions = levels.map(lv =>
            resolveDesc(template, apiSkill.level[lv].param_list)
          );
          // 更新 description 為第 1 級
          char.skills[slotKey].description = char.skills[slotKey].descriptions[0];
          updated++;
        } else {
          char.skills[slotKey].descriptions = [char.skills[slotKey].description];
        }
      }

      process.stdout.write(' ✓\n');
      await new Promise(r => setTimeout(r, 60));
    } catch (err) {
      console.error(`\n   ⚠ 跳過 ${char.id}:`, err.message);
    }
  }

  writeFileSync(DATA_FILE, JSON.stringify(characters, null, 2), 'utf-8');
  console.log(`\n✅ 完成！共更新 ${updated} 個技能等級資料`);
}

main().catch(err => {
  console.error('❌', err);
  process.exit(1);
});
