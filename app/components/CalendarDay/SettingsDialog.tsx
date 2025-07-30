"use client";

import { db } from "@/app/repositories/db";
import { useGroupStore } from "@/app/stores/GroupStore";
import { useTaskStore } from "@/app/stores/TaskStore";
import { useTrackStore } from "@/app/stores/TrackStore";
import { Dialog } from "radix-ui";
import { ReactNode, use, useState } from "react";
import { Id, toast } from "react-toastify";
import LoadingIcon from "../Loading/LoadingIcon";
import { notifyLoadError } from "../Notification";
import { genGroupsAndTasks, genTracks } from "@/app/repositories/types";

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
  const initTasks = useTaskStore((s) => s.initTasks);
  const initGroups = useGroupStore((s) => s.initGroups);
  const initTracks = useTrackStore((s) => s.initTracks);

  const [demoId, setDemoId] = useState<Id | null>(null);
  const [clearId, setClearId] = useState<Id | null>(null);

  async function demo() {
    const id = toast(
      <div className="flex items-center">
        <LoadingIcon />
        Loading…
      </div>,
      {
        autoClose: false,
        position: "bottom-center",
        closeButton: false,
      }
    );
    if (demoId) toast.dismiss(demoId);
    setDemoId(id);

    try {
      // Clean tables
      await db.open();
      await db.tables.forEach((table) => table.clear());

      // Fill tables
      const [groups, tasks] = genGroupsAndTasks();
      const tracks = genTracks(
        useTrackStore.getState().startDate,
        useTrackStore.getState().endDate,
        tasks
      );
      await db.groups.bulkAdd(groups);
      await db.tasks.bulkAdd(tasks);
      await db.tracks.bulkAdd(tracks);

      // Load states
      await Promise.all([initGroups(), initTasks(), initTracks()]);

      toast.dismiss(id);
    } catch (error) {
      console.error(error);
      toast.dismiss(id);
      notifyLoadError();
    }

    setDemoId(null);
  }

  async function clearHistory() {
    const id = toast(
      <div className="flex items-center">
        <LoadingIcon />
        Loading…
      </div>,
      {
        autoClose: false,
        position: "bottom-center",
        closeButton: false,
      }
    );
    if (clearId) toast.dismiss(clearId);
    setClearId(id);

    try {
      // Clean tables
      await db.open();
      await db.tables.forEach((table) => table.clear());

      // Load states
      await Promise.all([initGroups(), initTasks(), initTracks()]);
    } catch (error) {
      console.error(error);
    }

    toast.dismiss(id);
    setClearId(null);
  }

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
            disabled={clearId !== null}
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
              disabled={demoId !== null}
              onClick={demo}
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
