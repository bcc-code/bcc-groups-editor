import { SchemaField } from "./types";

export function getPersonSchema(): SchemaField[] {
  const personSchema: SchemaField[] = [];

  const affilationSchema = getAffiliationSchema(personSchema);
  const consentSchema = getConsentsSchema(personSchema);
  const relationSchema = getRelationsSchema(personSchema);
  const roleAssignmentSchema = getRoleAssignmentSchema(personSchema);
  const staticGropuMembershipSchema = staticGroupMemberships(personSchema);

  personSchema.push(
    ...baseFields,
    {
      name: "Person ID",
      key: "personID",
      type: "integer",
    },
    {
      name: "First Name",
      key: "firstName",
      type: "string",
    },
    {
      name: "Middle Name",
      key: "middleName",
      type: "string",
    },
    {
      name: "Last Name",
      key: "lastName",
      type: "string",
    },
    {
      name: "Display Name",
      key: "displayName",
      type: "string",
    },
    {
      name: "Birth Date",
      key: "birthDate",
      type: "date",
    },
    {
      name: "Deceased Date",
      key: "deceasedDate",
      type: "date",
    },
    {
      name: "Gender",
      key: "gender",
      type: "string",
      choices: ["Male", "Female", "Unknown"],
    },
    {
      name: "Marital Status",
      key: "maritalStatus",
      type: "string",
      choices: [
        "Single",
        "Married",
        "Widowed",
        "Separated",
        "SingleParent",
        "Unknown",
      ],
    },
    {
      name: "E-mail",
      key: "email",
      type: "string",
    },
    {
      name: "E-mail verified",
      key: "emailVerified",
      type: "boolean",
    },
    {
      name: "Cellphone",
      key: "cellPhone",
      type: "string",
    },
    {
      name: "Cellphone verified",
      key: "cellPhonelVerified",
      type: "boolean",
    },
    {
      name: "Homephone",
      key: "homePhone",
      type: "string",
    },
    {
      name: "Address",
      key: "address",
      type: "object",
      fields: addressFields,
    },
    {
      name: "Preferences",
      key: "preferences",
      type: "object",
      fields: [
        {
          name: "Visibility",
          key: "visibility",
          type: "object",
          fields: [
            {
              name: "Birthday List",
              key: "birthdayList",
              type: "boolean",
            },
            {
              name: "search",
              key: "search",
              type: "string",
              choices: ["Global", "District", "Hidden"],
            },
          ],
        },
      ],
    },

    {
      name: "Profile Picture",
      key: "profilePicture",
      type: "string",
    },
    {
      name: "Affiliations",
      key: "affiliations",
      type: "relational-many",
      fields: affilationSchema,
    },
    {
      name: "Consents",
      key: "consents",
      type: "relational-many",
      fields: consentSchema,
    },
    {
      name: "Relations",
      key: "relations",
      type: "relational-many",
      fields: relationSchema,
    },
    {
      name: "Role Assignments",
      key: "roleAssignments",
      type: "relational-many",
      fields: roleAssignmentSchema,
    },
    {
      name: "Static Group Memberships",
      key: "staticGroupMemberships",
      type: "relational-many",
      fields: staticGropuMembershipSchema,
    }
  );

  return personSchema;
}

function getAffiliationSchema(personSchema: SchemaField[]): SchemaField[] {
  return [
    ...baseFields,
    ...validFields,
    {
      name: "OrgUid",
      key: "orgUid",
      type: "string",
    },
    {
      name: "PersonUid",
      key: "personUid",
      type: "string",
    },
    {
      name: "Valid from",
      key: "validFrom",
      type: "date-time",
    },
    {
      name: "Valid to",
      key: "validTo",
      type: "date-time",
    },
    {
      name: "Type",
      key: "type",
      type: "string",
      choices: ["Member", "Participant", "Affiliate"],
    },
    {
      name: "Person",
      key: "person",
      type: "object",
      fields: personSchema,
    },
    {
      name: "Org",
      key: "org",
      type: "object",
      fields: orgSchema,
    },
  ];
}

function getConsentsSchema(personSchema: SchemaField[]): SchemaField[] {
  return [
    ...baseFields,
    ...validFields,
    {
      name: "OrgUid",
      key: "orgUid",
      type: "string",
    },
    {
      name: "PersonUid",
      key: "personUid",
      type: "string",
    },
    {
      name: "Purpose",
      key: "purpose",
      type: "string",
      choices: ["DataSharing", "Tracking"],
    },
    {
      name: "Person",
      key: "person",
      type: "object",
      fields: personSchema,
    },
    {
      name: "Org",
      key: "org",
      type: "object",
      fields: orgSchema,
    },
  ];
}

function getRelationsSchema(personSchema: SchemaField[]): SchemaField[] {
  return [
    ...baseFields,
    ...validFields,
    {
      name: "TargetUid",
      key: "targetUid",
      type: "string",
    },
    {
      name: "Target",
      key: "target",
      type: "object",
      fields: personSchema,
    },
    {
      name: "Type",
      key: "purpose",
      type: "string",
      choices: ["DataSharing", "Tracking"],
    },
    {
      name: "Grant To Origin",
      key: "grantToOrigin",
      type: "string",
      choices: ["Default", "View", "Administrate", "Represent", "None"],
    },

    {
      name: "Grant To Target",
      key: "grantToTarget",
      type: "string",
      choices: ["Default", "View", "Administrate", "Represent", "None"],
    },
    {
      name: "Type",
      key: "type",
      type: "string",
      choices: [
        "Child",
        "Parent",
        "Spouse",
        "LegalDependent",
        "LegalGuardian",
        "FosterChild",
        "FosterParent",
        "ContactDependent",
        "ContactPerson",
      ],
    },
  ];
}

function getRoleAssignmentSchema(personSchema: SchemaField[]): SchemaField[] {
  return [
    ...baseFields,
    ...validFields,
    {
      name: "OrgUid",
      key: "orgUid",
      type: "string",
    },
    {
      name: "PersonUid",
      key: "personUid",
      type: "string",
    },
    {
      name: "roleUid",
      key: "roleUid",
      type: "string",
    },
    {
      name: "Role",
      key: "role",
      type: "object",
      fields: roleSchema,
    },
    {
      name: "Person",
      key: "person",
      type: "object",
      fields: personSchema,
    },
    {
      name: "Org",
      key: "org",
      type: "object",
      fields: orgSchema,
    },
  ];
}

function staticGroupMemberships(personSchema: SchemaField[]): SchemaField[] {
  return [
    ...baseFields,
    {
      name: "Group Uid",
      key: "groupUid",
      type: "string",
    },
    {
      name: "Person Uid",
      key: "personUid",
      type: "string",
    },
    {
      name: "Person",
      key: "person",
      type: "object",
      fields: personSchema,
    },
  ];
}

const baseFields: SchemaField[] = [
  {
    name: "Uid",
    key: "uid",
    type: "string",
  },
  {
    name: "Last Changed Date",
    key: "lastChangedDate",
    type: "date-time",
  },
];

const validFields: SchemaField[] = [
  {
    name: "Valid from",
    key: "validFrom",
    type: "date-time",
  },
  {
    name: "Valid to",
    key: "validTo",
    type: "date-time",
  },
];

const addressFields: SchemaField[] = [
  {
    name: "Line 1",
    key: "address1",
    type: "string",
  },
  {
    name: "Line 2",
    key: "address2",
    type: "string",
  },
  {
    name: "Line 3",
    key: "address3",
    type: "string",
  },
  {
    name: "City",
    key: "city",
    type: "string",
  },
  {
    name: "Country Code",
    key: "countryCode",
    type: "string",
  },
  {
    name: "Postal Code",
    key: "postalCode",
    type: "string",
  },
  {
    name: "Region",
    key: "region",
    type: "string",
  },
];

const roleSchema: SchemaField[] = [
  ...baseFields,
  {
    name: "Name",
    key: "name",
    type: "string",
  },
  {
    name: "Scope",
    key: "scope",
    type: "string",
    choices: ["Global", "Org"],
  },
];

const orgSchema: SchemaField[] = [
  ...baseFields,
  {
    name: "Org ID",
    key: "orgID",
    type: "integer",
  },
  {
    name: "Name",
    key: "name",
    type: "string",
  },
  {
    name: "District Name",
    key: "districtName",
    type: "string",
  },
  {
    name: "Type",
    key: "type",
    type: "string",
    choices: ["Org", "Church", "Club"],
  },
  {
    name: "Billing Address",
    key: "billingAddress",
    type: "object",
    fields: addressFields,
  },
  {
    name: "Postal Address",
    key: "postalAddress",
    type: "object",
    fields: addressFields,
  },
  {
    name: "Visiting Address",
    key: "visitingAddress",
    type: "object",
    fields: addressFields,
  },
];
