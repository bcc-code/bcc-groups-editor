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

    if (group.uid) {
      res = await fetch(`${this.baseUrl}/groups/${group.uid}`, {
        method: "PUT",
        body: JSON.stringify(group),
      });
    } else {
      res = await fetch(`${this.baseUrl}/groups`, {
        method: "POST",
        body: JSON.stringify(group),
      });
    }

    const resJson = await res.json();
    return resJson.data;
  }
}

function isUid(s: string) {
  return s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
}
