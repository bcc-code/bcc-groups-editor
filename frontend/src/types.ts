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

export type Direction = "ascending" | "descending";
