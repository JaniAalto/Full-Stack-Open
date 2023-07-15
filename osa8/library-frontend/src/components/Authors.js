import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'


const UpdateForm = ({ authors, birthYear, setAuthorName, setBirthYear, submit, loggedIn }) => {
  if (loggedIn) {
    return (
      <div><form onSubmit={submit}>
        <div>
          Name:
          <select onChange={({ target }) => setAuthorName(target.value)}>
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}</option>
            ))}
          </select>
        </div>
        <div>
          Born:
          <input
            value={birthYear}
            onChange={({ target }) => setBirthYear(Number(target.value))}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
      </div>
    )
  }
}

const Authors = (props) => {
  const [authorName, setAuthorName] = useState('')
  const [birthYear, setBirthYear] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log("updateAuthor error", error)
    }
  })

  if (!props.show) {
    return null
  }

  if (props.authors.loading) {
    return <div><h2>Authors</h2>loading...</div>
  }

  let authors = []

  if (props.authors.data) {
    authors = props.authors.data.allAuthors
    //console.log("props authors", authors)
  }

  const submit = async (event) => {
    event.preventDefault()

    await updateAuthor({ variables: { authorName, birthYear } })

    setAuthorName('')
    setBirthYear('')
  }


  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <UpdateForm authors={authors} birthYear={birthYear} setAuthorName={setAuthorName}
        setBirthYear={setBirthYear} submit={submit} loggedIn={props.loggedIn} />
    </div>
  )
}


export default Authors