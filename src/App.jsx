import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import PetGrid from './components/PetGrid';
import ResultBoard from './components/ResultBoard';
import { usePets } from './hooks/usePets';
import { useOptimizer } from './hooks/useOptimizer';

/**
 * @component App
 * @description 메인 애플리케이션 컴포넌트입니다.
 * 전체적인 레이아웃 구성과 상태 연동을 담당합니다.
 */
function App() {
  // 1. 상태 및 커스텀 훅 설정
  const [locationCount, setLocationCount] = useState(4); // 파견 장소 개수 (4 또는 5)
  const { pets, ownedPetCount, togglePet, selectAll, clearAll } = usePets();
  const { isCalculating, progress, result, runOptimization } = useOptimizer();

  // 2. 보유 중인 펫들만 필터링 (최적화 연산에 사용)
  const ownedPets = useMemo(() => pets.filter(p => p.isOwned), [pets]);

  // 3. 최적화 실행 핸들러
  const handleRunOptimization = () => {
    runOptimization(ownedPets, locationCount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 헤더: 타이틀 및 장소 설정 */}
      <Header 
        locationCount={locationCount} 
        setLocationCount={setLocationCount} 
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 왼쪽: 결과 대시보드 (우선순위 높음) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <ResultBoard 
              isCalculating={isCalculating}
              progress={progress}
              result={result}
              onRun={handleRunOptimization}
            />
          </div>

          {/* 오른쪽: 보유 펫 선택 영역 */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <PetGrid 
              pets={pets}
              togglePet={togglePet}
              selectAll={selectAll}
              clearAll={clearAll}
              ownedCount={ownedPetCount}
            />
            
            {/* 도움말 카드 */}
            <div className="mt-6 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                시뮬레이터 사용 팁
              </h4>
              <ul className="text-xs text-gray-500 space-y-2 leading-relaxed">
                <li>• <b>보유 펫 선택:</b> 현재 게임 내에서 보유 중인 펫을 모두 체크해 주세요.</li>
                <li>• <b>장소 설정:</b> 파견 가능한 장소의 개수(4개 또는 5개)를 상단에서 선택하세요.</li>
                <li>• <b>최적화 우선순위:</b> 총점(S=4, A=3...)이 가장 높으면서, 펫 사용량과 전설 펫 사용이 적은 조합을 자동으로 찾아냅니다.</li>
                <li>• <b>비동기 연산:</b> '최적화 실행' 시 연산량이 많아도 화면이 멈추지 않도록 설계되었습니다.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 font-medium">
            © 2026 펫 배치 최적화 시뮬레이터 - SPA Edition
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
