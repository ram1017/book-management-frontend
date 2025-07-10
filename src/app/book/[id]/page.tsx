import { getClient } from "@/lib/ssrApolloClient";
import { GET_BOOK_BY_ID } from "@/graphql/queries";
import BookDetailsClient from "@/components/BookDetialsClient";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
  const { id } = await params;

  const { data } = await getClient().query({
    query: GET_BOOK_BY_ID,
    variables: { uniqueId: id },
  });

  return <BookDetailsClient initialData={data} />;
}
