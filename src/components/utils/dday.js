export const getDday = (startDate, endDate) => {
  const now = new Date();
  const end = new Date(endDate);

  // 날짜 형식이 잘못되었을 경우
  if (isNaN(end.getTime())) return 0;

  // 마감일의 자정까지 계산 → 다음날 00:00 으로 설정
  end.setHours(0, 0, 0, 0); // 마감일 00:00 기준
  const tomorrowOfEnd = new Date(end);
  tomorrowOfEnd.setDate(end.getDate() + 1); // 다음날 00:00

  const diff = tomorrowOfEnd.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return daysLeft;
};
