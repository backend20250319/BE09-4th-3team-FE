const { useEffect, useState } = require("react");

const usePersistedState = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const stored = sessionStorage.getItem(key);
    if (stored !== null) {
      try {
        // JSON 파싱이 가능한 값이면 파싱
        const parsed = JSON.parse(stored);
        setValue(parsed);
      } catch {
        // 문자열 그대로 저장되어 있는 경우
        setValue(stored);
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof value === "string") {
      sessionStorage.setItem(key, value); // 문자열은 그대로 저장
    } else {
      sessionStorage.setItem(key, JSON.stringify(value)); // 객체/배열 등은 JSON 저장
    }
  }, [key, value]);

  return [value, setValue];
};

export default usePersistedState;
