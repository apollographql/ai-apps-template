/* eslint-disable @typescript-eslint/no-empty-object-type */
import "@apollo/client";
import type { GraphQLCodegenDataMasking } from "@apollo/client/masking";

declare module "@apollo/client" {
  interface TypeOverrides extends GraphQLCodegenDataMasking.TypeOverrides {}
}
