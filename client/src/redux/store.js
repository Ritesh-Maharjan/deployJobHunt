import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slicer/authSlice"
import popupReducer from "./slicer/popupSlice"

export default configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer
  },
})