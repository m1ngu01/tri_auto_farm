/**
 * @file data.js
 * @description 펫 정보, 장소 정보, 등급 판정 및 보상 규칙을 담은 정적 데이터 파일입니다.
 */

// 1. 펫 원본 데이터 (tmp_pets_list.txt 기반 정제)
export const PET_LIST = [
  { id: 1, name: "쁘띠 에루", stats: { 배려심: "S", 자신감: "B" }, grade: "전설" },
  { id: 2, name: "쁘띠 리뉴아", stats: { 배려심: "S", 예리함: "B" }, grade: "전설" },
  { id: 3, name: "쁘띠 스핔이", stats: { 유대감: "S", 발랄함: "B" }, grade: "전설" },
  { id: 4, name: "낀냥이", stats: { 예리함: "S", 둔감함: "B" }, grade: "전설" },
  { id: 5, name: "핫거부크", stats: { 둔감함: "S", 유대감: "B" }, grade: "전설" },
  { id: 6, name: "쁘띠 선글라스 릴리", stats: { 발랄함: "S", 자신감: "B" }, grade: "전설" },
  { id: 7, name: "괴도제비", stats: { 예리함: "A", 둔감함: "C" }, grade: "희귀" },
  { id: 8, name: "설표", stats: { 유대감: "A", 자신감: "C" }, grade: "희귀" },
  { id: 9, name: "미니카 시장님", stats: { 배려심: "A", 유대감: "C" }, grade: "희귀" },
  { id: 10, name: "말냥젤리", stats: { 배려심: "A", 둔감함: "C" }, grade: "희귀" },
  { id: 11, name: "쁘띠 릴리", stats: { 자신감: "A", 예리함: "C" }, grade: "희귀" },
  { id: 12, name: "베베하망", stats: { 유대감: "A", 배려심: "C" }, grade: "희귀" },
  { id: 13, name: "햄마리", stats: { 발랄함: "A", 둔감함: "C" }, grade: "희귀" },
  { id: 14, name: "먹물소시지", stats: { 자신감: "A", 예리함: "C" }, grade: "희귀" },
  { id: 15, name: "바삭범", stats: { 예리함: "A", 자신감: "C" }, grade: "희귀" },
  { id: 16, name: "쁘띠먀오", stats: { 예리함: "A", 자신감: "C" }, grade: "희귀" },
  { id: 17, name: "쁘띠 크르브르스", stats: { 둔감함: "A", 배려심: "C" }, grade: "희귀" },
  { id: 18, name: "꾸워바라", stats: { 둔감함: "A", 발랄함: "C" }, grade: "희귀" },
  { id: 19, name: "베니냥", stats: { 발랄함: "A", 예리함: "C" }, grade: "희귀" },
];

// 2. 장소 정보
export const LOCATIONS = [
  { id: 1, name: "멜룬 축제 즐기기", primaryStat: "발랄함" },
  { id: 2, name: "물장난치며 놀기", primaryStat: "유대감" },
  { id: 3, name: "물놀이 하며 추억 쌓기", primaryStat: "배려심" },
  { id: 4, name: "파란 장비 화관 만들기", primaryStat: "예리함" },
  { id: 5, name: "돌 조각하기", primaryStat: ["발랄함", "자신감"] }, // 둘 중 높은 것 적용
];

// 3. 등급별 점수 (우선순위 계산용)
export const GRADE_SCORE = {
  S: 4,
  A: 3,
  B: 2,
  C: 1,
  D: 0,
};

// 4. 시간별 보상 데이터
export const REWARDS = {
  "4시간": { S: 3, A: "2~3", B: 2, C: "1~2", D: 1 },
  "8시간": { S: "5~6", A: "4~5", B: "3~4", C: "2~4", D: 2 },
  "15시간": { S: 10, A: 8, B: "6~7", C: "5~6", D: "3~4" },
  "22시간": { S: 14, A: 11, B: 9, C: "7~8", D: 5 },
};

// 5. 등급 판정 로직용 룰 (조합 조건)
// S등급 조건: (A×1 + B×2), (A×2 + D(희귀)×1), (A×2 + C×1), (S + B(전설) + C), (S×1 + A×1)
// A등급 조건: (B(고급) + C(희귀) + C), (B(전설1, 고급1) + D×1), (A + C), (A×1 + D(전설1, 희귀1)), (A×1 + B×1), (S×1 + D×2), (S×1 + C×1)
// B등급 조건: (D×3(전설2, 희귀1)), (C×1 + D×2(희귀2 또는 전설1, 일반1)), (C×2(고급1, 일반1)), (B×1 + D×1), A×1, S×1
// C등급 조건: (D×1(전설)), (D×2(일반1, 희귀1)), (D×3(일반2, 고급1)), C×1, B×1
// D등급 조건: D×1(일반~희귀)
// * 등급 판정은 매우 복잡하므로 optimizer.js에서 펫들의 개별 등급을 먼저 산출한 뒤 매칭 예정
