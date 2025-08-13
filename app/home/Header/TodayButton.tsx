import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { Link } from "@/app/components/Scroll";

export default function TodayButton() {
  // const targetRef = useRef<HTMLElement>(null);
  // const isVisible = useOnScreen(targetRef);

  // useEffect(() => {
  //   const el = document.getElementById("element-today");
  //   if (!el) return;
  //   targetRef.current = el;
  // }, []);

  return (
    <Link
      to="element-today"
      options={{ block: "end", behavior: "smooth", inline: "start" }}
      autoScroll={true}
    >
      <AppTooltip>
        <AppTrigger asChild>
          <button
            className="button-outline button-sm"
            // disabled={isVisible}
          >
            Today
          </button>
        </AppTrigger>
        <AppContent>Go to recent</AppContent>
      </AppTooltip>
    </Link>
  );
}
