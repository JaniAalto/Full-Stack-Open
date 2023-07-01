import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Table = styled.table`
  line-height: 1.8em;
  padding-top: 2em;
  padding-left: 0.5em;
  margin-bottom: 2em;

  td:nth-child(2) {
    text-align: right;
  }
`

const Users = ({ users }) => {

  if (users) {
    return (
      <Table className='users'>
        <tbody>
          <tr>
            <td></td>
            <th>Blogs created</th>
          </tr>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}> {user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </Table>
    )
  }
}

export default Users