import { createSlice } from '@reduxjs/toolkit'
const initialState = ""

const notificationSlice = createSlice({  
  name: 'notification',  
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification(state, action) {
      return ""
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (content, timeOut) => {
  return async (dispatch) => {
    dispatch(showNotification(content))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeOut*1000)
  }
}

export default notificationSlice.reducer