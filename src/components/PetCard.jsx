import React from 'react';

/**
 * @component PetCard
 * @description 개별 펫의 정보를 표시하고 선택 상태를 토글하는 카드 컴포넌트입니다.
 */
const PetCard = ({ pet, onToggle }) => {
  const isLegend = pet.grade === '전설';

  return (
    <div
      onClick={() => onToggle(pet.id)}
      className={`relative cursor-pointer group transition-all duration-200 rounded-2xl border-2 p-3 overflow-hidden ${
        pet.isOwned
          ? isLegend 
            ? 'bg-amber-50 border-amber-300 shadow-md ring-1 ring-amber-200' 
            : 'bg-indigo-50 border-indigo-300 shadow-md ring-1 ring-indigo-200'
          : 'bg-white border-gray-100 hover:border-gray-300 grayscale opacity-60'
      }`}
    >
      {/* 등급 뱃지 */}
      <div className={`absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold rounded-bl-lg ${
        isLegend ? 'bg-amber-400 text-white' : 'bg-indigo-400 text-white'
      }`}>
        {pet.grade}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className={`font-bold text-sm truncate ${pet.isOwned ? 'text-gray-900' : 'text-gray-400'}`}>
          {pet.name}
        </h3>
        
        <div className="flex flex-wrap gap-1">
          {Object.entries(pet.stats).map(([stat, grade]) => (
            <div 
              key={stat}
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                pet.isOwned 
                  ? 'bg-white/80 text-gray-700 border border-black/5' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className="opacity-70">{stat}</span>
              <span className={`ml-1 font-bold ${
                grade === 'S' ? 'text-red-500' : grade === 'A' ? 'text-orange-500' : 'text-blue-500'
              }`}>{grade}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 선택 효과 레이어 */}
      {pet.isOwned && (
        <div className="absolute inset-0 bg-white/5 pointer-events-none group-hover:bg-transparent" />
      )}
    </div>
  );
};

export default PetCard;
