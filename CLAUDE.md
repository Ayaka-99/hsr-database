# HSR Database — Project Context

## Stack
- Next.js 14, App Router, TypeScript, Tailwind CSS
- No extra UI libraries

## Design
- Dark bg: `#0d0d1a`
- Gold: `#c9a227` | Purple: `#6b4ff5`
- Cards: `backdrop-blur`, hover glow border
- Responsive: mobile-first

## Data
- Source: `https://api.hakush.in/hsr/`
- Images: `https://act-webstatic.hoyoverse.com/`
- Local cache: `data/characters.json`, `data/lightcones.json`

## Types

```ts
export type Path = '巡獵'|'毀滅'|'智識'|'同諧'|'虛無'|'豐饒'|'存護'|'記憶';
export type Element = '火'|'冰'|'雷'|'風'|'量子'|'虛數'|'物理';

export interface Skill {
  name: string;
  description: string;
  type: string;
}

export interface Eidolon {
  rank: 1|2|3|4|5|6;
  name: string;
  description: string;
  image: string;
}

export interface Character {
  id: string;
  name: string;
  rarity: 4|5;
  path: Path;
  element: Element;
  image: string;
  skills: { basic: Skill; skill: Skill; ult: Skill; talent: Skill; technique: Skill; };
  eidolons: Eidolon[];
}

export interface LightCone {
  id: string;
  name: string;
  rarity: 3|4|5;
  path: Path;
  image: string;
  passive: { name: string; description: string[]; };
}
```

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
