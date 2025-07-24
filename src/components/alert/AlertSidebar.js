import AlertTelegramBanner from "./AlertTelegramBanner";
import AlertFilterPanel from "./AlertFilterPanel";
import { useState } from "react";

export default function AlertSidebar({ filter, setFilter }) {
  return (
    <div className="flex flex-col items-center gap-4 w-[284px]">
      <AlertTelegramBanner />
      <AlertFilterPanel filter={filter} setFilter={setFilter} />
    </div>
  );
}
