/**
 * 為現有 lightcones.json 補充滿級屬性（HP/ATK/DEF at Lv.80）
 * 執行方式：npx tsx scripts/patch-lightcone-stats.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

interface LcStatEntry {
  max_level: number;
  base_hp: number;
  base_hp_add: number;
  base_attack: number;
  base_attack_add: number;
  base_defence: number;
  base_defence_add: number;
}

interface LcDetail {
  stats: LcStatEntry[];
}

async function main() {
  // 取得版本號
  const manifest = await fetchJson<{ hsr: { latest: string } }>('https://static.nanoka.cc/manifest.json');
  const version = manifest.hsr.latest;
  const BASE_URL = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`版本：${version}\n`);

  // 讀取現有資料
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const lightcones = require(join(DATA_DIR, 'lightcones.json')) as { id: string; stats?: unknown }[];
  console.log(`共 ${lightcones.length} 個光錐，開始補充屬性...\n`);

  let updated = 0;
  for (const lc of lightcones) {
    try {
      process.stdout.write(`[${lc.id}]...`);
      const detail = await fetchJson<LcDetail>(`${BASE_URL}/zh/lightcone/${lc.id}.json`);

      // 找到最高晉升階段（max_level=80）
      const maxStage = detail.stats?.find(s => s.max_level === 80);
      if (maxStage) {
        const levels = maxStage.max_level - (maxStage.max_level === 80 ? 70 : 60);
        lc.stats = {
          hp:  Math.round(maxStage.base_hp + maxStage.base_hp_add * levels),
          atk: Math.round(maxStage.base_attack + maxStage.base_attack_add * levels),
          def: Math.round(maxStage.base_defence + maxStage.base_defence_add * levels),
        };
        updated++;
        process.stdout.write(' ✓\n');
      } else {
        process.stdout.write(' (無滿級資料)\n');
      }

      await new Promise(r => setTimeout(r, 50));
    } catch (err) {
      process.stdout.write(` ⚠ ${(err as Error).message}\n`);
    }
  }

  writeFileSync(join(DATA_DIR, 'lightcones.json'), JSON.stringify(lightcones, null, 2), 'utf-8');
  console.log(`\n✅ 完成！已更新 ${updated} 個光錐的屬性 → data/lightcones.json`);
}

main().catch(err => {
  console.error('❌ 發生錯誤：', err);
  process.exit(1);
});
