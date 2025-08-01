import { useRef, useState } from "react";
import { Id, toast } from "react-toastify";
import LoadingIcon from "../components/Loading/LoadingIcon";
import { notifyLoadError } from "../components/Notification";
import { db } from "../repositories/db";
import { Group, Task, Track } from "../repositories/types";
import { useGroupStore } from "../stores/GroupStore";
import { useTaskStore } from "../stores/TaskStore";
import { useTrackStore } from "../stores/TrackStore";
import { v4 as uuidv4 } from "uuid";
import { LexoRank } from "lexorank";
import { eachDayOfInterval } from "date-fns";
import { midnightUTC } from "../util";

function setIdAndOrder<T>(arr: T[]): (T & { id: string; order: string })[] {
  let lexoRank = LexoRank.middle();

  return arr.map((props) => {
    const order = lexoRank.toString();
    lexoRank = lexoRank.genNext();
    return { id: uuidv4(), order, ...props };
  });
}

export function genUngroupedTasks(): Task[] {
  const taskProps = [
    { name: "Check my emails" },
    { name: "Learn something new" },
    { name: "Read a chapter of a book" },
  ];
  return setIdAndOrder(taskProps);
}

export function genGroupedTasks(): [Group, Task[]][] {
  const groupsProps = [
    {
      name: "Physical Health",
      tasks: [
        { name: "Take a short walk" },
        { name: "Stretch" },
        { name: "Balance on one foot" },
      ],
    },
    {
      name: "Emotional Health",
      tasks: [
        { name: "Journal" },
        { name: "Reflect on my day" },
        { name: "Write 3 things I’m grateful for" },
      ],
    },
    {
      name: "Connection",
      tasks: [
        { name: "Text my parents" },
        { name: "Send a voicenote to a friend" },
        { name: "Send a funny meme to a friend" },
      ],
    },
    {
      name: "Home",
      tasks: [
        { name: "Water my plants" },
        { name: "Tidy up one drawer" },
        { name: "Clean up one room" },
      ],
    },
  ];

  const result: [Group, Task[]][] = [];
  const groups: Group[] = setIdAndOrder(groupsProps).map(
    ({ id, name, order }) => ({
      id,
      name,
      order,
    })
  );
  groups.forEach((group, index) => {
    const tasks: Task[] = setIdAndOrder(groupsProps[index].tasks).map(
      (props) => ({ ...props, groupId: group.id })
    );
    result.push([group, tasks]);
  });
  return result;
}

function genTracks(start: Date, end: Date, tasks: Task[]): Track[] {
  const totalDays = eachDayOfInterval({ start, end });
  const tracks: Track[] = [];

  totalDays.forEach((date) => {
    tasks.forEach((task) => {
      if (Math.random() > 0.7) {
        tracks.push({ taskId: task.id, date: midnightUTC(date) });
      }
    });
  });

  return tracks;
}

export function useDemo() {
  const initTasks = useTaskStore((s) => s.initTasks);
  const initGroups = useGroupStore((s) => s.initGroups);
  const initTracks = useTrackStore((s) => s.initTracks);

  const toastId = useRef<Id>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function runDemo() {
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

      // Fill tables
      const groups: Group[] = [];
      const tasks: Task[] = genUngroupedTasks();
      genGroupedTasks().forEach(([group, _tasks]) => {
        groups.push(group);
        tasks.push(..._tasks);
      });
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

      toast.dismiss(toastId.current);
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(false);
  }

  return { runDemo, isLoading };
}
