/**
 * 將 relicsets.json 的名稱與效果描述從簡體轉為繁體中文
 * 執行方式：npx tsx scripts/patch-relics-tw.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Converter } = require('opencc-js') as { Converter: (opts: { from: string; to: string }) => (s: string) => string };

const toTW = Converter({ from: 'cn', to: 'tw' });
const DATA_DIR = join(process.cwd(), 'data');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const relics = require(join(DATA_DIR, 'relicsets.json')) as {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  type: string;
  effects: { 2: string; 4?: string };
}[];

for (const r of relics) {
  r.name = toTW(r.name);
  r.effects[2] = toTW(r.effects[2]);
  if (r.effects[4]) r.effects[4] = toTW(r.effects[4]);
}

writeFileSync(join(DATA_DIR, 'relicsets.json'), JSON.stringify(relics, null, 2), 'utf-8');
console.log(`✅ 完成！已將 ${relics.length} 個遺器套裝轉為繁體中文`);
