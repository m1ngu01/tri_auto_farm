/**
 * @file useOptimizer.js
 * @description 최적화 연산의 비동기 상태(진행률, 로딩, 결과)를 관리하는 커스텀 훅입니다.
 */

import { useState, useCallback } from 'react';
import { findBestCombination } from '../utils/optimizer';

export const useOptimizer = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  /**
   * 최적화 연산을 실행합니다.
   * @param {Array} availablePets 보유한 펫 리스트
   * @param {number} locationCount 장소 개수 (4 또는 5)
   */
  const runOptimization = useCallback(async (availablePets, locationCount) => {
    if (availablePets.length === 0) {
      alert('보유한 펫이 없습니다. 펫을 선택해 주세요.');
      return;
    }

    setIsCalculating(true);
    setProgress(0);
    setResult(null);

    try {
      // Chunking이 적용된 최적화 함수 호출
      const bestCombination = await findBestCombination(
        availablePets, 
        locationCount,
        (p) => setProgress(p) // 진행률 업데이트 콜백
      );
      
      setResult(bestCombination);
    } catch (error) {
      console.error('최적화 연산 중 오류 발생:', error);
      alert('연산 중 오류가 발생했습니다.');
    } finally {
      setIsCalculating(false);
      setProgress(100);
    }
  }, []);

  return {
    isCalculating,
    progress,
    result,
    runOptimization
  };
};
