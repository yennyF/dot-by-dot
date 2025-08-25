"use client";

import { AppTooltip, AppTrigger, AppContent } from "../components/AppTooltip";

export default function TestButton({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button
          className="mt-5 text-xs hover:text-[var(--inverted)] hover:underline"
          disabled={isLoading}
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
