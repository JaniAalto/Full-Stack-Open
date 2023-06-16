import { useMutation, useQueryClient } from 'react-query'
import { useContext } from 'react'
import axios from 'axios'
import NotificationContext from './NotificationContext'


const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation(anecdote =>
    axios.post('http://localhost:3001/anecdotes', anecdote)
    .then(res => res.data), {
      onSuccess: (response) => {
        queryClient.invalidateQueries('anecdotes')

        notificationDispatch({ type: "NEW", payload: response.content })
        setTimeout(() => {
          notificationDispatch({ type: "HIDE" })
        }, 5000)
      },
      onError: (response) => {
        console.log("ERROR!", response)
        notificationDispatch({ type: "ERROR", payload: response.response.data.error })
        setTimeout(() => {
          notificationDispatch({ type: "HIDE" })
        }, 5000)
      }
  }
  )

  const onCreate = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    newAnecdoteMutation.mutate({ content, votes: 0 })
  }


  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
