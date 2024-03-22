"use client"

import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isCartShown: false ,
}


export const isCartShownSlice = createSlice({
  name: 'isCartShown',
  initialState,
  reducers: {
    showCartToggle: (state, action) => {
        console.log('cart Slice ',state.isCartShown)
        
        return {...state,isCartShown :!state.isCartShown}
    },
  },
})

  
export const { showCartToggle} = isCartShownSlice.actions

export default isCartShownSlice.reducer