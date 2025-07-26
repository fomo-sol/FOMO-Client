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
};
export default nextConfig;
