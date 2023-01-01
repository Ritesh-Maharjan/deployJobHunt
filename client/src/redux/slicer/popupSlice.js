import { createSlice } from '@reduxjs/toolkit'

export const popSlice = createSlice({
  name: 'popup',
  initialState: {
    popup: false
  },
  reducers: {
    togglePopup: (state,action) => {
      state.popup = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { togglePopup } = popSlice.actions

export default popSlice.reducer