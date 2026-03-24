# CT杯 數據庫

崩壞：星穹鐵道角色與光錐數據庫

## 功能

- 角色列表：依命途、屬性、星級篩選，支援名稱搜尋
- 角色詳情：技能說明、命座圖片與效果
- 光錐列表：依命途、星級篩選，支援名稱搜尋
- 光錐詳情：被動技能各精煉等級效果
- 繁體中文字體切換（Noto Sans TC）

## 技術

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- 資料來源：[static.nanoka.cc](https://static.nanoka.cc)
- 圖片來源：[Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes)

## 本地開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 更新資料

```bash
npx tsx scripts/fetch-data.ts
```
