/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: require("path").join(__dirname, "../../"),
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  },
  images: {
    domains: [
      "localhost",
      "crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com",
    ],
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  typescript: {
    // !! WARN !!
    // 프로덕션 빌드를 위해 타입 체크를 비활성화합니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // 프로덕션 빌드를 위해 ESLint 검사를 비활성화합니다.
    ignoreDuringBuilds: true,
  },
  // 정적 페이지 생성 중 오류를 무시합니다
  onDemandEntries: {
    // 개발 서버가 페이지를 메모리에 유지하는 시간(ms)
    maxInactiveAge: 60 * 60 * 1000,
    // 동시에 메모리에 유지할 페이지 수
    pagesBufferLength: 5,
  },
  // Content Security Policy 설정 추가
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com https://*.vercel.app http://localhost:4000 wss://*.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com; font-src 'self'; frame-ancestors 'none'; object-src 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
