// graphql/queries.ts
import { gql } from "@apollo/client";

export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    allBooks {
       uniqueId
      title
      author
      genre
    }
  }
`;

export const GET_BOOK_BY_ID = gql`
  query GetBookById($uniqueId: String!) {
    bookByUniqueId(uniqueId: $uniqueId) {
      id
      title
      author
      publicationDate
      isbn
      genre
      rating
      uniqueId
      coverImage
      description
      previewLink
      pageCount
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $publicationDate: String!
    $isbn: String!
    $genre: String!
    $rating: Int!
    $coverImage: String
  ) {
    addBook(
      title: $title
      author: $author
      publicationDate: $publicationDate
      isbn: $isbn
      genre: $genre
      rating: $rating
      coverImage: $coverImage
    )
  }
`;
  

export const DELETE_BOOK = gql`
  mutation DeleteBook($uniqueId: String!) {
    deleteBook(uniqueId: $uniqueId)
  }
`;
