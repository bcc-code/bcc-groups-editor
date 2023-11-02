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
  uid: string;
  person: Person;
  lastChangedDate: string;
};

export type Wrapped<T> = {
  data: T;
  meta: {
    total: number;
    limit: number;
    skipped: number;
  };
};

export type Direction = "ascending" | "descending";

export type Column = {
  key: string;
  text?: string;
  sortable?: boolean;
};

export const filterOperators = [
  "_eq",
  "_neq",
  "_lt",
  "_lte",
  "_gt",
  "_gte",
  "_null",
  "_nnull",
  "_in",
  "_nin",
  "_contains",
  "_ncontains",
  "_starts_with",
  "_nstarts_with",
  "_ends_with",
  "_nends_with",
] as const;

export type FilterOperator = (typeof filterOperators)[number];

export const filterOperatorsString: FilterOperator[] = [
  "_contains",
  "_ncontains",
  "_starts_with",
  "_nstarts_with",
  "_ends_with",
  "_nends_with",
];

export const filterOperatorsNull: FilterOperator[] = ["_null", "_nnull"];
export const filterOperatorsArray: FilterOperator[] = ["_in", "_nin"];

export const relationOperators = ["_some", "_none"] as const;
export const logicalOperators = ["_and", "_or"] as const;

export type RelationOperator = (typeof relationOperators)[number];
export type LogicalOperator = (typeof logicalOperators)[number];

export type FilterNode =
  | FilterNodeField
  | FilterNodeLogical
  | FilterNodeRelationalMany;

export type FilterNodeField = {
  type: "field";

  field: string;
  operator: FilterOperator;
  value: unknown;
};

export type FilterNodeLogical = {
  type: "logical";

  operator: LogicalOperator;
  nodes: FilterNode[];
};

export type FilterNodeRelationalMany = {
  type: "relational-many";

  field: string;
  operator: RelationOperator;
  nodes: FilterNode[];
};

export type SchemaFieldType =
  | "string"
  | "integer"
  | "float"
  | "boolean"
  | "date"
  | "date-time"
  | "object"
  | "relational-many";

export type SchemaField = {
  key: string;
  name: string;
  type: SchemaFieldType;
  choices?: string[];
  fields?: SchemaField[];
};
