import { Direction, Group, GroupMember, Person, Wrapped } from "./types";

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
      const filters: object[] = [
        { name: { _contains: search } },
        { tags: { _contains: search.split(",").map((t) => t.trim()) } },
      ];

      if (isUid(search)) {
        filters.push({ uid: { _eq: search } });
      }

      qry.append("filter", JSON.stringify({ _or: filters }));
    }

    const res = (await this.makeRequest(
      "GET",
      `groups?${qry.toString()}`
    )) as Wrapped<Group[]>;

    return res.data;
  }

  async getGroup(groupUid: string): Promise<Group> {
    const res = (await this.makeRequest(
      "GET",
      `groups/${groupUid}`
    )) as Wrapped<Group>;
    return res.data;
  }

  async saveGroup(group: Group): Promise<Group> {
    let res: Wrapped<Group>;
    if (group.uid) {
      res = (await this.makeRequest(
        "PUT",
        `/groups/${group.uid}`,
        getGroupForSave(group)
      )) as Wrapped<Group>;
    } else {
      res = (await this.makeRequest(
        "POST",
        `groups`,
        getGroupForSave(group)
      )) as Wrapped<Group>;
    }
    return res.data;
  }

  async deleteGroup(uid: string): Promise<Group> {
    const res = (await this.makeRequest(
      "DELETE",
      `groups/${uid}`
    )) as Wrapped<Group>;
    return res.data;
  }

  async getGroupMembers(
    group: Group,
    search: string,
    sortDirection: Direction,
    sortBy?: string
  ): Promise<Wrapped<Person[]>> {
    const qry = new URLSearchParams({
      fields: "uid,personID,displayName",
    });

    if (sortBy) {
      qry.append(
        "sort",
        `${sortDirection === "descending" ? "-" : ""}${sortBy}`
      );
    }
    if (group.type === "Dynamic" && group.rule) {
      qry.append("filter", group.rule);
    }
    if (group.type === "Static") {
      qry.append(
        "filter",
        `{"staticGroupMemberships": {"groupUid": {"_eq": "${group.uid}"}}}`
      );
    }
    if (search) {
      qry.append("search", search);
    }

    const res = (await this.makeRequest(
      "GET",
      `v2/persons?${qry.toString()}`
    )) as Wrapped<Person[]>;
    return res;
  }

  async addGroupMember(groupUid: string, personUid: string) {
    const res = (await this.makeRequest("POST", `groups/${groupUid}/members`, {
      personUid: personUid,
    })) as Wrapped<GroupMember>;
    return res.data;
  }

  async removeGroupMember(groupUid: string, personUid: string) {
    const groupMembership = (await this.makeRequest(
      "GET",
      `groups/${groupUid}/members?filter={"personUid": {"_eq": "${personUid}"}}`
    )) as Wrapped<GroupMember[]>;

    if (groupMembership.data.length < 1) {
      throw Error("person is not a member");
    }

    const res = (await this.makeRequest(
      "DELETE",
      `groups/${groupUid}/members/${groupMembership.data[0].uid}`
    )) as Wrapped<GroupMember>;

    return res.data;
  }

  async findPersons(search: string): Promise<Person[]> {
    const qry = new URLSearchParams({
      fields: "displayName,uid,personID",
      limit: "10",
    });
    if (search) {
      qry.append("search", search);
    }

    const res = (await this.makeRequest(
      "GET",
      `v2/persons?${qry.toString()}`
    )) as Wrapped<Person[]>;

    return res.data;
  }

  private async makeRequest(
    method: string,
    path: string,
    body?: unknown
  ): Promise<unknown> {
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

    return resJson;
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
