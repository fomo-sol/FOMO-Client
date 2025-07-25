// components/fomc/TabSection.jsx
export default function TabSection({
  activeTab,
  setActiveTab,
  divType = "decisions",
  onTabClick,
}) {
  const tabs = ["금리결정", "연설", "의사록"];

  const handleTabClick = (tab) => {
    if (onTabClick) {
      onTabClick(tab);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <div className="w-[259px] h-[40px] rounded-[20px] bg-white/20 flex items-center justify-between px-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 h-[32px] rounded-full cursor-pointer text-sm font-semibold transition-all duration-150 ${
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
