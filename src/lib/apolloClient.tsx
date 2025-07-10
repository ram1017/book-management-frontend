// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API, // your Spring Boot GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
