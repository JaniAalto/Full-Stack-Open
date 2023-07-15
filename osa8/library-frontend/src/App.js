import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/LoginForm'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, USER_INFO } from './queries'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import Recommend from './components/Recommend'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const authors = useQuery(ALL_AUTHORS, {
    skip: page !== 'authors'
  })
  const books = useQuery(ALL_BOOKS, {
    skip: page === 'authors'
  })
  const user = useQuery(USER_INFO, {
    skip: page !== 'recommend'
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      alert(`New book was added: ${addedBook.title} by ${addedBook.author.name}`)

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
      books.refetch()
    }
  })

  useEffect(() => {
    if (!token) {
      const token = localStorage.getItem('library-user-token')
      setToken(token)
    }
  }, [token])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  //console.log("authors", authors)
  //console.log("books", books)


  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} authors={authors} loggedIn={false} />
        <Books show={page === 'books'} books={books} />
        <Login show={page === 'login'} setToken={setToken} setPage={setPage} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={authors} loggedIn={true} />
      <Books show={page === 'books'} books={books} />
      <NewBook show={page === 'add'} />
      <Recommend show={page === 'recommend'} books={books} user={user} />
    </div>
  )
}

export default App