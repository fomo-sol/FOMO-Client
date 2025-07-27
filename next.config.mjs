/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eodhd.com",
        pathname: "/img/logos/**", // 모든 로고 이미지 허용
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/user-attachments/**", // GitHub 첨부파일 허용
      },
    ],
  },
  // 프로덕션 환경에서 Dev Tools 비활성화
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },
};
export default nextConfig;
