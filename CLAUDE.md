# HSR Database — Project Context

## Skills
- skills/frontend-design.md
- skills/tailwind-v4-shadcn.md
- skills/web-performance.md

## Stack
- Next.js 14, App Router, TypeScript, Tailwind CSS
- No extra UI libraries

## Design
- Dark bg: `#0d0d1a`
- Gold: `#c9a227` | Purple: `#6b4ff5`
- Cards: `backdrop-blur`, hover glow border
- Responsive: mobile-first

- Frontend design guidance: see `skills/frontend-design.md`

## Data
- Source: `https://api.hakush.in/hsr/`
- Images: `https://act-webstatic.hoyoverse.com/`
- Local cache: `data/characters.json`, `data/lightcones.json`

## Types
- See `lib/types.ts`

## Structure
```
app/
  page.tsx                  # character list
  characters/[id]/page.tsx  # character detail
  lightcones/page.tsx       # lightcone list
  lightcones/[id]/page.tsx  # lightcone detail
components/
  CharacterCard.tsx
  SkillSection.tsx
  EidolonGrid.tsx
  LightConeCard.tsx
  FilterBar.tsx
lib/
  api.ts
  types.ts
data/
  characters.json
  lightcones.json
scripts/
  fetch-data.ts
```

## Rules
- No confirm, just do it
- One file per task
- Use local JSON, not live API calls in components
- All text in Traditional Chinese
- 新增任何內容（UI 文字、註解、變數名稱以外的字串）一律使用繁體中文寫入
