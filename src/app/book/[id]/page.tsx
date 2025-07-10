import { getClient } from "@/lib/ssrApolloClient";
import { GET_BOOK_BY_ID } from "@/graphql/queries";
import BookDetailsClient from "@/components/BookDetialsClient";


type Props = {
  params: {
    id: string;
  };
};


async function BookPage({ params }: Props) {
  const { data } = await getClient().query({
    query: GET_BOOK_BY_ID,
    variables: { uniqueId: params.id },
  });

  return <BookDetailsClient initialData={data} />;
}

export const dynamic = "force-dynamic"; // optional for SSR behavior

export default BookPage;
