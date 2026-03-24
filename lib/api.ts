import type { Character, LightCone, Path, Element, RelicSet } from './types';
import charactersData from '../data/characters.json';
import lightconesData from '../data/lightcones.json';
import relicsData from '../data/relicsets.json';

const characters = charactersData as Character[];
const lightcones = lightconesData as LightCone[];
const relics = relicsData as RelicSet[];

// ─── 輔助函式 ─────────────────────────────────────────

/**
 * 將開拓者的 {NICKNAME} 替換為「開拓者 屬性」
 * 其他角色維持原名
 * 支援語言切換（EN/ZH）
 */
export function getDisplayName(character: Character, lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en' && character.nameEn) return character.nameEn;
  if (!character.name.includes('{NICKNAME}')) return character.name;
  return `開拓者 ${character.element}`;
}

// ─── 角色 ─────────────────────────────────────────

export function getAllCharacters(): Character[] {
  // 最新角色排最前（由大到小）
  return [...characters].sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function getCharacterById(id: string): Character | undefined {
  return characters.find(c => c.id === id);
}

export function getCharactersByPath(path: Path): Character[] {
  return characters.filter(c => c.path === path);
}

export function getCharactersByElement(element: Element): Character[] {
  return characters.filter(c => c.element === element);
}

export function getCharactersByRarity(rarity: 4 | 5): Character[] {
  return characters.filter(c => c.rarity === rarity);
}

// ─── 光錐 ─────────────────────────────────────────

export function getAllLightCones(): LightCone[] {
  // 最新光錐排最前（由大到小）
  return [...lightcones].sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function getLightConeById(id: string): LightCone | undefined {
  return lightcones.find(lc => lc.id === id);
}

export function getLightConesByPath(path: Path): LightCone[] {
  return lightcones.filter(lc => lc.path === path);
}

export function getLightConesByRarity(rarity: 3 | 4 | 5): LightCone[] {
  return lightcones.filter(lc => lc.rarity === rarity);
}

// ─── 遺器組合 ─────────────────────────────────────────

export function getAllRelicSets(): RelicSet[] {
  return relics;
}
