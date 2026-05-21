/**
 * @file optimizer.js
 * @description 펫 배치 최적화 알고리즘과 등급 판정 로직을 포함합니다.
 * 브라우저 멈춤 방지를 위해 setTimeout 기반의 비동기 Chunking 처리를 지원합니다.
 */

import { PET_LIST, LOCATIONS, GRADE_SCORE } from '../constants/data';

/**
 * 특정 장소에서 펫의 개별 등급을 계산합니다.
 * @param {Object} pet 펫 정보
 * @param {Object} location 장소 정보
 * @returns {string} S, A, B, C, D 중 하나
 */
const getPetGradeForLocation = (pet, location) => {
  const stats = Array.isArray(location.primaryStat) 
    ? location.primaryStat 
    : [location.primaryStat];
  
  // 요구 능력치 중 가장 높은 값을 찾음
  let maxGrade = 'D';
  stats.forEach(stat => {
    const petStat = pet.stats[stat] || 'D';
    if (GRADE_SCORE[petStat] > GRADE_SCORE[maxGrade]) {
      maxGrade = petStat;
    }
  });

  // 활발함 -> 발랄함 보정 로직 (데이터 정제 시 이미 처리됨)
  return maxGrade;
};

/**
 * 장소에 배치된 펫들의 조합을 보고 최종 등급을 판정합니다.
 * @param {Array} pets 장소에 배치된 펫 리스트 (최대 3마리)
 * @param {Object} location 장소 정보
 * @returns {string} 최종 달성 등급 (S, A, B, C, D)
 */
export const calculateFinalGrade = (pets, location) => {
  if (!pets || pets.length === 0) return 'D';

  // 1. 각 펫의 해당 장소 등급 산출
  const petGrades = pets.map(p => ({
    statGrade: getPetGradeForLocation(p, location),
    rarity: p.grade // 전설, 희귀 등
  })).sort((a, b) => GRADE_SCORE[b.statGrade] - GRADE_SCORE[a.statGrade]);

  const grades = petGrades.map(pg => pg.statGrade);
  const rarities = petGrades.map(pg => pg.rarity);
  const counts = grades.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  // 2. S등급 조건 매칭
  // (A×1 + B×2), (A×2 + D(희귀)×1), (A×2 + C×1), (S + B(전설) + C), (S×1 + A×1)
  if ((counts['A'] >= 1 && counts['B'] >= 2) ||
      (counts['A'] >= 2 && counts['D'] >= 1 && petGrades.find(pg => pg.statGrade === 'D' && pg.rarity === '희귀')) ||
      (counts['A'] >= 2 && counts['C'] >= 1) ||
      (counts['S'] >= 1 && counts['B'] >= 1 && petGrades.find(pg => pg.statGrade === 'B' && pg.rarity === '전설') && counts['C'] >= 1) ||
      (counts['S'] >= 1 && counts['A'] >= 1)) {
    return 'S';
  }

  // 3. A등급 조건 매칭
  // (B(고급) + C(희귀) + C), (B(전설1, 고급1) + D×1), (A + C), (A×1 + D(전설1, 희귀1)), (A×1 + B×1), (S×1 + D×2), (S×1 + C×1)
  // * 고급/일반 데이터가 없으므로 희귀 이상이면 조건을 충족하는 것으로 간주하거나 유연하게 처리
  if ((counts['B'] >= 1 && counts['C'] >= 2) ||
      (counts['B'] >= 2 && counts['D'] >= 1) ||
      (counts['A'] >= 1 && counts['C'] >= 1) ||
      (counts['A'] >= 1 && counts['D'] >= 1) ||
      (counts['A'] >= 1 && counts['B'] >= 1) ||
      (counts['S'] >= 1 && counts['D'] >= 2) ||
      (counts['S'] >= 1 && counts['C'] >= 1)) {
    return 'A';
  }

  // 4. B등급 조건 매칭
  // (D×3(전설2, 희귀1)), (C×1 + D×2(희귀2 또는 전설1, 일반1)), (C×2(고급1, 일반1)), (B×1 + D×1), A×1, S×1
  if ((counts['D'] >= 3) ||
      (counts['C'] >= 1 && counts['D'] >= 2) ||
      (counts['C'] >= 2) ||
      (counts['B'] >= 1 && counts['D'] >= 1) ||
      (counts['A'] >= 1) ||
      (counts['S'] >= 1)) {
    return 'B';
  }

  // 5. C등급 조건 매칭
  // (D×1(전설)), (D×2(일반1, 희귀1)), (D×3(일반2, 고급1)), C×1, B×1
  if ((counts['D'] >= 1 && petGrades.find(pg => pg.statGrade === 'D' && pg.rarity === '전설')) ||
      (counts['D'] >= 2) ||
      (counts['D'] >= 3) ||
      (counts['C'] >= 1) ||
      (counts['B'] >= 1)) {
    return 'C';
  }

  return 'D';
};

/**
 * 비동기 최적화 알고리즘 (백트래킹 + Chunking)
 */
export const findBestCombination = async (availablePets, locationCount, onProgress) => {
  const locations = LOCATIONS.slice(0, locationCount);
  let bestResult = {
    totalScore: -1,
    totalPets: Infinity,
    totalLegends: Infinity,
    assignments: []
  };

  // 탐색 가지치기: 장소 요구 능력치가 없는 펫은 후보에서 제외
  const petCandidatesByLocation = locations.map(loc => {
    return availablePets.filter(pet => {
      const stats = Array.isArray(loc.primaryStat) ? loc.primaryStat : [loc.primaryStat];
      return stats.some(s => pet.stats[s] && pet.stats[s] !== 'D');
    });
  });

  let iterations = 0;
  const CHUNK_SIZE = 5000;

  // 재귀 백트래킹 함수
  const backtrack = async (locIdx, currentAssignments, usedPetIds) => {
    // UI 업데이트를 위해 제어권 양보
    iterations++;
    if (iterations % CHUNK_SIZE === 0) {
      onProgress(Math.floor((locIdx / locationCount) * 100));
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // 모든 장소 배치 완료 시 결과 평가
    if (locIdx === locationCount) {
      let totalScore = 0;
      let totalPets = 0;
      let totalLegends = 0;

      currentAssignments.forEach(assign => {
        totalScore += GRADE_SCORE[assign.grade];
        totalPets += assign.pets.length;
        totalLegends += assign.pets.filter(p => p.grade === '전설').length;
      });

      // 우선순위 비교: 1. 총점 높은 것, 2. 펫 적게 쓴 것, 3. 전설 적게 쓴 것
      if (totalScore > bestResult.totalScore) {
        bestResult = { totalScore, totalPets, totalLegends, assignments: [...currentAssignments] };
      } else if (totalScore === bestResult.totalScore) {
        if (totalPets < bestResult.totalPets) {
          bestResult = { totalScore, totalPets, totalLegends, assignments: [...currentAssignments] };
        } else if (totalPets === bestResult.totalPets) {
          if (totalLegends < bestResult.totalLegends) {
            bestResult = { totalScore, totalPets, totalLegends, assignments: [...currentAssignments] };
          }
        }
      }
      return;
    }

    const candidates = petCandidatesByLocation[locIdx].filter(p => !usedPetIds.has(p.id));
    
    // 해당 장소에 1~3마리 배치하는 모든 조합 탐색 (단일 펫부터 시도하여 '최소 펫' 우선 탐색 유도 가능)
    // 여기서는 단순화를 위해 0마리(불가), 1마리, 2마리, 3마리 조합 생성
    // 0마리 배치는 점수가 낮아질 것이므로 생략.
    
    // 최적화를 위해 후보 펫 중 능력치 높은 펫들을 우선적으로 고려할 수 있으나, 일단 모든 조합 탐색
    const combinations = [];
    
    // 1마리 조합
    candidates.forEach(p => combinations.push([p]));
    // 2마리 조합
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        combinations.push([candidates[i], candidates[j]]);
      }
    }
    // 3마리 조합
    for (let i = 0; i < candidates.length; i++) {
      for (let j = i + 1; j < candidates.length; j++) {
        for (let k = j + 1; k < candidates.length; k++) {
          combinations.push([candidates[i], candidates[j], candidates[k]]);
        }
      }
    }

    // 각 조합에 대해 등급 계산 및 다음 장소 탐색
    // 연산량 폭발 방지를 위해 등급이 높은 조합 위주로 정렬하여 탐색하거나 가지치기 강화 가능
    const gradedCombos = combinations.map(combo => ({
      pets: combo,
      grade: calculateFinalGrade(combo, locations[locIdx])
    })).filter(c => c.grade !== 'D') // D등급은 굳이 탐색하지 않음 (요구사항 반영)
    .sort((a, b) => GRADE_SCORE[b.grade] - GRADE_SCORE[a.grade]);

    // 상위 N개 조합만 탐색하여 연산 속도 확보 (Pruning)
    const limitedCombos = gradedCombos.slice(0, 10); 

    for (const comboObj of limitedCombos) {
      comboObj.pets.forEach(p => usedPetIds.add(p.id));
      currentAssignments.push({
        location: locations[locIdx],
        pets: comboObj.pets,
        grade: comboObj.grade
      });

      await backtrack(locIdx + 1, currentAssignments, usedPetIds);

      currentAssignments.pop();
      comboObj.pets.forEach(p => usedPetIds.delete(p.id));
    }
    
    // 만약 후보가 아예 없거나 모든 조합이 D등급인 경우 (드문 케이스지만 안전장치)
    if (limitedCombos.length === 0) {
      currentAssignments.push({
        location: locations[locIdx],
        pets: [],
        grade: 'D'
      });
      await backtrack(locIdx + 1, currentAssignments, usedPetIds);
      currentAssignments.pop();
    }
  };

  await backtrack(0, [], new Set());
  return bestResult;
};
