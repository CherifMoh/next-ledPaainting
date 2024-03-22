"use client"

import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import showCartReducer from './features/showCart/showCartSlice'
import totalPriceReducer from './features/totalePrice/totalePrice'



export const store = configureStore({
  reducer: {
    cart:cartReducer,
    isCartShown:showCartReducer,
    totalPrice:totalPriceReducer,
  },
})