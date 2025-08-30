import { Group, Task, TaskLog } from "./types";
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
    { name: "Read some pages of a book" },
    { name: "No smoking" },
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
        { name: "Write in my journal" },
        { name: "Draw or doodle something" },
        { name: "List 3 things I’m grateful for" },
      ],
    },
    {
      name: "Social",
      tasks: [
        { name: "Text my parents" },
        { name: "Chat with a loved one" },
        { name: "Share a funny meme with a friend" },
      ],
    },
    {
      name: "Home",
      tasks: [
        { name: "Water my plants" },
        { name: "Vacuum or sweep my space" },
        { name: "Change bed linens and pillowcases" },
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

export function genTaskLogs(start: Date, end: Date, tasks: Task[]): TaskLog[] {
  const totalDays = eachDayOfInterval({ start, end });
  const taskLogs: TaskLog[] = [];

  totalDays.forEach((date) => {
    tasks.forEach((task) => {
      if (Math.random() > 0.8) {
        taskLogs.push({ taskId: task.id, date: midnightUTC(date) });
      }
    });
  });

  return taskLogs;
}
