import { createContext } from "react";

export const ViewStatsContext = createContext(
  {} as {
    selectedGroup: string | null;
    setSelectedGroup: (groupId: string | null) => void;
  }
);
