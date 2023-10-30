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

export type FilterRelationType = "some" | "none";

export type FilterOperator =
  | "_eq"
  | "_neq"
  | "_lt"
  | "_lte"
  | "_gt"
  | "_gte"
  | "_in"
  | "_nin"
  | "_null"
  | "_nnull"
  | "_contains"
  | "_ncontains";
export type ClientFilterOperator =
  | FilterOperator
  | "_starts_with"
  | "_nstarts_with"
  | "_ends_with"
  | "_nends_with";
export type FilterContext = Record<string, any>;
export type Filter<T = FilterContext> =
  | LogicalFilter<Partial<T>>
  | FieldFilter<Partial<T>>;
export type FieldFilter<T = FilterContext> = {
  [field in keyof T]: FieldFilterOperator;
};
export type LogicalFilterOR<T = FilterContext> = {
  _or: Filter<Partial<T>>[];
};
export type LogicalFilterAND<T = FilterContext> = {
  _and: Filter<Partial<T>>[];
};
export type LogicalFilter<T = FilterContext> =
  | LogicalFilterOR<T>
  | LogicalFilterAND<T>;
export type FieldFilterOperator = {
  _eq?: string | number | boolean;
  _neq?: string | number | boolean;
  _lt?: string | number;
  _lte?: string | number;
  _gt?: string | number;
  _gte?: string | number;
  _in?: (string | number)[] | string;
  _nin?: (string | number)[] | string;
  _null?: boolean;
  _nnull?: boolean;
  _starts_with?: string;
  _nstarts_with?: string;
  _ends_with?: string;
  _nends_with?: string;
  _contains?: string;
  _ncontains?: string;
};

export type FilterNode =
  | FilterNodeField
  | FilterNodeLogical
  | FilterNodeRelationalMany;

export type FilterNodeField = {
  type: "field";

  field: string;
  operator: ClientFilterOperator;
  value: any;
};

export type FilterNodeLogical = {
  type: "logical";

  operator: "and" | "or";
  nodes: FilterNode[];
};

export type FilterNodeRelationalMany = {
  type: "relational-many";

  field: string;
  relType: FilterRelationType;
  nodes: FilterNode[];
};

export type SchemaFieldType =
  | "string"
  | "integer"
  | "float"
  | "boolean"
  | "date"
  | "date-time"
  | "object";

export type SchemaField<T extends SchemaFieldType = SchemaFieldType> = {
  key: string;
  name: string;
  type: T;
  choices?: string[];
  fields: T extends "object" ? SchemaField[] : undefined;
};
