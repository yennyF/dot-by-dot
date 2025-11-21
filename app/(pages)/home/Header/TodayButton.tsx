import AppTooltip from "@/app/components/AppTooltip";
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
    <AppTooltip.Root>
      <AppTooltip.Trigger asChild>
        <button className="button-outline button-sm" onClick={handleClick}>
          Today
        </button>
      </AppTooltip.Trigger>
      <AppTooltip.Content align="center">Go to most recent</AppTooltip.Content>
    </AppTooltip.Root>
  );
}
