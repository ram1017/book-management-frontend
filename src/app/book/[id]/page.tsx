import { getClient } from "@/lib/ssrApolloClient";
import { GET_BOOK_BY_ID } from "@/graphql/queries";
import BookDetailsClient from "@/components/BookDetialsClient";


interface PageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";


async function BookPage({ params }: PageProps) {
  const { data } = await getClient().query({
    query: GET_BOOK_BY_ID,
    variables: { uniqueId: params.id },
  });

  return <BookDetailsClient initialData={data} />;
}

export default BookPage;
