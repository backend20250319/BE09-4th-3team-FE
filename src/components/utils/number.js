/**
 * 숫자에 쉼표(,) 삽입: 1234567 → "1,234,567"
 */
export const numberWithCommas = (number) => {
  const plainNumber = typeof number === "string" ? number.replace(/,/g, "") : String(number);

  return plainNumber.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 쉼표 제거: "1,234,567" → "1234567"
 */
export const uncomma = (value) => {
  return value.replace(/[^0-9]/g, "");
};
