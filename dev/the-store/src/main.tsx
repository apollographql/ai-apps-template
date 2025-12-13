import { StrictMode } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ToolUseProvider,
  type ApplicationManifest,
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
  },
});

const client = new ApolloClient({
  cache,
  manifest: manifest as ApplicationManifest,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MemoryRouter>
        <ToolUseProvider appName={manifest.name}>
          <App />
        </ToolUseProvider>
      </MemoryRouter>
    </ApolloProvider>
  </StrictMode>
);
