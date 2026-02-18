import { StrictMode } from "react";
import { InMemoryCache } from "@apollo/client";
import {
  ApolloClient,
  ApolloProvider,
  ToolUseProvider,
} from "@apollo/client-ai-apps";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import manifest from "../.application-manifest.json";
import { MemoryRouter } from "react-router";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        product: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: "Product",
              id: args?.id,
            });
          },
        },
      },
    },
    CategoryInfo: {
      keyFields: ["slug"],
    },
  },
});

const client = new ApolloClient({ cache, manifest });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MemoryRouter>
        <ToolUseProvider>
          <App />
        </ToolUseProvider>
      </MemoryRouter>
    </ApolloProvider>
  </StrictMode>
);
