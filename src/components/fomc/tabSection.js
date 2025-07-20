// components/fomc/TabSection.jsx
export default function TabSection({ activeTab, setActiveTab }) {
  const tabs = ["금리결정", "연설", "의사록", "경제전망"];

  return (
    <div className="flex justify-center mb-4">
      <div className="w-[259px] h-[40px] rounded-[20px] bg-white/20 flex items-center justify-between px-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 h-[32px] rounded-full text-sm font-semibold transition-all duration-150 ${
              activeTab === tab
                ? "bg-white text-[#040816]"
                : "text-white hover:bg-white/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
