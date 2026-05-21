import React from 'react';
import { Play, Loader2, Award, Clock, TrendingUp } from 'lucide-react';
import { REWARDS } from '../constants/data';

/**
 * @component ResultBoard
 * @description 최적화 실행 버튼, 로딩 상태, 결과 카드 및 보상 표를 표시합니다.
 */
const ResultBoard = ({ isCalculating, progress, result, onRun }) => {
  return (
    <section className="space-y-6">
      {/* 실행 버튼 영역 */}
      <div className="flex flex-col items-center justify-center p-8 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-200 text-white">
        <h2 className="text-xl font-bold mb-2">최적의 조합 찾기</h2>
        <p className="text-indigo-100 text-sm mb-6 text-center">
          보유한 펫을 분석하여 최대 보상을 받을 수 있는<br/>최적의 배치를 계산합니다.
        </p>
        
        <button
          onClick={onRun}
          disabled={isCalculating}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
            isCalculating 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-white text-indigo-600 hover:scale-105 hover:shadow-indigo-400/50 active:scale-95'
          }`}
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>계산 중... {progress}%</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>최적화 실행</span>
            </>
          )}
        </button>

        {isCalculating && (
          <div className="w-full max-w-xs bg-indigo-800/50 h-1.5 rounded-full mt-6 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* 결과 출력 영역 */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">최적화 결과</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {result.assignments.map((assign, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 mb-0.5">LOCATION {idx + 1}</span>
                    <h3 className="font-bold text-gray-900 leading-tight">{assign.location.name}</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${
                    assign.grade === 'S' ? 'bg-red-50 text-red-500' :
                    assign.grade === 'A' ? 'bg-orange-50 text-orange-500' :
                    assign.grade === 'B' ? 'bg-blue-50 text-blue-500' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {assign.grade}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    배치된 펫 ({assign.pets.length}마리)
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {assign.pets.length > 0 ? assign.pets.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                        <span className="font-medium text-gray-700">{p.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.grade === '전설' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {p.grade}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400 italic py-2">배치 가능한 펫 없음</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 예상 보상 표 */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">시간별 예상 총 보상</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">파견 시간</th>
                    {result.assignments.map((_, i) => (
                      <th key={i} className="px-6 py-4 whitespace-nowrap">장소 {i + 1}</th>
                    ))}
                    <th className="px-6 py-4 bg-indigo-50 text-indigo-600">총 합계</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {Object.entries(REWARDS).map(([time, values]) => {
                    let minSum = 0;
                    let maxSum = 0;

                    const rowValues = result.assignments.map(assign => {
                      const rewardVal = values[assign.grade];
                      if (typeof rewardVal === 'string') {
                        const [min, max] = rewardVal.split('~').map(Number);
                        minSum += min;
                        maxSum += max;
                        return rewardVal;
                      } else {
                        minSum += rewardVal;
                        maxSum += rewardVal;
                        return rewardVal;
                      }
                    });

                    return (
                      <tr key={time} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{time}</td>
                        {rowValues.map((val, i) => (
                          <td key={i} className="px-6 py-4 text-gray-600">{val}</td>
                        ))}
                        <td className="px-6 py-4 bg-indigo-50/30 font-black text-indigo-700">
                          {minSum === maxSum ? minSum : `${minSum}~${maxSum}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResultBoard;
