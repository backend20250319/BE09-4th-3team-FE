// 시작일과 종료일 사이의 기간(일수)을 반환
export const getDday = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  // 날짜 형식이 잘못되었을 경우
  if (isNaN(start) || isNaN(end)) return 0;

  const diff = end - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
