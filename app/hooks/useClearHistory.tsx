import { useRef, useState } from "react";
import { Id, toast } from "react-toastify";
import LoadingIcon from "../components/Loading/LoadingIcon";
import { db } from "../repositories/db";
import { useGroupStore } from "../stores/GroupStore";
import { useTaskStore } from "../stores/TaskStore";
import { useTrackStore } from "../stores/TrackStore";

export function useClearHistory() {
  const initTasks = useTaskStore((s) => s.initTasks);
  const initGroups = useGroupStore((s) => s.initGroups);
  const initTracks = useTrackStore((s) => s.initTracks);

  const toastId = useRef<Id>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function clearHistory() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = toast(
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

    try {
      // Clean tables
      await db.open();
      await db.tables.forEach((table) => table.clear());

      // Load states
      await Promise.all([initGroups(), initTasks(), initTracks()]);
    } catch (error) {
      console.error(error);
    }
    toast.dismiss(toastId.current);

    setIsLoading(false);
  }

  return { clearHistory, isLoading };
}
