import React from 'react';
import PetCard from './PetCard';

/**
 * @component PetGrid
 * @description 보유 펫 목록을 그리드 형태로 표시하고 전체 선택/해제 기능을 제공합니다.
 */
const PetGrid = ({ pets, togglePet, selectAll, clearAll, ownedCount }) => {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            보유 펫 선택
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {ownedCount} / {pets.length}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">클릭하여 보유 중인 펫을 선택하세요.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            전체 선택
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} onToggle={togglePet} />
        ))}
      </div>
    </section>
  );
};

export default PetGrid;
