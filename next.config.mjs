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
        hostname: "dev.macacolabs.site",
        pathname: "/images/**",
      },
      // 석근 profile_images 패턴 추가
      {
        protocol: "http",
        hostname: "localhost",
        port: "8888",
        pathname: "/profile_images/**",
      },
      {
        protocol: "http",
        hostname: "dev.macacolabs.site",
        port: "8008",
        pathname: "/profile_images/**",
      },
      {
        protocol: "http",
        hostname: "dev.macacolabs.site",
        pathname: "/profile_images/**",
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
