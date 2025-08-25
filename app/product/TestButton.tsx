"use client";

import clsx from "clsx";
import { AppTooltip, AppTrigger, AppContent } from "../components/AppTooltip";

export default function TestButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button
          className={clsx(
            "mt-5 cursor-pointer text-xs hover:text-[var(--inverted)] hover:underline",
            disabled &&
              "text-[var(--gray)] hover:cursor-default hover:text-[var(--gray)] hover:no-underline"
          )}
          disabled={disabled}
          onClick={onClick}
        >
          Only here for testing
        </button>
      </AppTrigger>
      <AppContent className="p-2" side="right" sideOffset={10}>
        <h2 className="text-sm font-bold">Want a quick preview?</h2>

        <p className="mt-[10px] leading-relaxed">
          Fill with sample data to explore the app.
          <br />
          You can reset the data anytime from Settings.
        </p>
      </AppContent>
    </AppTooltip>
  );
}
