export type Group = {
  id: string;
  name: string;
  order: string;
};

export type ApiGroup = Group;

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
  };
}

export function mapGroupResponseArray(data: ApiGroup[]): Group[] {
  return data.map((t) => mapGroupResponse(t));
}
