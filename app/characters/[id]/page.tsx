import { notFound } from 'next/navigation';
import { getCharacterById, getAllCharacters, getDisplayName } from '@/lib/api';
import SkillSection from '@/components/SkillSection';
import EidolonGrid from '@/components/EidolonGrid';
import AvatarImage from '@/components/AvatarImage';

// 屬性顏色
const ELEMENT_COLOR: Record<string, string> = {
  '火': 'text-orange-400',
  '冰': 'text-cyan-400',
  '雷': 'text-yellow-300',
  '風': 'text-emerald-400',
  '量子': 'text-violet-400',
  '虛數': 'text-amber-300',
  '物理': 'text-gray-300',
};

// 靜態生成所有角色頁面
export function generateStaticParams() {
  return getAllCharacters().map(c => ({ id: c.id }));
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = getCharacterById(id);
  if (!character) notFound();

  const isGold = character.rarity === 5;
  const displayName = getDisplayName(character);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 角色頭部 */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        {/* 角色圖片 */}
        <div className={`
          relative w-full sm:w-48 aspect-square sm:h-48 rounded-xl overflow-hidden shrink-0
          border bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a]
          ${isGold ? 'border-[#c9a227]/40' : 'border-violet-500/40'}
        `}>
          <AvatarImage
            src={character.image}
            alt={displayName}
            className="object-contain p-4"
          />
        </div>

        {/* 角色基本資訊 */}
        <div className="flex flex-col justify-center gap-2">
          <div className={`text-sm font-semibold ${isGold ? 'text-[#c9a227]' : 'text-violet-400'}`}>
            {'★'.repeat(character.rarity)}
          </div>
          <h1 className="text-3xl font-bold text-white">{displayName}</h1>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-500">命途  </span>
              <span className="text-white font-medium">{character.path}</span>
            </div>
            <div>
              <span className="text-gray-500">屬性  </span>
              <span className={`font-medium ${ELEMENT_COLOR[character.element] ?? 'text-white'}`}>
                {character.element}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 技能 */}
      <div className="mb-8">
        <SkillSection skills={character.skills} />
      </div>

      {/* 命座 */}
      {character.eidolons.length > 0 && (
        <EidolonGrid eidolons={character.eidolons} />
      )}
    </div>
  );
}
