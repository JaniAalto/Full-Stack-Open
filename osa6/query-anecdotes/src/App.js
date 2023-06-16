import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useContext } from 'react'
import axios from 'axios'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './components/NotificationContext'


const App = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)
  
  const updateAnecdoteMutation = useMutation(updatedAnecdote =>
    axios.put(`http://localhost:3001/anecdotes/${updatedAnecdote.id}`, updatedAnecdote)
    .then(res => res.data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries('anecdotes')

      notificationDispatch({ type: "VOTE", payload: response.content })
      setTimeout(() => {
        notificationDispatch({ type: "HIDE" })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    //console.log('voted for', anecdote.id)
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes+1 })
/*
    notificationDispatch({ type: "VOTE", payload: anecdote.content})
    setTimeout(() => {
      notificationDispatch({ type: "HIDE"})
    }, 5000)*/
  }

  let anecdotes = [
    {
      "content": "If it hurts, do it more often",
      "id": "47145",
      "votes": 0
    }
  ]

  const result = useQuery('anecdotes', () =>
    axios.get('http://localhost:3001/anecdotes').then(res => res.data),
    {
      retry: 1
    }
  )
  //console.log("result", result)

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return <div>Error: server not available</div>
  }

  anecdotes = result.data
  //console.log("anecdotes", anecdotes)


  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default App