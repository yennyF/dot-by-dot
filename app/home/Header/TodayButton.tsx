import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { useScrollStore } from "@/app/stores/scrollStore";

export default function TodayButton() {
  const todayRef = useScrollStore((s) => s.todayRef);

  const handleClick = () => {
    todayRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
      inline: "start",
    });
  };

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          Today
        </button>
      </AppTrigger>
      <AppContent align="start">Go to most recent</AppContent>
    </AppTooltip>
  );
}
