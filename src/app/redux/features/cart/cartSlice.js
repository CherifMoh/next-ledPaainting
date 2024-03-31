"use client"

import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  cart: typeof localStorage !== 'undefined' && localStorage.getItem('cart') !=='' ? JSON.parse(localStorage.getItem('cart')) || [] : [],
};


export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const cart = state.cart;
      const matchingItem = cart.find(item => item._id === action.payload._id);
      
      if (matchingItem) {
          const updatedCart = cart.map(item => {
              if (item._id === matchingItem._id) {
                  return { ...item, qnt: item.qnt + Number(action.payload.qnt) };
              }
              return item;
          });
          
          return { ...state, cart: updatedCart };
      } else {
          return { ...state, cart: [...cart, { _id:action.payload._id, qnt: action.payload.qnt, price:action.payload.price}] };
      }
  },
  removeProduct: (state, action) => {
    let cart = state.cart
    const updatedCart = cart.filter(item => item._id !== action.payload._id);
    return  { ...state, cart: updatedCart }


  },updatedQuntity:(state, action)=>{

    let cart = state.cart

    const updatedCart = cart.map(cartItem=>{

      if(cartItem._id === action.payload._id){

        return {...cartItem, qnt:action.payload.qnt}

      }else{

        return cartItem
      }
    })
    return { ...state, cart: updatedCart }
  }
  },
})

  
export const { addProduct, removeProduct, updatedQuntity } = cartSlice.actions

export default cartSlice.reducer