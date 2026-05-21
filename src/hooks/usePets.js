/**
 * @file usePets.js
 * @description LocalStorage 연동 및 보유 펫 상태를 관리하는 커스텀 훅입니다.
 */

import { useState, useEffect } from 'react';
import { PET_LIST } from '../constants/data';

const STORAGE_KEY = 'tri_auto_farm_owned_pets';

export const usePets = () => {
  // 초기 상태: LocalStorage에서 불러오거나 없으면 빈 배열
  const [ownedPetIds, setOwnedPetIds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 상태 변경 시 LocalStorage 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedPetIds));
  }, [ownedPetIds]);

  /**
   * 펫 보유 여부를 토글합니다.
   * @param {number} petId 
   */
  const togglePet = (petId) => {
    setOwnedPetIds(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId) 
        : [...prev, petId]
    );
  };

  /**
   * 모든 펫을 보유 상태로 변경합니다.
   */
  const selectAll = () => {
    setOwnedPetIds(PET_LIST.map(p => p.id));
  };

  /**
   * 보유 펫 목록을 초기화합니다.
   */
  const clearAll = () => {
    setOwnedPetIds([]);
  };

  // 전체 펫 리스트에 보유 여부 속성 추가하여 반환
  const petsWithStatus = PET_LIST.map(pet => ({
    ...pet,
    isOwned: ownedPetIds.includes(pet.id)
  }));

  return {
    pets: petsWithStatus,
    ownedPetCount: ownedPetIds.length,
    togglePet,
    selectAll,
    clearAll
  };
};
