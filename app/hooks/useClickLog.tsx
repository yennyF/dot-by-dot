import { useTaskLogStore } from "../stores/taskLogStore";

export default function useClickLog() {
  const insertTaskLog = useTaskLogStore((s) => s.insertTaskLog);
  const deleteTaskLog = useTaskLogStore((s) => s.deleteTaskLog);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const element = (e.target as HTMLElement).closest("[data-task-id]");
    if (!element) return;

    const htmlElement = element as HTMLElement;
    const taskId = htmlElement.dataset["taskId"];
    const date = htmlElement.dataset["date"];
    const active = htmlElement.dataset["active"];

    if (!taskId || !date || active === undefined) return;

    if (active === "true") {
      deleteTaskLog(new Date(date), taskId);
    } else {
      insertTaskLog(new Date(date), taskId);
    }
  }

  return handleClick;
}
