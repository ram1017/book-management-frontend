// lib/ssrApolloClient.ts

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function getClient() {
  return new ApolloClient({
    ssrMode: true, 
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API, 
      fetch, 
    }),
    cache: new InMemoryCache(), 
  });
}
