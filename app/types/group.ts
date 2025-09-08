import { useUserStore } from "../stores/userStore";

export type Group = {
  id: string;
  name: string;
  order: string;
};

export type ApiGroup = {
  id: string;
  name: string;
  order: string;
  user_id: string;
};

export function mapGroupResponse(data: ApiGroup): Group {
  return {
    id: data.id,
    name: data.name,
    order: data.order,
  };
}

export function mapGroupRequest(group: Group): ApiGroup {
  return {
    id: group.id,
    name: group.name,
    order: group.order,
    user_id: useUserStore.getState().user?.id || "",
  };
}

export function mapGroupResponseArray(data: ApiGroup[]): Group[] {
  return data.map((t) => mapGroupResponse(t));
}

export function mapGroupRequestArray(data: Group[]): ApiGroup[] {
  return data.map((t) => mapGroupRequest(t));
}
