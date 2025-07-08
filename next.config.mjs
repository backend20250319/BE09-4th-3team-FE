const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // ✅ localhost 이미지 허용
      {
        protocol: "http",
        hostname: "localhost",
        port: "8888",
        pathname: "/images/**",
      },
      // ✅ 외부 FTP 이미지 서버 허용
      {
        protocol: "http",
        hostname: "dev.macacolabs.site",
        port: "8008",
        pathname: "/images/**",
      },
    ],
  },
};

// ✅ API 프록시 설정
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
