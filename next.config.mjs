/** @type {import('next').NextConfig} */
const nextConfig = {};

// --- [프론트엔드 /api 요청을 백엔드로 프록시하는 rewrite 설정 추가] ---
export async function rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: "http://localhost:8888/api/:path*",
    },
  ];
}

export default {
  ...nextConfig,
  rewrites,
};
