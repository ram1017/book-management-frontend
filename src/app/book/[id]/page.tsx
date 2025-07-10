import { getClient } from "@/lib/ssrApolloClient";
import { GET_BOOK_BY_ID } from "@/graphql/queries";
import BookDetailsClient from "@/components/BookDetialsClient";


export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = await getClient().query({
    query: GET_BOOK_BY_ID,
    variables: { uniqueId: params.id },
  });

  return <BookDetailsClient initialData={data} />;
}
