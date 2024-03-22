"use client"

import '../styles/shared/cart.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct, removeProduct, updatedQuntity } from '../app/redux/features/cart/cartSlice'
import { showCartToggle } from '../app/redux/features/showCart/showCartSlice'
import { setTotalPrice } from '../app/redux/features/totalePrice/totalePrice'

import axios from "axios";
import { useQuery } from '@tanstack/react-query';


async function fetchProducts(idArray) {
  try {
    const promises = idArray.map(async id => {
      const res = await axios.get(`http://localhost:3000/api/products/${id}`);
      return res.data[0];
    });
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

function Cart() {

  const [isCartEmpty,setIsCartEmpty] = useState(true)
  
  const cart = useSelector((state) =>state.cart.cart)

  const isCartShown = useSelector((state) =>state.isCartShown.isCartShown)
  
  const totalPriceState = useSelector((state) =>state.totalPrice.totalPrice)

  
  const cartStyle ={
    translate:isCartShown ?`0px`: `440px 0px`
  }
  
  
  
  
  let totalPrice = 0
  cart.forEach(cartItem=>{
    totalPrice += Number(cartItem.qnt)*Number(cartItem.price)
  })
  
  const totalQnt = cart.reduce((acc, cartItem) => acc + cartItem.qnt, 0);
    
  const { data: products, isLoading, isError } = useQuery({
    queryKey: cart.map(cartItem => cartItem._id),
    queryFn: (queryKey) => fetchProducts(queryKey.queryKey)
  });
  
  useEffect(()=>{
    if(totalQnt > 0){
      setIsCartEmpty(false)
    }else{
      setIsCartEmpty(true)
    }
  },[totalQnt])
  
  useEffect(()=>{
    handelTotalPrice(totalPrice)
  },[totalPrice])

  if(!cart) return 0
  const dispatch = useDispatch();

  const handleUpdateCart = (productId, qnt) => {
      dispatch(updatedQuntity({
        _id: productId,
        qnt: qnt,
      }));
  };

  const handleRemoveCartItem = (productId) => {
      dispatch(removeProduct({
        _id: productId,
      }));
  };

  const handelCartToggle =()=>{
    dispatch(showCartToggle());
  }
  
  const handelTotalPrice =(price)=>{
    dispatch(setTotalPrice({
      price:price
    }));
  }
  localStorage.setItem('cart', JSON.stringify(cart));

  if (isLoading) return console.log('Loading...');
  if (isError) return console.log("Error fetching products"); 
    
  
  const cartItemsElements =cart.map(cartItem =>{
    let product 
    products.forEach(p=>{
      if(p._id === cartItem._id){
        product = p
      }
    })
    if(cartItem.qnt === 0){
      handleRemoveCartItem(cartItem._id)
    }
    return(
      <div key={cartItem._id} className="cart-item-container">
                <div className="cart-item-img-container">
                    <img src={product.imageOn} className="cart-item-img" />
                </div>
                <div className="cart-item-info-container">
                    <div className="cart-item-top-row">
                        <div className="cart-item-title">{product.title}</div>
                        <div
                         className="cart-item-trash" 
                        data-product-id={product._id}
                        onClick={()=>handleRemoveCartItem(product._id)}
                        >
                          X
                        </div>
                    </div>
                    <div className="cart-item-lower-row">
                        <div className="cart-item-quantity-container">
                            <button 
                              className="cart-item-minus-button" 
                              data-product-id={cartItem._id}
                              onClick={()=>{
                                if(cartItem.qnt >=1){
                                  handleUpdateCart(product._id, cartItem.qnt-1)
                                }
                              }
                              }
                              
                            >
                              -
                            </button>
                            <input
                              className="cart-item-quantity-input" 
                              data-product-id={cartItem._id} 
                              value={cartItem.qnt} min="1" 
                              type="text"
                              onChange={(e)=>handleUpdateCart(product._id, e.target.value)}
                              />
                            <button 
                              className="cart-item-plus-button" 
                              data-product-id={cartItem._id}
                              onClick={()=>handleUpdateCart(product._id, cartItem.qnt+1)}
                            >+</button>
                        </div>
                        <div className="cart-item-price-container">
                            <div className="cart-item-price">
                                {/* <span className="cart-item-befor-price" data-product-id={cartItem._id}>{product.price *cartItem.quantity}</span> */}
                                <span className="cart-item-after-price" >{cartItem.price *cartItem.qnt } DA</span>
                            </div>
                            <div className="cart-item-saved">
                            {/* (Save <span className="js-cart-item-saved" data-product-id={cartItem._id}>{(product.price - product.salePrice)*cartItem.quantity}</span>DA) */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
  });
  
  
  return (
    <>
        <div onClick={handelCartToggle} className="cart-button-container">
            <img className="cart-shopping-bag" src="../../assets/shopping-bag.png" alt="" />
            <span className="cart-button-quntity-number">{totalQnt}</span>
        </div>

        <div style={cartStyle} className="cart-container ">
            <div className="cart-header">
                <h2 className="cart-header-quntity">Cart • {totalQnt}</h2>
                <button onClick={handelCartToggle} className="cart-off">X</button>
            </div>
            <div className="cart-items"  >
              {cartItemsElements}
            </div>
            {isCartEmpty
            ? 
              <h1  className='text-3xl text-red-600 font-bold text-center mt-10'>You Cart is Empty</h1>
            :
              <a href="/checkout">
                <button className="cart-checkout">
                    Checkout • <span className="checkout-price">{totalPriceState}</span> DA
                </button>
              </a>
            
            }
              
        </div>
    </>
  )
}

export default Cart