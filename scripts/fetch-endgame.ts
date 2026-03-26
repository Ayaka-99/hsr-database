/**
 * 從 static.nanoka.cc API 抓取星穹鐵道終局挑戰資料
 * （忘卻之庭、虛構敘事、末日幻影、異相仲裁）
 *
 * 執行方式：npx tsx scripts/fetch-endgame.ts
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Converter } = require('opencc-js') as { Converter: (opts: { from: string; to: string }) => (s: string) => string };

const toTW = Converter({ from: 'cn', to: 'tw' });

const MANIFEST_URL = 'https://static.nanoka.cc/manifest.json';
const IMG_BASE = 'https://static.nanoka.cc/assets/hsr/monstermiddleicon';
const DATA_DIR = join(process.cwd(), 'data');

// ─── 對照表 ─────────────────────────────────────────
const ELEMENT_MAP: Record<string, string> = {
  Ice: '冰', Fire: '火', Thunder: '雷', Wind: '風',
  Physical: '物理', Quantum: '量子', Imaginary: '虛數',
};

// ─── 輔助函式 ─────────────────────────────────────────
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

/** 移除格式標記並替換佔位符為實際數值 */
function cleanDesc(desc: string | null | undefined, params: number[] = []): string {
  if (!desc) return '';
  let s = desc
    .replace(/<color=[^>]+>/g, '')
    .replace(/<\/color>/g, '')
    .replace(/<\/?unbreak>/g, '')
    .replace(/\{RUBY_B#[^}]+\}/g, '')
    .replace(/\{RUBY_E#\}/g, '')
    .replace(/<\/?[ub]>/g, '')
    .replace(/\\n/g, '\n')
    .trim();
  s = s.replace(/#(\d+)\[([^\]]+)\](%)?/g, (_, n, fmt, pct) => {
    const p = params[parseInt(n) - 1] ?? 0;
    const val = pct ? p * 100 : p;
    if (fmt === 'i') return Math.round(val) + (pct ? '%' : '');
    const decimals = parseInt(fmt.replace('f', '')) || 1;
    return val.toFixed(decimals).replace(/\.0+$/, '') + (pct ? '%' : '');
  });
  return toTW(s);
}

// ─── 怪物查詢 ────────────────────────────────────────
type MonsterMap = Map<string, { name: string; icon: string }>;

async function buildMonsterMap(baseUrl: string): Promise<MonsterMap> {
  console.log('📥 抓取怪物列表...');
  const data = await fetchJson<Record<string, { icon: string; zh: string; en: string }>>(`${baseUrl}/monster.json`);
  const map: MonsterMap = new Map();
  for (const [id, e] of Object.entries(data)) {
    const iconFile = (e.icon ?? '').split('/').pop()?.replace('.png', '.webp') ?? '';
    map.set(id, { name: toTW(e.zh || e.en), icon: iconFile ? `${IMG_BASE}/${iconFile}` : '' });
  }
  console.log(`   共 ${map.size} 個怪物`);
  return map;
}

/** 查找怪物資訊，支援截短 ID（挑戰模式的變體 ID） */
function resolveMonster(id: string | number, monsters: MonsterMap) {
  const sid = String(id);
  if (monsters.has(sid)) return { id: sid, ...monsters.get(sid)! };
  // 嘗試截短 ID（9 位 boss 變體 → 7 位基礎 ID）
  for (let len = sid.length - 1; len >= 5; len--) {
    const prefix = sid.slice(0, len);
    if (monsters.has(prefix)) return { id: sid, ...monsters.get(prefix)! };
  }
  return { id: sid, name: sid, icon: '' };
}

/** 將 API 屬性名轉為繁體中文 */
function mapWeakness(types: string[] | undefined): string[] {
  return (types ?? []).map(t => ELEMENT_MAP[t] ?? t);
}

/** 從 event_id_list 的 monster_list 波次中提取不重複的怪物 ID */
function extractMonsterIds(eventList: any[]): string[] {
  const ids = new Set<string>();
  for (const event of eventList ?? []) {
    for (const wave of event.monster_list ?? []) {
      for (let i = 0; i <= 8; i++) {
        const mid = wave[`monster${i}`];
        if (mid) ids.add(String(mid));
      }
    }
  }
  return Array.from(ids);
}

// ─── 忘卻之庭（Memory of Chaos）──────────────────────
interface MazeListing {
  [id: string]: { zh: string; en: string; live_begin: string; live_end: string; param: number[] };
}

async function fetchMaze(baseUrl: string, monsters: MonsterMap) {
  console.log('\n📥 抓取忘卻之庭...');
  const listing = await fetchJson<MazeListing>(`${baseUrl}/maze.json`);

  // 只抓取輪替賽季（ID >= 1001）
  const seasonIds = Object.keys(listing)
    .filter(id => parseInt(id) >= 1001)
    .sort((a, b) => parseInt(b) - parseInt(a));

  const seasons = [];
  for (const sid of seasonIds) {
    const entry = listing[sid];
    try {
      process.stdout.write(`   [${sid}] ${entry.zh}...`);
      const floors: any[] = await fetchJson(`${baseUrl}/zh/maze/${sid}.json`);

      const processedFloors = floors.map((f: any, idx: number) => ({
        name: `第${['一','二','三','四','五','六','七','八','九','十','十一','十二'][idx]}層`,
        weakness1: mapWeakness(f.damage_type1),
        weakness2: mapWeakness(f.damage_type2),
        monsters1: (f.npc_monster_id_list1 ?? []).map((mid: number) => resolveMonster(mid, monsters)),
        monsters2: (f.npc_monster_id_list2 ?? []).map((mid: number) => resolveMonster(mid, monsters)),
      }));

      seasons.push({
        id: sid,
        name: toTW(entry.zh || entry.en),
        beginTime: entry.live_begin || '',
        endTime: entry.live_end || '',
        buff: floors[0]?.desc ? cleanDesc(floors[0].desc, floors[0].param ?? []) : '',
        floors: processedFloors,
      });

      process.stdout.write(' ✓\n');
      await new Promise(r => setTimeout(r, 60));
    } catch (err) {
      console.error(`\n   ⚠ 跳過 ${sid}:`, (err as Error).message);
    }
  }

  console.log(`   共 ${seasons.length} 個忘卻之庭賽季`);
  return seasons;
}

// ─── 虛構敘事（Pure Fiction）──────────────────────────
async function fetchStory(baseUrl: string, monsters: MonsterMap) {
  console.log('\n📥 抓取虛構敘事...');
  const seasons = [];

  for (let id = 2001; id <= 2030; id++) {
    try {
      process.stdout.write(`   [${id}]...`);
      const data: any = await fetchJson(`${baseUrl}/zh/story/${id}.json`);

      const levels = data.level ?? [];
      const processedFloors = levels.map((lv: any, idx: number) => ({
        name: cleanDesc(lv.name ?? `難度${idx + 1}`),
        weakness1: mapWeakness(lv.damage_type1),
        weakness2: mapWeakness(lv.damage_type2),
        monsters1: (lv.npc_monster_id_list1 ?? []).map((mid: number) => resolveMonster(mid, monsters)),
        monsters2: (lv.npc_monster_id_list2 ?? []).map((mid: number) => resolveMonster(mid, monsters)),
      }));

      const buffs = (data.option ?? [])
        .map((o: any) => ({ name: toTW(o.name ?? ''), desc: cleanDesc(o.desc, o.param ?? []) }))
        .filter((b: any) => b.name);

      seasons.push({
        id: String(id),
        name: toTW(data.name || `虛構敘事 ${id}`),
        beginTime: data.begin_time || '',
        endTime: data.end_time || '',
        buff: cleanDesc(data.buff?.desc, data.buff?.param ?? []),
        buffs,
        floors: processedFloors,
      });

      process.stdout.write(` ${toTW(data.name)} ✓\n`);
      await new Promise(r => setTimeout(r, 60));
    } catch {
      process.stdout.write(' ✗\n');
    }
  }

  seasons.reverse();
  console.log(`   共 ${seasons.length} 個虛構敘事賽季`);
  return seasons;
}

// ─── 末日幻影（Apocalyptic Shadow）──────────────────
async function fetchBoss(baseUrl: string, monsters: MonsterMap) {
  console.log('\n📥 抓取末日幻影...');
  const seasons = [];

  for (let id = 3001; id <= 3030; id++) {
    try {
      process.stdout.write(`   [${id}]...`);
      const data: any = await fetchJson(`${baseUrl}/zh/boss/${id}.json`);

      const levels = data.level ?? [];
      const processedFloors = levels.map((lv: any, idx: number) => {
        const tags1 = (lv.boss_monster_config1?.tag_list ?? []).map((t: any) => ({
          name: toTW(t.name ?? ''),
          desc: cleanDesc(t.desc, t.param ?? []),
        }));
        const tags2 = (lv.boss_monster_config2?.tag_list ?? []).map((t: any) => ({
          name: toTW(t.name ?? ''),
          desc: cleanDesc(t.desc, t.param ?? []),
        }));

        return {
          name: cleanDesc(lv.name ?? `難度${idx + 1}`),
          weakness1: mapWeakness(lv.damage_type1),
          weakness2: mapWeakness(lv.damage_type2),
          monsters1: lv.boss_monster_id1 ? [resolveMonster(lv.boss_monster_id1, monsters)] : [],
          monsters2: lv.boss_monster_id2 ? [resolveMonster(lv.boss_monster_id2, monsters)] : [],
          tags1,
          tags2,
        };
      });

      const buffs = [
        ...(data.buff_list1 ?? []).map((b: any) => ({ name: toTW(b.name ?? ''), desc: cleanDesc(b.desc, b.param ?? []) })),
        ...(data.buff_list2 ?? []).map((b: any) => ({ name: toTW(b.name ?? ''), desc: cleanDesc(b.desc, b.param ?? []) })),
      ].filter((b: any) => b.name);

      seasons.push({
        id: String(id),
        name: toTW(data.name || `末日幻影 ${id}`),
        beginTime: data.begin_time || '',
        endTime: data.end_time || '',
        buff: cleanDesc(data.buff?.desc, data.buff?.param ?? []),
        buffs,
        floors: processedFloors,
      });

      process.stdout.write(` ${toTW(data.name)} ✓\n`);
      await new Promise(r => setTimeout(r, 60));
    } catch {
      process.stdout.write(' ✗\n');
    }
  }

  seasons.reverse();
  console.log(`   共 ${seasons.length} 個末日幻影賽季`);
  return seasons;
}

// ─── 異相仲裁（Anomaly Arbitration）─────────────────
async function fetchPeak(baseUrl: string, monsters: MonsterMap) {
  console.log('\n📥 抓取異相仲裁...');
  const seasons = [];

  for (let id = 1; id <= 20; id++) {
    try {
      process.stdout.write(`   [${id}]...`);
      const data: any = await fetchJson(`${baseUrl}/zh/peak/${id}.json`);

      const floors = (data.pre_level ?? []).map((pl: any) => ({
        name: toTW(pl.name ?? ''),
        weakness1: mapWeakness(Array.isArray(pl.damage_type) ? pl.damage_type : []),
        weakness2: [] as string[],
        monsters1: extractMonsterIds(pl.event_id_list ?? []).map(mid => resolveMonster(mid, monsters)),
        monsters2: [] as any[],
        tags1: (pl.tag_list ?? []).map((t: any) => ({ name: toTW(t.name ?? ''), desc: cleanDesc(t.desc, t.param ?? []) })),
      }));

      // 加入王棋關卡
      if (data.boss_level) {
        const bl = data.boss_level;
        floors.push({
          name: toTW(bl.name ?? '王棋'),
          weakness1: mapWeakness(Array.isArray(bl.damage_type) ? bl.damage_type : []),
          weakness2: [] as string[],
          monsters1: extractMonsterIds(bl.event_id_list ?? []).map(mid => resolveMonster(mid, monsters)),
          monsters2: [] as any[],
          tags1: (bl.tag_list ?? []).map((t: any) => ({ name: toTW(t.name ?? ''), desc: cleanDesc(t.desc, t.param ?? []) })),
        });
      }

      const buffs = (data.boss_config?.buff_list ?? []).map((b: any) => ({
        name: toTW(b.name ?? ''),
        desc: cleanDesc(b.desc, b.param ?? []),
      }));

      const name = cleanDesc(data.name ?? `異相仲裁 ${id}`, []).replace(/\n/g, ' ');

      seasons.push({
        id: String(id),
        name,
        beginTime: '',
        endTime: '',
        buff: '',
        buffs,
        floors,
      });

      process.stdout.write(` ${name} ✓\n`);
      await new Promise(r => setTimeout(r, 60));
    } catch {
      process.stdout.write(' ✗\n');
    }
  }

  seasons.reverse();
  console.log(`   共 ${seasons.length} 個異相仲裁賽季`);
  return seasons;
}

// ─── 主程式 ─────────────────────────────────────────
async function main() {
  console.log('🚀 HSR 終局挑戰資料抓取工具\n');
  mkdirSync(DATA_DIR, { recursive: true });

  // 1. 取得最新版本號
  const manifest = await fetchJson<{ hsr: { latest: string } }>(MANIFEST_URL);
  const version = manifest.hsr.latest;
  const BASE_URL = `https://static.nanoka.cc/hsr/${version}`;
  console.log(`   版本：${version}\n`);

  // 2. 建立怪物查詢表
  const monsters = await buildMonsterMap(BASE_URL);

  // 3. 抓取四種終局模式
  const maze = await fetchMaze(BASE_URL, monsters);
  const story = await fetchStory(BASE_URL, monsters);
  const boss = await fetchBoss(BASE_URL, monsters);
  const peak = await fetchPeak(BASE_URL, monsters);

  // 4. 儲存
  const output = { maze, story, boss, peak };
  writeFileSync(
    join(DATA_DIR, 'endgame.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
  );

  console.log(`\n✅ 已儲存終局挑戰資料 → data/endgame.json`);
  console.log(`   忘卻之庭: ${maze.length} | 虛構敘事: ${story.length} | 末日幻影: ${boss.length} | 異相仲裁: ${peak.length}`);
  console.log('\n🎉 完成！');
}

main().catch(err => {
  console.error('❌ 發生錯誤：', err);
  process.exit(1);
});
