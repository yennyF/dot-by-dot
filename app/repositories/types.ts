import { eachDayOfInterval } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { LexoRank } from "lexorank";
import { midnightUTC } from "../util";

export type LocaleDateString = string; // Format: "M/D/YYYY"

export type Group = {
  id: string;
  name: string;
  order: string;
};

export type Task = {
  id: string;
  name: string;
  groupId?: string;
  order: string;
};

export type Track = {
  taskId: string;
  date: Date;
};

export function genGroupsAndTasks(): [Group[], Task[]] {
  const groupProps: Pick<Group, "name">[] = [
    { name: "Physical Health" },
    { name: "Emotional Health" },
    { name: "Connection" },
    { name: "Home" },
  ];
  let lexoRankGroup = LexoRank.middle();

  const groups = groupProps.map((props) => {
    const order = lexoRankGroup.toString();
    lexoRankGroup = lexoRankGroup.genNext();
    return { id: props.name, order, ...props };
  });

  const taskProps: Pick<Task, "name" | "groupId">[] = [
    { name: "Check my emails" },
    { name: "Learn something new" },
    { name: "Read a chapter of a book" },

    { name: "Take a short walk", groupId: "Physical Health" },
    { name: "Stretch", groupId: "Physical Health" },
    { name: "Jumping jacks", groupId: "Physical Health" },
    {
      name: "Balance on one foot",
      groupId: "Physical Health",
    },

    { name: "Journal", groupId: "Emotional Health" },
    { name: "Reflect on my day", groupId: "Emotional Health" },
    { name: "Write 3 things I’m grateful for", groupId: "Emotional Health" },

    { name: "Text my parents", groupId: "Connection" },
    { name: "Call a friend", groupId: "Connection" },
    { name: "Send a funny meme to a friend", groupId: "Connection" },

    { name: "Water my plants", groupId: "Home" },
    { name: "Tidy up oone drawer", groupId: "Home" },
    { name: "Clean up one space", groupId: "Home" },
  ];
  let lexoRankTask = LexoRank.middle();

  const tasks = taskProps.map((props) => {
    const order = lexoRankTask.toString();
    lexoRankTask = lexoRankTask.genNext();
    return { id: uuidv4(), order, ...props };
  });

  return [groups, tasks];
}

export function genTracks(start: Date, end: Date, tasks: Task[]): Track[] {
  const totalDays = eachDayOfInterval({ start, end });

  return totalDays.reduce<Track[]>((acc, date) => {
    const t = tasks.reduce<Track[]>((acc, task) => {
      if (Math.random() > 0.7) {
        acc.push({ taskId: task.id, date: midnightUTC(date) });
      }
      return acc;
    }, []);
    acc.push(...t);
    return acc;
  }, []);
}
