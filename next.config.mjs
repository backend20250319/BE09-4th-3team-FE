/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8888",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "dev.macacolabs.site",
        port: "8008",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "dev.macacolabs.site", // ✅ 포트 없는 요청도 허용
        pathname: "/images/**",
      },
    ],
    // 여기에 domains 배열 추가 (Image src에서 http://localhost:8888/ 경로 허용)
    domains: ["localhost", "dev.macacolabs.site"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8888/api/:path*",
      },
    ];
  },
};

export default nextConfig;
