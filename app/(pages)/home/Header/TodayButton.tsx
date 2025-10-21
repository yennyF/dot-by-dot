import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
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
      <AppTooltipTrigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          Today
        </button>
      </AppTooltipTrigger>
      <AppContentTrigger align="center">Go to most recent</AppContentTrigger>
    </AppTooltip>
  );
}
