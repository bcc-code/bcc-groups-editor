import { Direction, Group } from "./types";

export interface TokenSource {
  Token(): Promise<string>;
}

export class Api {
  private baseUrl;
  private tokenSource?: TokenSource;

  constructor(baseUrl: string, tokenSource?: TokenSource) {
    this.baseUrl = baseUrl;
    this.tokenSource = tokenSource;
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

    return this.makeRequest("GET", `groups?${qry.toString()}`);
  }

  async saveGroup(group: Group): Promise<Group> {
    if (group.uid) {
      return this.makeRequest(
        "PUT",
        `/groups/${group.uid}`,
        getGroupForSave(group)
      );
    } else {
      return this.makeRequest("POST", `groups`, getGroupForSave(group));
    }
  }

  async deleteGroup(uid: string): Promise<Group> {
    return this.makeRequest("DELETE", `groups/${uid}`);
  }

  private async makeRequest(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    const headers = new Headers();
    if (this.tokenSource) {
      const token = await this.tokenSource.Token();
      headers.append("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${this.baseUrl}/${path}`, {
      method,
      body: JSON.stringify(body),
      headers,
    });

    const resJson = await res.json();

    if (resJson.error) {
      throw Error(resJson.error.message);
    }

    return resJson.data;
  }
}

export class StaticTokenSource implements TokenSource {
  private token;
  constructor(token: string) {
    this.token = token;
  }
  Token(): Promise<string> {
    return Promise.resolve(this.token);
  }
}

export class UrlTokenSource implements TokenSource {
  private url;
  private token: string | undefined;
  constructor(url: string) {
    this.url = url;
  }
  async Token(): Promise<string> {
    if (this.token) {
      return this.token;
    }
    const res = await fetch(this.url);
    if (!res.ok) {
      throw Error("Cannot get token");
    }
    const token = await res.text();
    this.token = token;
    return token;
  }
}

export function getEmptyGroup(): Group {
  return {
    uid: "",
    name: "",
    rule: "",
    tags: [],
    type: "Dynamic",
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
