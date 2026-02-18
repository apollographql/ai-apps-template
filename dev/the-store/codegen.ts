import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../../schema.graphql",
  documents: ["src/**/*.{ts,tsx}"],
  // Don't exit with non-zero status when there are no documents
  ignoreNoDocuments: true,
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  generates: {
    // Use a path that works the best for the structure of your application
    "./src/gql/__generated__/types.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        // Writes enums as string unions to ensure it is compatible with
        // "erasableSyntaxOnly"
        enumsAsTypes: true,
        avoidOptionals: {
          // Use `null` for nullable fields instead of optionals
          field: true,
          // Allow nullable input fields to remain unspecified
          inputValue: false,
        },
        // Use `unknown` instead of `any` for unconfigured scalars
        defaultScalarType: "unknown",
        // Apollo Client always includes `__typename` fields
        nonOptionalTypename: true,
        // Apollo Client doesn't add the `__typename` field to root types so
        // don't generate a type for the `__typename` for root operation types.
        skipTypeNameForRoot: true,
        // Avoid adding an operation suffix to avoid double `QueryQuery` names
        // for operations that already contain the operation suffix
        dedupeOperationSuffix: true,
      },
    },
  },
};

export default config;
