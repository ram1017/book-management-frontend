// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql", // your Spring Boot GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
