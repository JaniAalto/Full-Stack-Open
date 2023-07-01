import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'


const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogin(state, action) {
      return action.payload
    },
    userLogout() {
      return initialState
    },
    setUser(state, action) {
      return action.payload
    }
  }
})

const allUsersSlice = createSlice({
  name: 'allUsers',
  initialState,
  reducers: {
    getUsers(state, action) {
      return action.payload
    }
  }
})

export const { userLogin, userLogout, setUser } = userSlice.actions
export const { getUsers } = allUsersSlice.actions

export const doLogin = (credentials) => {
  console.log("logging in as", credentials)

  return async (dispatch) => {
    const user = await loginService.login(credentials)
      .catch(error => {
        console.log("error", error.response.data)
        return error.response.data.error
      })
    console.log("userService response", user)

    if (typeof user === 'object') {
      blogService.setToken(user.token)
      dispatch(userLogin(user))
    }
    return user
  }
}

export const doLogout = () => {
  return async (dispatch) => {
    blogService.setToken("")
    dispatch(userLogout())
  }
}

export const setUserFromLocalStorage = (user) => {
  return async (dispatch) => {
    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const getAllUsers = () => {
  return async (dispatch) => {
    const response = await userService.getAll()
    dispatch(getUsers(response))
  }
}


export const userReducer = userSlice.reducer
export const allUsersReducer = allUsersSlice.reducer