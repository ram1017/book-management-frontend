import { getClient } from "@/lib/ssrApolloClient";
import { GET_BOOK_BY_ID } from "@/graphql/queries";
import BookDetailsClient from "@/components/BookDetialsClient"

type Props = {
  params: {
    id: string;
  };
};


export const dynamic = "force-dynamic"; 

export default async function BookPage({ params }: Props) {
  const { data } = await getClient().query({
    query: GET_BOOK_BY_ID,
    variables: { uniqueId: params.id },
  });

  return <BookDetailsClient initialData={data} />;
}
