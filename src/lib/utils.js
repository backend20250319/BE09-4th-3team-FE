import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * accessToken이 없으면 로그인 페이지로 이동시키는 함수
 * @returns {string|null} accessToken (있으면 반환, 없으면 이동)
 */
export function requireAccessTokenOrRedirect() {
  const token = sessionStorage.getItem("accessToken")
  if (!token) {
    const currentPath = window.location.pathname + window.location.search
    window.location.href = `/seokgeun/login?redirection=${encodeURIComponent(currentPath)}`
    return null
  }
  return token
}
