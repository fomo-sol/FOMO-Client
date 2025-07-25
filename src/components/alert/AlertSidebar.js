import AlertTelegramBanner from "./AlertTelegramBanner";
import AlertFilterPanel from "./AlertFilterPanel";
import { useState } from "react";

export default function AlertSidebar({ filter, setFilter }) {
  return (
    <div className="flex max-w-[400px] flex-col items-center gap-4 w-full ">
      <AlertTelegramBanner />
      <AlertFilterPanel filter={filter} setFilter={setFilter} />
    </div>
  );
}
