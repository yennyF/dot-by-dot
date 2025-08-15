import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { useAppStore } from "@/app/stores/AppStore";

export default function TodayButton() {
  const todayRef = useAppStore((s) => s.todayRef);

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            if (todayRef) {
              todayRef.current?.scrollIntoView({
                block: "end",
                behavior: "smooth",
                inline: "start",
              });
            }
          }}
        >
          Today
        </button>
      </AppTrigger>
      <AppContent>Go to recent</AppContent>
    </AppTooltip>
  );
}
