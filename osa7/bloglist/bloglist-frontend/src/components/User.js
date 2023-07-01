import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const List = styled.ul`
  padding: 5px 20px;
  line-height: 2em;
`

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(user => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <br />
      <h3>Added blogs:</h3>
      <List>
        {user.blogs.map(blog =>
          <li key={blog.id}> {blog.title}</li>
        )}
      </List>
    </div>
  )
}

export default User