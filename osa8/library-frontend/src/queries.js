import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      born
    }
  }
`
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      genres
    }
  }
`
export const BOOKS_BY_GENRE = gql`
  query findBooks($genre: String!) {
    allBooks(
      genre: $genre
    ) {
      title
      published
      author {
        name
      }
    }
  }
`
export const USER_INFO = gql`
  query {
    me {
      username
      favouriteGenre
    }
  }
`
export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($authorName: String!, $birthYear: Int!) {
    editAuthor(
      name: $authorName,
      setBornTo: $birthYear,
    ) {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name
      }
      genres
    }
  }
`