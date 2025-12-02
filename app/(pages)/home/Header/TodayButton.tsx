import { useScrollStore } from "@/app/stores/scrollStore";
import { Tooltip } from "radix-ui";
import stylesTooltip from "@/app/styles/tooltip.module.scss";

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
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="button-outline button-sm" onClick={handleClick}>
            Today
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={stylesTooltip.content}
            align="center"
            side="bottom"
            sideOffset={5}
          >
            Go to most recent
            <Tooltip.Arrow className={stylesTooltip.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
