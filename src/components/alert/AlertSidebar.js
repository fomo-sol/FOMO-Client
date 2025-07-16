import AlertTelegramBanner from "./AlertTelegramBanner";
import AlertFilterPanel from "./AlertFilterPanel";

export default function AlertSidebar() {
  return (
    <div className="flex flex-col items-center gap-4 w-[284px]">
      <AlertTelegramBanner />
      <AlertFilterPanel />
    </div>
  );
}
