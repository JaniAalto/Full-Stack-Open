const Recommend = (props) => {

  if (!props.show) {
    return null
  }

  if (props.books.loading || props.user.loading) {
    return <div>loading...</div>
  }
  console.log("props.user", props.user)

  let books = []
  let usersGenre = ""

  if (props.books.data)
    books = props.books.data.allBooks

  if (props.user.data.me)
    usersGenre = props.user.data.me.favouriteGenre
  

  const booksToShow = books.filter(book => book.genres.includes(usersGenre))


  return (
    <div>
      <h2>Recommendations</h2>
      <p>Books in your favourite genre: <b>{usersGenre}</b></p>
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
    </div>
  )
}

export default Recommend