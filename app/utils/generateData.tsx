import { Group, Task, TaskLog } from "../types";
import { v4 as uuidv4 } from "uuid";
import { LexoRank } from "lexorank";
import { eachDayOfInterval } from "date-fns";

function setMoreProps<T>(
  arr: T[],
  optional?: Record<string, unknown>
): (T & { id: string; order: string })[] {
  let lexoRank = LexoRank.middle();

  return arr.map((props) => {
    const order = lexoRank.toString();
    lexoRank = lexoRank.genNext();
    return { id: uuidv4(), order, optional, ...props };
  });
}

export function generateTasks(): Task[] {
  return setMoreProps([
    { name: "Check my emails" },
    { name: "Read some pages of a book" },
    { name: "No smoking" },
  ]);
}

export function generateGroupedTasks(): [Group, Task[]][] {
  const groups = setMoreProps([
    { name: "Physical Health" },
    { name: "Emotional Health" },
    { name: "Social" },
    { name: "Home" },
  ]) as Group[];

  const tasksArray = [
    setMoreProps(
      [
        { name: "Take a short walk" },
        { name: "Stretch" },
        { name: "Balance on one foot" },
      ],
      { groupId: groups[0].id }
    ) as Task[],
    setMoreProps(
      [
        { name: "Write in my journal" },
        { name: "Draw or doodle something" },
        { name: "List 3 things I’m grateful for" },
      ],
      { groupId: groups[1].id }
    ) as Task[],
    setMoreProps(
      [
        { name: "Text my parents" },
        { name: "Chat with a loved one" },
        { name: "Share a funny meme with a friend" },
      ],
      { groupId: groups[2].id }
    ) as Task[],
    setMoreProps(
      [
        { name: "Water my plants" },
        { name: "Vacuum or sweep my space" },
        { name: "Change bed linens and pillowcases" },
      ],
      { groupId: groups[3].id }
    ) as Task[],
  ];

  return groups.map((group, index) => [group, tasksArray[index]]);
}

export function generateTaskLogs(
  start: Date,
  end: Date,
  tasks: Task[]
): TaskLog[] {
  const totalDays = eachDayOfInterval({ start, end });
  const taskLogs: TaskLog[] = [];

  totalDays.forEach((date) => {
    tasks.forEach((task) => {
      if (Math.random() > 0.8) {
        taskLogs.push({ taskId: task.id, date });
      }
    });
  });

  return taskLogs;
}
