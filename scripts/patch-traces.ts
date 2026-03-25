/**
 * 重新抓取所有角色行跡（ability traces）資料，修正 ? 佔位符問題
 * 執行方式：npx tsx scripts/patch-traces.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Converter } = require('opencc-js') as { Converter: (opts: { from: string; to: string }) => (s: string) => string };
import type { Character, CharacterTrace } from '../lib/types';

const toTW = Converter({ from: 'cn', to: 'tw' });
const DATA_DIR = join(process.cwd(), 'data');

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
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

/** 將 param_list 填入描述模板 */
function resolveDesc(template: string, params: number[]): string {
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

interface ApiTraceNode {
  anchor: string;
  point_type: number;
  point_name: string | null;
  point_desc: string | null;
  status_add_list: {
    property_type: string;
    value: number;
    name: string;
  }[];
  param_list: number[];
}

interface ApiCharacterDetail {
  skill_trees?: Record<string, Record<string, ApiTraceNode>>;
  memosprite?: {
    skills: Record<string, {
      name: string;
      desc: string;
      type: string | null;
      level: Record<string, { param_list: number[] }>;
    }>;
  };
}

async function main() {
  const manifest = await fetchJson<{ hsr: { latest: string } }>('https://static.nanoka.cc/manifest.json');
  const version = manifest.hsr.latest;
  const BASE_URL = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`版本：${version}\n`);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const characters = require(join(DATA_DIR, 'characters.json')) as Character[];
  console.log(`共 ${characters.length} 個角色，開始更新行跡...\n`);

  let updated = 0;
  for (const char of characters) {
    try {
      process.stdout.write(`[${char.id}] ${char.name}...`);
      const detail = await fetchJson<ApiCharacterDetail>(
        `${BASE_URL}/zh/character/${char.id}.json`
      );

      const traces: CharacterTrace[] = [];

      if (detail.skill_trees) {
        for (const pointLevels of Object.values(detail.skill_trees)) {
          const node = Object.values(pointLevels)[0] as ApiTraceNode;
          if (!node) continue;

          if (node.point_type === 3 && node.point_name) {
            // 能力行跡：正確解析數值
            traces.push({
              anchor: node.anchor,
              type: 'ability',
              name: toTW(node.point_name),
              description: resolveDesc(toTW(stripFormatOnly(node.point_desc)), node.param_list ?? []),
            });
          } else if (node.point_type === 1 && node.status_add_list?.length) {
            // 屬性行跡
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

      // 保留現有 poem 行跡（獻予X之詩）
      const existingPoems = (char.traces ?? []).filter(t => t.anchor.startsWith('poem_'));
      char.traces = [...traces, ...existingPoems];

      updated++;
      process.stdout.write(' ✓\n');
      await new Promise(r => setTimeout(r, 60));
    } catch (err) {
      process.stdout.write(` ⚠ ${(err as Error).message}\n`);
    }
  }

  writeFileSync(join(DATA_DIR, 'characters.json'), JSON.stringify(characters, null, 2), 'utf-8');
  console.log(`\n✅ 完成！已更新 ${updated} 個角色的行跡 → data/characters.json`);
}

main().catch(err => {
  console.error('❌ 發生錯誤：', err);
  process.exit(1);
});
