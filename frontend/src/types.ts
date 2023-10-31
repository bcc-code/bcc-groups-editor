export type Group = {
  uid: string;
  name: string;
  type: GroupType;
  rule: string;
  tags: string[];
  orgUid?: string;
  appUid: string;
  lastChangedDate: string;
};

export type GroupType = "Static" | "Dynamic";

export type Person = {
  uid: string;
  personID: string;
  displayName: string;
};

export type GroupMember = {
  person: Person;
};

export type Direction = "ascending" | "descending";

export type Column = {
  key: string;
  text?: string;
  sortable?: boolean;
};
