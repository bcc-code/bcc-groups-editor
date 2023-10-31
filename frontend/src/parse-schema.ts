import { SchemaField, SchemaFieldType } from "./types";

type InputSchema = Record<string, InputSchemaField>;

type InputSchemaField = SchemaFieldType | InputSchemaFieldOpts;

type InputSchemaFieldOpts = {
  name?: string;
  type: SchemaFieldType;
  choices?: string[];
  schema?: InputSchema;
};

export function parseSchema(s: InputSchema): SchemaField[] {
  const schema: SchemaField[] = [];
  for (const key of Object.keys(s)) {
    let field: SchemaField;
    const inputField = s[key];
    if (typeof inputField === "string") {
      field = {
        key,
        name: key,
        type: inputField,
        fields: undefined,
      };
    } else {
      field = {
        key,
        name: inputField.name ?? key,
        type: inputField.type,
        choices: inputField.choices,
        fields: inputField.schema ? parseSchema(inputField.schema) : undefined,
      };
    }

    schema.push(field);
  }
  return schema;
}
