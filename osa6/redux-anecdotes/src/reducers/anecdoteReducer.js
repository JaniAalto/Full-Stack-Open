import { createSlice } from '@reduxjs/toolkit'
import dataTransfer from '../services/dataTransfer'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    addVote(state, action) {
      const id = action.payload.id.toString()
      const votedIndex = state.findIndex(anecdote => anecdote.id === id)
      state[votedIndex].votes += 1
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setInitialList(state, action) {
      return action.payload
    }
  }
})

export const { addVote, appendAnecdote, setInitialList } = anecdoteSlice.actions

export const initialiseAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await dataTransfer.getAll()
    dispatch(setInitialList(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await dataTransfer.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteFor = (content) => {
  return async (dispatch) => {
    const updatedAnecdote = await dataTransfer.update(content)
    dispatch(addVote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer