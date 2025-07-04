const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8888",
        pathname: "/images/**", // 실제 이미지 경로에 따라 조정
      },
    ],
  },
};

// 프록시 설정
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
