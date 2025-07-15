import Image from "next/image";

export default function Home() {
  return (
    <div className="items-center justify-items-center pt-10">
      <img src="/FOMO.png" alt="FOMO Logo" />
      제목은 왼쪽이랑 위 padding 6으로만 맞추고 개발하면 될듯 합니다 <br />
      이하 코드 작성 고고! (grid로 가로축 나누는 등)
    </div>
  );
}
