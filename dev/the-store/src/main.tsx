import { StrictMode, Suspense } from "react";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient, type ApplicationManifest } from "@apollo/client-ai-apps";
import { ApolloProvider } from "@apollo/client-ai-apps/react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import manifest from "../.application-manifest.json";

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

const client = new ApolloClient({
  cache,
  manifest: manifest as ApplicationManifest,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Suspense>
  </StrictMode>
);
