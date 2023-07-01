import { createSlice } from '@reduxjs/toolkit'
const initialState = ["", false]

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return [action.payload, false]
    },
    showError(state, action) {
      return [action.payload, true]
    },
    hideNotification() {
      return ["", false]
    }
  }
})

export const { showNotification, showError, hideNotification } = notificationSlice.actions

export const setNotification = (content, timeOut) => {
  return async (dispatch) => {
    dispatch(showNotification(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeOut*1000)
  }
}

export const setErrorNotification = (content, timeOut) => {
  return async (dispatch) => {
    dispatch(showError(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeOut*1000)
  }
}

export default notificationSlice.reducer