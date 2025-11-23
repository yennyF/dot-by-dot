import { Group } from "@/app/types";
import React from "react";

export const HomePageContext = React.createContext(
  {} as {
    selectedGroup: Group | undefined;
    setSelectedGroup: React.Dispatch<React.SetStateAction<Group | undefined>>;
  }
);
