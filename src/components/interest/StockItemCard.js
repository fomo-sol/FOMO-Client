import React from "react";
import { motion } from "framer-motion";

export default function StockItemCard({ stock, selected, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center space-y-3 cursor-pointer transition-all duration-300 ${
        selected ? "scale-105" : ""
      }`}
    >
      <div
        className={`w-[92px] h-[92px] bg-white rounded-[5px] flex items-center justify-center transition-colors duration-300 ${
          selected ? "border-4 border-yellow-400" : ""
        }`}
      >
        <img
          src={stock.logo}
          alt={stock.name}
          className="w-[70%] h-[70%] object-contain"
        />
      </div>
      <span className="text-[18px] font-regular text-[#F7F7F7] text-center">
        {stock.name}
      </span>
    </motion.div>
  );
}
