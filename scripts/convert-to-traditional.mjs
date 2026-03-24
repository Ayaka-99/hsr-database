/**
 * 將 characters.json 與 lightcones.json 的文字從簡體轉換為繁體中文
 * 執行方式：node scripts/convert-to-traditional.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
const DATA_DIR = join(process.cwd(), 'data');

function convertValue(v) {
  if (typeof v === 'string') return converter(v);
  if (Array.isArray(v)) return v.map(convertValue);
  if (v && typeof v === 'object') {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = convertValue(val);
    return out;
  }
  return v;
}

// 轉換 characters.json
console.log('🔄 轉換 characters.json...');
const chars = JSON.parse(readFileSync(join(DATA_DIR, 'characters.json'), 'utf-8'));
const convertedChars = convertValue(chars);
writeFileSync(join(DATA_DIR, 'characters.json'), JSON.stringify(convertedChars, null, 2), 'utf-8');
console.log(`✅ 完成 ${convertedChars.length} 個角色`);

// 轉換 lightcones.json
console.log('🔄 轉換 lightcones.json...');
const lcs = JSON.parse(readFileSync(join(DATA_DIR, 'lightcones.json'), 'utf-8'));
const convertedLcs = convertValue(lcs);
writeFileSync(join(DATA_DIR, 'lightcones.json'), JSON.stringify(convertedLcs, null, 2), 'utf-8');
console.log(`✅ 完成 ${convertedLcs.length} 個光錐`);

console.log('\n🎉 所有資料已轉換為繁體中文');
