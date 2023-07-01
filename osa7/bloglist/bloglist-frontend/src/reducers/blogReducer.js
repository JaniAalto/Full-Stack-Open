import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'


const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
    addVote(state, action) {
      const id = action.payload
      const votedIndex = state.findIndex(blog => blog.id === id)
      state[votedIndex].likes += 1
    },
    setInitialList(state, action) {
      return action.payload
    }
  }
})

export const { appendBlog, deleteBlog, addVote, setInitialList } = blogSlice.actions

export const createNewBlog = (content) => {
  return async (dispatch) => {
    const response = await blogService.create(content)
      .catch(error => {
        console.log("error", error.response.data)
        return error.response.data
      })
    console.log("blogService response", response)

    if (typeof response === 'object') {
      const blogToAppend = response
      blogToAppend.user = {
        username: content.username,
        name: content.user,
        id: content.userId
      }
      dispatch(appendBlog(response))
    }
    return response
  }
}

export const deleteBlogById = (id) => {
  return async (dispatch) => {
    //console.log("deleteBlogById id", id)
    await blogService.remove(id).catch(error =>
      console.log(error.response.data)
    )
    dispatch(deleteBlog(id))
  }
}

export const voteFor = (id, content) => {
  return async (dispatch) => {
    //console.log("voteFor id, content", id, content)
    await blogService.update(id, content).catch(error =>
      console.log(error.response.data)
    )
    dispatch(addVote(id))
  }
}

export const initialiseBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setInitialList(blogs))
  }
}

export default blogSlice.reducer