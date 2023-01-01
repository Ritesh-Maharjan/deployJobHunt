import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: ''
  },
  reducers: {
    loggingIn: (state,action) => {
      state.user = action.payload
    },
    loggingOut:(state) => {
      state.user = ""
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { loggingIn, loggingOut } = authSlice.actions

export default authSlice.reducer