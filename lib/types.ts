export type Path = '巡獵' | '毀滅' | '智識' | '同諧' | '虛無' | '豐饒' | '存護' | '記憶';
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

export interface LightCone {
  id: string;
  name: string;
  rarity: 3 | 4 | 5;
  path: Path;
  image: string;
  passive: {
    name: string;
    description: string[];
  };
}
