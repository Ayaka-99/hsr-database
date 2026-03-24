# 崩壞星穹鐵道角色資料庫 — Claude Code 專案規劃

## 專案概述

建立一個網頁應用程式，收錄崩壞星穹鐵道所有角色的技能描述、星魂、圖片，以及所有光錐效果與圖片。

---

## 技術棧

| 項目 | 選擇 |
|------|------|
| 框架 | Next.js 14（App Router） |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS |
| 資料來源 | hakush.in API / 靜態 JSON |
| 部署 | Vercel |

---

## 資料來源

### 主要 API
- **角色 & 光錐資料：** `https://api.hakush.in/hsr/`
- **角色圖片：** `https://act-webstatic.hoyoverse.com/`
- **備用 API：** `https://api.mihomo.me/`

### 資料下載指令（在 Claude Code 中執行）
```bash
# 下載所有角色資料
curl https://api.hakush.in/hsr/data/character.json -o data/characters.json

# 下載所有光錐資料
curl https://api.hakush.in/hsr/data/lightcone.json -o data/lightcones.json
```

---

## 資料夾結構

```
hsr-database/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # 首頁（角色列表）
│   ├── characters/
│   │   └── [id]/
│   │       └── page.tsx          # 角色詳情頁
│   └── lightcones/
│       ├── page.tsx              # 光錐列表頁
│       └── [id]/
│           └── page.tsx          # 光錐詳情頁
├── components/
│   ├── CharacterCard.tsx         # 角色卡片
│   ├── SkillSection.tsx          # 技能區塊
│   ├── EidolonGrid.tsx           # 星魂展示
│   ├── LightConeCard.tsx         # 光錐卡片
│   └── FilterBar.tsx             # 篩選列
├── lib/
│   ├── api.ts                    # API 請求函式
│   └── types.ts                  # TypeScript 型別定義
├── data/
│   ├── characters.json           # 本地角色資料
│   └── lightcones.json           # 本地光錐資料
└── public/
    └── images/                   # 快取圖片
```

---

## 頁面功能規格

### 1. 首頁 — 角色列表
- 所有角色卡片（圖片、名稱、命途、屬性）
- 篩選：依命途 / 屬性 / 稀有度
- 搜尋欄：依名稱搜尋
- 點擊卡片跳轉至詳情頁

### 2. 角色詳情頁
- 角色立繪大圖
- 基本資訊（命途、屬性、稀有度）
- 技能區塊：
  - 普攻
  - 戰技
  - 終結技
  - 天賦
  - 秘技
- 星魂 1–6（圖示 + 效果描述）
- 推薦光錐連結

### 3. 光錐列表頁
- 所有光錐卡片（圖片、名稱、命途）
- 依命途 / 稀有度篩選

### 4. 光錐詳情頁
- 光錐圖片
- 被動技能名稱與效果
- 疊層 1–5 效果差異顯示
- 適用命途標示

---

## UI 設計規範

- **主題：** 深色背景（`#0d0d1a`）
- **主色調：** 金色（`#c9a227`）+ 藍紫色（`#6b4ff5`）
- **卡片：** 半透明毛玻璃效果（`backdrop-blur`）
- **星魂：** 六角形格子排列
- **稀有度：** 金色/紫色星星圖示
- **動效：** 卡片 hover 時邊框發光
- **版面：** 響應式，支援手機 / 平板 / 桌機

---

## TypeScript 型別定義

```typescript
// lib/types.ts

export interface Character {
  id: string;
  name: string;
  rarity: 4 | 5;
  path: Path;
  element: Element;
  image: string;
  skills: {
    basic: Skill;
    skill: Skill;
    ult: Skill;
    talent: Skill;
    technique: Skill;
  };
  eidolons: Eidolon[];
}

export interface Skill {
  name: string;
  description: string;
  type: string;
}

export interface Eidolon {
  rank: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  description: string;
  image: string;
}

export interface LightCone {
  id: string;
  name: string;
  rarity: 3 | 4 | 5;
  path: Path;
  image: string;
  passive: {
    name: string;
    description: string[];   // 索引對應疊層 1–5
  };
}

export type Path =
  | '巡獵' | '毀滅' | '智識' | '同諧'
  | '虛無' | '豐饒' | '存護' | '記憶'| '歡愉';

export type Element =
  | '火' | '冰' | '雷' | '風'
  | '量子' | '虛數' | '物理';
```

---

## Claude Code Prompt（直接貼上使用）

```
請幫我建立一個崩壞星穹鐵道角色資料庫網頁，使用 Next.js 14 + TypeScript + Tailwind CSS。

需求：
1. 首頁顯示所有角色卡片，可依命途、屬性、稀有度篩選
2. 角色詳情頁包含：立繪、技能描述（普攻/戰技/終結技/天賦/秘技）、星魂 1-6
3. 光錐列表頁 + 詳情頁，顯示光錐圖片與各疊層被動效果
4. 深色主題，星穹鐵道風格配色（金色 #c9a227 + 藍紫色 #6b4ff5）
5. 響應式設計，卡片有 hover 發光效果

資料來源：
- 從 https://api.hakush.in/hsr/ 取得角色與光錐 JSON 資料
- 先用 fetch script 把資料存成本地 data/*.json
- 圖片從 https://act-webstatic.hoyoverse.com/ 取得

請依照以下順序開發：
Step 1：建立專案結構與 TypeScript 型別
Step 2：撰寫資料抓取腳本（scripts/fetch-data.ts）
Step 3：建立共用元件（CharacterCard、LightConeCard、FilterBar）
Step 4：建立首頁與角色詳情頁
Step 5：建立光錐列表與詳情頁
Step 6：加入篩選與搜尋功能
```

---

## 快速開始

```bash
# Step 1：安裝 Claude Code
npm install -g @anthropic-ai/claude-code

# Step 2：建立並進入專案資料夾
mkdir hsr-database && cd hsr-database

# Step 3：啟動 Claude Code
claude

# Step 4：在 Claude Code 中貼上上方 Prompt 開始開發
```

---

## 備註

- 圖片建議在 build 時預先下載至 `public/images/`，避免瀏覽器直接請求米哈遊伺服器被封鎖
- 若資料 API 有 CORS 限制，改用 Next.js Route Handler 作為代理
- 部署到 Vercel 前確認 `next.config.js` 加入允許的圖片網域
-完成後推到github