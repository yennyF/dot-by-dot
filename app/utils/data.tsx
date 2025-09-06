import { Group, Task, TaskLog } from "../types";
import { v4 as uuidv4 } from "uuid";
import { LexoRank } from "lexorank";
import { eachDayOfInterval } from "date-fns";
import { useUserStore } from "../stores/userStore";

function setIdAndOrder<T>(arr: T[]): (T & { id: string; order: string })[] {
  let lexoRank = LexoRank.middle();

  return arr.map((props) => {
    const order = lexoRank.toString();
    lexoRank = lexoRank.genNext();
    return { id: uuidv4(), order, ...props };
  });
}

export function genUngroupedTasks(): Task[] {
  const userId = useUserStore.getState().user?.id;
  if (!userId) throw Error("User not found");

  const taskProps = [
    { name: "Check my emails", userId },
    { name: "Read some pages of a book", userId },
    { name: "No smoking", userId },
  ];
  return setIdAndOrder(taskProps);
}

export function genGroupedTasks(): [Group, Task[]][] {
  const userId = useUserStore.getState().user?.id;
  if (!userId) throw Error("User not found");

  const groupsProps = [
    {
      name: "Physical Health",
      userId,
      tasks: [
        { name: "Take a short walk", userId },
        { name: "Stretch", userId },
        { name: "Balance on one foot", userId },
      ],
    },
    {
      name: "Emotional Health",
      userId,
      tasks: [
        { name: "Write in my journal", userId },
        { name: "Draw or doodle something", userId },
        { name: "List 3 things I’m grateful for", userId },
      ],
    },
    {
      name: "Social",
      userId,
      tasks: [
        { name: "Text my parents", userId },
        { name: "Chat with a loved one", userId },
        { name: "Share a funny meme with a friend", userId },
      ],
    },
    {
      name: "Home",
      userId,
      tasks: [
        { name: "Water my plants", userId },
        { name: "Vacuum or sweep my space", userId },
        { name: "Change bed linens and pillowcases", userId },
      ],
    },
  ];

  const result: [Group, Task[]][] = [];
  const groups: Group[] = setIdAndOrder(groupsProps).map(
    ({ id, name, order, userId }) => ({
      id,
      name,
      order,
      userId,
    })
  );
  groups.forEach((group, index) => {
    const tasks: Task[] = setIdAndOrder(groupsProps[index].tasks).map(
      (props) => ({ ...props, groupId: group.id, userId })
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
        taskLogs.push({ taskId: task.id, date });
      }
    });
  });

  return taskLogs;
}
