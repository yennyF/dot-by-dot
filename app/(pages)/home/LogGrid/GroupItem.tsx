import { useTaskLogStore } from "@/app/stores/taskLogStore";
import { useTaskStore } from "@/app/stores/taskStore";
import GroupDot from "../dots/GroupDot";
import styles from "./dot.module.scss";

interface GroupItemProps {
  date: Date;
  groupId: string;
}

export default function GroupItem({ date, groupId }: GroupItemProps) {
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]) || [];
  const count = useTaskLogStore((s) => s.getTasksDone(date, tasks).length);

  return (
    <div className={"relative flex h-row w-day items-center justify-center"}>
      <GroupDot date={date} count={count} />
      <span className={styles.date}>{date.getDate()}</span>
    </div>
  );
}
