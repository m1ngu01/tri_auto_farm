import React from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';

/**
 * @component Header
 * @description 앱의 타이틀과 장소 개수 설정을 담당하는 컴포넌트입니다.
 */
const Header = ({ locationCount, setLocationCount }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            펫 배치 최적화 시뮬레이터
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 px-3 text-sm font-medium text-gray-500">
            <Settings className="w-4 h-4" />
            <span>파견 장소 설정</span>
          </div>
          <div className="flex gap-1">
            {[4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setLocationCount(num)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  locationCount === num
                    ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {num}개
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
