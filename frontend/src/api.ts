import { Direction, Group } from "./types";

export class Api {
  private baseUrl;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getGroups(
    search: string,
    sortDirection: Direction,
    sortBy?: string
  ): Promise<Group[]> {
    const qry = new URLSearchParams();

    if (sortBy) {
      qry.append(
        "sort",
        `${sortDirection === "descending" ? "-" : ""}${sortBy}`
      );
    }
    if (search) {
      const filters: any[] = [
        { name: { _contains: search } },
        { tags: { _contains: search.split(" ") } },
      ];

      if (isUid(search)) {
        filters.push({ uid: { _eq: search } });
      }

      qry.append("filter", JSON.stringify({ _or: filters }));
    }
    const res = await fetch(`${this.baseUrl}/groups?${qry.toString()}`);
    const resJson = await res.json();
    return resJson.data;
  }

  async saveGroup(group: Group): Promise<Group> {
    let res: Response;
    const body = JSON.stringify(getGroupForSave(group));

    if (group.uid) {
      res = await fetch(`${this.baseUrl}/groups/${group.uid}`, {
        method: "PUT",
        body,
      });
    } else {
      res = await fetch(`${this.baseUrl}/groups`, {
        method: "POST",
        body,
      });
    }

    const resJson = await res.json();

    if (resJson.error) {
      throw Error(resJson.error.message);
    }

    return resJson.data;
  }

  async deleteGroup(uid: string): Promise<Group> {
    const res = await fetch(`${this.baseUrl}/groups/${uid}`, {
      method: "DELETE",
    });

    const resJson = await res.json();

    if (resJson.error) {
      throw Error(resJson.error.message);
    }

    return resJson.data;
  }
}

export function getEmptyGroup(): Group {
  return {
    uid: "",
    name: "",
    rule: "",
    tags: [],
    type: "Static",
    appUid: "",
    lastChangedDate: "",
  };
}

function isUid(s: string) {
  return s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
}

function getGroupForSave(g: Group): Group {
  g.tags = g.tags.filter((t) => t != "");
  g.orgUid = g.orgUid ? g.orgUid : undefined;
  g.rule = g.type === "Dynamic" ? g.rule : "";
  return g;
}
