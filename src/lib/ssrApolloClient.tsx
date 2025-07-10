// lib/ssrApolloClient.ts

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function getClient() {
  return new ApolloClient({
    ssrMode: true, 
    link: new HttpLink({
      uri: "http://localhost:8080/graphql", 
      fetch, 
    }),
    cache: new InMemoryCache(), 
  });
}
