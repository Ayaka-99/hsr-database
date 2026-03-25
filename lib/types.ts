export type Path = '巡獵' | '毀滅' | '智識' | '同諧' | '虛無' | '豐饒' | '存護' | '記憶' | '歡愉';
export type Element = '火' | '冰' | '雷' | '風' | '量子' | '虛數' | '物理';

export interface Skill {
  name: string;
  description: string;       // 第 1 級描述（向後兼容）
  descriptions: string[];    // 第 1–15 級描述
  type: string;
}

export interface Eidolon {
  rank: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  description: string;
  image: string;
}

export interface CharacterTrace {
  anchor: string;
  type: 'ability' | 'stat';
  name: string;
  description?: string;    // ability traces only（單等級）
  descriptions?: string[]; // 多等級行跡（如「獻予X之詩」，Lv.1–7）
  statType?: string;       // stat traces only
  value?: number;          // stat traces only
}

export interface MemospriteSkill {
  id: string;
  name: string;
  description: string;
  descriptions: string[];
}

export interface Memosprite {
  name: string;
  skills: MemospriteSkill[];
}

export interface CharacterStats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  critRate: number;
  critDmg: number;
}

export interface Character {
  id: string;
  name: string;
  nameEn?: string;
  rarity: 4 | 5;
  path: Path;
  element: Element;
  image: string;
  stats?: CharacterStats;
  skills: {
    basic: Skill;
    skill: Skill;
    ult: Skill;
    talent: Skill;
    technique: Skill;
  };
  eidolons: Eidolon[];
  traces?: CharacterTrace[];
  memosprite?: Memosprite;
}

export interface RelicSet {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  type: 'relic' | 'ornament';
  effects: { 2: string; 4?: string };
}

export interface LightConeStats {
  hp: number;
  atk: number;
  def: number;
}

export interface LightCone {
  id: string;
  name: string;
  rarity: 3 | 4 | 5;
  path: Path;
  image: string;
  stats?: LightConeStats;
  passive: {
    name: string;
    description: string[];
  };
}
