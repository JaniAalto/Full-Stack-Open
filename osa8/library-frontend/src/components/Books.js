import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'


const Books = (props) => {
  const [chosenGenre, setChosenGenre] = useState('')

  const { loading, data, refetch } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: chosenGenre },
  })

  if (!props.show) {
    return null
  }

  if (props.books.loading || loading) {
    return <div><h2>Books</h2>loading...</div>
  }

  let books = []

  if (props.books.data) {
    books = props.books.data.allBooks
    //console.log("books", books)
  }

  let genres = []
  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) 
        genres = genres.concat(genre)
    })
  })

  const selectGenre = (genre) => {
    setChosenGenre(genre)
    refetch({ genre: genre })
    //console.log("selected genre:", genre)
  }

  let booksToShow = books

  if (data) {
    booksToShow = data.allBooks
  }


  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {booksToShow.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => selectGenre(genre)}>{genre}</button>
      ))}
      <button onClick={() => selectGenre('')}>all genres</button>
    </div>
  )
}


export default Books