"use client";

import { useAppStore } from "@/app/stores/AppStore";
import { Switch } from "radix-ui";

export default function SwitchMode() {
  const testMode = useAppStore((s) => s.testMode);
  const setTestMode = useAppStore((s) => s.setTestMode);

  const handleCheckedChange = () => {
    setTestMode(!testMode);
  };

  return (
    <div className="flex items-center gap-2 px-5">
      <label>Test mode</label>
      <Switch.Root
        className="relative h-[32px] w-[62px] cursor-pointer rounded-full bg-[var(--black)] outline-none data-[state=checked]:bg-[var(--accent)]"
        onCheckedChange={handleCheckedChange}
        checked={testMode}
      >
        <Switch.Thumb className="flex h-[27px] w-[34px] translate-x-[4px] items-center justify-center rounded-full bg-[var(--background)] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[24px]">
          {testMode ? (
            <span className="text-[11px]">on</span>
          ) : (
            <span className="text-[11px]">off</span>
          )}
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
}
