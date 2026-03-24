/**
 * 修正 characters.json 中 E3/E5 命座圖片 URL
 * 從 API 取得正確的 icon 名稱後更新本地 JSON
 *
 * 執行方式：node scripts/patch-eidolon-images.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../data/characters.json');
const IMG_BASE = 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/master';

// SkillIcon_1001_Ultra.png 的 suffix → 圖片檔名 suffix
const ICON_SUFFIX_MAP = {
  Ultra:   'ultimate',
  BP:      'skill',
  Normal:  'basic_atk',
  Talent:  'talent',
  Maze:    'technique',
};

/** 將 API 回傳的 icon 名稱轉換為 Mar-7th CDN 路徑 */
function iconToUrl(id, iconName) {
  // e.g. "SkillIcon_1001_Ultra.png"
  const match = iconName.match(/SkillIcon_\d+_(.+)\.png$/);
  if (!match) return null;
  const suffix = match[1];
  // Rank1, Rank2, ... → rank1, rank2, ...
  if (suffix.startsWith('Rank')) {
    return `${IMG_BASE}/icon/skill/${id}_rank${suffix.slice(4)}.png`;
  }
  const mapped = ICON_SUFFIX_MAP[suffix];
  if (mapped) {
    return `${IMG_BASE}/icon/skill/${id}_${mapped}.png`;
  }
  return null;
}

async function main() {
  console.log('🔧 修正命座 E3/E5 圖片 URL...\n');

  // 取得版本號
  const manifest = await fetch('https://static.nanoka.cc/manifest.json').then(r => r.json());
  const version = manifest.hsr.latest;
  const BASE_URL = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`版本：${version}\n`);

  const characters = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  let patchCount = 0;

  for (const char of characters) {
    // 只處理有 E3 或 E5 的角色
    const badRanks = char.eidolons.filter(e => e.rank === 3 || e.rank === 5);
    if (badRanks.length === 0) continue;

    try {
      const detail = await fetch(`${BASE_URL}/zh/character/${char.id}.json`).then(r => r.json());
      let changed = false;

      for (const eidolon of char.eidolons) {
        if (eidolon.rank !== 3 && eidolon.rank !== 5) continue;
        const rankData = detail.ranks?.[String(eidolon.rank)];
        if (!rankData?.icon) continue;

        const newUrl = iconToUrl(char.id, rankData.icon);
        if (newUrl && newUrl !== eidolon.image) {
          process.stdout.write(`  [${char.id}] ${char.name} E${eidolon.rank}: ${rankData.icon} → `);
          eidolon.image = newUrl;
          console.log(newUrl.split('/').pop());
          changed = true;
          patchCount++;
        }
      }

      if (changed) {
        await new Promise(r => setTimeout(r, 50));
      }
    } catch (err) {
      console.error(`  ⚠ 跳過 ${char.id} ${char.name}:`, err.message);
    }
  }

  writeFileSync(DATA_PATH, JSON.stringify(characters, null, 2), 'utf-8');
  console.log(`\n✅ 完成！共修正 ${patchCount} 個命座圖片 → data/characters.json`);
}

main().catch(err => {
  console.error('❌ 錯誤：', err);
  process.exit(1);
});
