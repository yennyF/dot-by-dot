"use client";

import { Dialog } from "radix-ui";
import { ReactNode, useRef, useState } from "react";
import { notifyLoadError, notifyLoading } from "../Notification";
import { Id, toast } from "react-toastify";
import { db } from "@/app/repositories/db";
import { useTrackStore } from "@/app/stores/TrackStore";

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
  const initTracks = useTrackStore((s) => s.initTracks);

  const toastId = useRef<Id>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function clearHistory() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      await db.tracks.clear();
      initTracks();
    } catch (error) {
      console.error(error);
      notifyLoadError();
    }

    toast.dismiss(toastId.current);
    setIsLoading(false);
  }

  async function deleteDB() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      // await db.close();
      // await db.delete();
      // destroyGroups();
      // destroyTasks();
      // destroyTracks();
      db.tables.forEach((table) => table.clear());
    } catch (error) {
      console.error(error);
      notifyLoadError();
    }

    toast.dismiss(toastId.current);
    setIsLoading(false);
  }

  return (
    <Dialog.Content className="dialog-content z-20 flex w-[350px] flex-col gap-3 overflow-scroll">
      <Dialog.Title className="dialog-title">Settings</Dialog.Title>

      <div className="flex flex-col gap-10">
        <div>
          <Subhead>
            <h2 className="font-bold">Clear history</h2>
          </Subhead>
          <span className="block">
            This will remove all your progress — like streaks and completions —
            but keep your habits.
            <br />
            Once you delete your history, there is no going back. Please be
            certain.
          </span>
          <button
            className="button-outline mt-2"
            disabled={isLoading}
            onClick={clearHistory}
          >
            Clear
          </button>
        </div>
        <div>
          <Subhead>
            <h2 className="font-bold">Reset account</h2>
          </Subhead>
          <div>
            <span className="mt-2 block">
              This will fully reset your account: it will delete all your
              habits, groups, and tracking history — like starting fresh.
              <br />
              Once you delete your history, there is no going back. Please be
              certain.
            </span>
            <button
              className="button-outline mt-2"
              disabled={isLoading}
              onClick={deleteDB}
            >
              Delete
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
