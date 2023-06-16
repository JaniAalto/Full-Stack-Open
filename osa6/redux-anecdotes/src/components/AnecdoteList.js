import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const filterString = useSelector(state => state.filter)
  const anecdotes = useSelector(state => {
    return state.anecdotes
  })
  console.log('anecdotes to render', anecdotes)
  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filterString)
  )
  console.log('filteredAnecdotes', filteredAnecdotes)

  const dispatch = useDispatch()

  const sendVote = (anecdote) => {
    dispatch(voteFor(anecdote))
    dispatch(setNotification(`You voted for: "${anecdote.content}"`, 4))
  }

  filteredAnecdotes.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            votes: {anecdote.votes}
            <button onClick={() => sendVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList