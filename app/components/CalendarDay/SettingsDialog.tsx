"use client";

import { Dialog } from "radix-ui";
import { ReactNode, useState } from "react";
import { useClearHistory } from "@/app/hooks/useClearHistory";
import { useDemo } from "@/app/hooks/useDemo";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export default function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className="overlay">
            <Content />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

function Content() {
  const { clearHistory, isLoading: isHistoryLoading } = useClearHistory();
  const { runDemo, isLoading: isDemoLoading } = useDemo();

  return (
    <Dialog.Content className="dialog-content z-20 flex w-[350px] flex-col gap-3 overflow-scroll">
      <Dialog.Title className="dialog-title">Settings</Dialog.Title>

      <div className="flex flex-col gap-10">
        <div>
          <Subhead>
            <h2 className="font-bold text-red-600">Clear history</h2>
          </Subhead>
          <span className="block">
            Once you delete your history, there is no going back. Please be
            certain.
          </span>
          <button
            className="button-outline mt-2"
            disabled={isHistoryLoading}
            onClick={clearHistory}
          >
            Clear
          </button>
        </div>
        <div>
          <Subhead>
            <h2 className="font-bold">Demo</h2>
          </Subhead>
          <div>
            <span className="mt-2 block">
              Fill with random data for demo purposes. This action will replace
              your all your current data.
            </span>
            <button
              className="button-outline mt-2"
              disabled={isDemoLoading}
              onClick={runDemo}
            >
              Demo
            </button>
          </div>
        </div>
      </div>
    </Dialog.Content>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 border-b-[1px] border-[var(--gray)] pb-2">
      {children}
    </div>
  );
}
