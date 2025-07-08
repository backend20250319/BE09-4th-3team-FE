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
