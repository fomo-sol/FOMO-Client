export default function AlertFilterPanel() {
  return (
    <div className="w-full h-[562px] flex-shrink-0 rounded-[12px] bg-[#FFFFFF] shadow-md text-[#040816] px-6 py-4 text-sm font-[Pretendard] space-y-6">
      <div>
        <p className="mb-2 font-semibold">알림 유형</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            전체 알림
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            맞춤형 알림
          </label>
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">관심 종목</p>
        <div className="space-y-1">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <img
                  src="https://eodhd.com/img/logos/US/NVDA.png"
                  alt="NVDA"
                  className="w-5 h-5"
                />
                <span className="font-semibold">NVIDIA</span>
                <span className="text-sm">NVDA</span>
                <input type="checkbox" className="ml-auto" />
              </label>
            ))}
        </div>
      </div>
    </div>
  );
}
