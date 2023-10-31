import { toRaw } from "vue";
import { SchemaField } from "./types";

export function getFieldByKey(s: SchemaField[], path: string): SchemaField {
  const fieldParts = path.split(".");
  let fieldSchema: SchemaField | undefined;
  for (const part of fieldParts) {
    fieldSchema = s.find((f) => f.key === part);
    if (!fieldSchema) throw Error("field does not exist");

    s = fieldSchema.fields ?? [];
  }
  if (!fieldSchema) throw Error("field does not exist");

  return fieldSchema;
}

export function getNameByKey(s: SchemaField[], path: string): string {
  const fieldParts = path.split(".");
  let fieldNameParts = [];
  for (const part of fieldParts) {
    const fieldSchema = s.find((f) => f.key === part);
    if (!fieldSchema) throw Error("field does not exist");
    fieldNameParts.push(fieldSchema.name);

    s = fieldSchema.fields ?? [];
  }

  return fieldNameParts.join("->");
}

export function deepCopy<T extends unknown>(n: T): T {
  return structuredClone(toRaw(n));
}
