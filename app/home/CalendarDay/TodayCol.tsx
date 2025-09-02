import { UNGROUPED_KEY, useTaskStore } from "@/app/stores/TaskStore";
import TaskRowItem from "./Body/TaskRowItem";
import DateRowItem from "./HeaderCol/DateRowItem";
import CounterRowItem from "./HeaderCol/CounterRowItem";
import { useGroupStore } from "@/app/stores/GroupStore2";

export function TodayHeader() {
  const today = new Date();

  return (
    <div className="sticky right-name mt-[55px] bg-[var(--background)]">
      <DateRowItem date={today} />
      <CounterRowItem date={today} />
    </div>
  );
}

export function TodayBody() {
  const today = new Date();
  const groups = useGroupStore((s) => s.groups);

  return (
    <div className="sticky right-name bg-[var(--background)]">
      <div className="">
        <TaskList date={today} groupId={null} />
      </div>
      <div className="mt-10 flex flex-col gap-10">
        {groups?.map((group) => (
          <div key={group.id}>
            <div className="h-row"></div>
            <TaskList date={today} groupId={group.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TaskListProps {
  date: Date;
  groupId: string | null;
}

function TaskList({ date, groupId }: TaskListProps) {
  const key = groupId ?? UNGROUPED_KEY;

  // const dummyTask = useTaskStore((s) =>
  //   s.dummyTask && s.dummyTask.groupId === (groupId || undefined)
  //     ? s.dummyTask
  //     : null
  // );
  const tasks = useTaskStore((s) => s.tasksByGroup?.[key]);

  return (
    <div>
      {/* {dummyTask && <TaskRow task={dummyTask} isDummy={true} />} */}
      {tasks?.map((task) => (
        <TaskRowItem key={task.id} date={date} task={task} />
      ))}
    </div>
  );
}
