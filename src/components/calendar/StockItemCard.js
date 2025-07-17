const StockItemCard = ({ logo, name, time }) => (
  <div className="flex flex-col items-center">
    <img
      src={logo}
      alt={name}
      className="w-[44px] h-[44px] rounded-lg bg-[#081835]"
    />
    <div className="text-[10px] mt-1 font-semibold">{name}</div>
    <div className="text-[10px] text-gray-600">{time}</div>
  </div>
);
export default StockItemCard;
