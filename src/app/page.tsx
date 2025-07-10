import { getClient } from "@/lib/ssrApolloClient";
import { GET_ALL_BOOKS } from "@/graphql/queries";
import BookListClient from "@/components/BookListClient"
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data } = await getClient().query({
    query: GET_ALL_BOOKS,
  });
  return <BookListClient initialData={data} />;
}