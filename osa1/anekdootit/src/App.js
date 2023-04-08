import { useState } from 'react';


const App = () => {
  const anecdotes = [
    '(1) If it hurts, do it more often.',
    '(2) Adding manpower to a late software project makes it later!',
    '(3) The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    '(4) Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    '(5) Premature optimization is the root of all evil.',
    '(6) Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    '(7) Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    '(8) The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0))
  console.log(points)
  const [mostVoted, setmostVoted] = useState(0)
  

  const randomAnecdote = () => {
    const result =  Math.floor(Math.random() * anecdotes.length)
    console.log("result ", result)
    setSelected(result)
  }

  const voteCurrent = () => {
    const copy = [...points]
    copy[selected] += 1
    //console.log("votes ", copy)
    setPoints(copy)
    checkHighestVoted(copy)
  }

  const checkHighestVoted = (array) => {
    const highest = array.indexOf(Math.max(...array))
    //console.log("highest voted index ", highest)
    setmostVoted(highest)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <button onClick={voteCurrent}>Vote</button>
      <button onClick={randomAnecdote}>Next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVoted]}</p>
      <p>has {points[mostVoted]} votes</p>
    </div>
  )
};


export default App;