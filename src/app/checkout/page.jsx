'use client'

import { useSelector } from 'react-redux'
import '../../styles/pages/checkout.css'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {wilayat} from '../data/wilayat'


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

async function fetchPlaceOrder(name,phoneNumber,wilaya,adresse,shippingMethod,totalPrice,orders,imagesOn) {
    try {
        const res = await axios.post(`http://localhost:3000/api/orders`,{
            name,
            phoneNumber,
            wilaya,
            adresse,
            shippingMethod,
            totalPrice,
            orders,
            imagesOn
        });
        return res.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
}


function Checkout() {

    // Form Data States
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedWilaya, setSelectedWilaya] = useState('');
    const [adresse, setAdresse] = useState('');
    const [selectedShipping, setSelectedShipping] = useState('');
    const [imagesOn, setImagesOn] = useState([]);
    console.log(imagesOn)

    // Form validation States
    const [isShippingSelected, setIsShippingSelected] = useState(true);
    const [isWilayaSelected, setIsWilayaSelected] = useState(true);
    const [isPhoneCorrect, setIsPhoneCorrect] = useState(true);

    // Form Change Functions
    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handlePhoneChange = (e) => {
        setIsPhoneCorrect(true)
        setPhoneNumber(e.target.value);
    };
    const handleWilayaChange = (e) => {
        setIsWilayaSelected(true)
        setSelectedWilaya(e.target.value);
    };
    const handleAdresseChange = (e) => {
        setAdresse(e.target.value);
    };
    const handleShippingChange = (e) => {
        setIsShippingSelected(true)
        setSelectedShipping(e.target.value);
    };
    

    
    let cart = useSelector((state) =>state.cart.cart)
    
    const subTotalPriceState = useSelector((state) =>state.totalPrice.totalPrice)
    
    const { data: products, isLoading, isError } = useQuery({
        queryKey: cart.map(cartItem => cartItem._id),
        queryFn: (queryKey) => fetchProducts(queryKey.queryKey)
    });
    
    useEffect(()=>{
        if(products){
            products.forEach(p=>{
                setImagesOn(pre=>{
                    console.log('pre ',pre)
                    return [...pre,{imageOn:p.imageOn}]
                })
                    
            })
        }
        
    },[products])
    if(!products) return 0

    const productsElemtnt =cart.map(cartItem=>{
        let product 
        products.forEach(p=>{
        if(p._id === cartItem._id){
            product = p
        }
        })
        return(
            <div key={cartItem._id} className="product">
                <div className="product-image-container">
                    <span className="product-quntity">
                        {cartItem.qnt}
                    </span>
                    <img src={product.imageOn} className="product-image" />
                </div>
                <div className="product-title">
                    {product.title}
                </div>
                <div className="product-price">
                    <span className="products-price">{cartItem.price *cartItem.qnt}
                </span> Da</div>
            </div>
        )
    })

    const phonePattern = /^\d{10}$/;

    let shippingPrice 
    if(selectedWilaya && selectedShipping){
        wilayat.forEach(wilaya=>{
            if(wilaya.name === selectedWilaya){
                shippingPrice = selectedShipping === 'بيت'
                    ?wilaya.dar
                    :wilaya.beru
            }
        })
    }

    const totalPrice = subTotalPriceState +shippingPrice
    function handelSubmit(e){
        e.preventDefault()

        if (!phonePattern.test(phoneNumber)) return setIsPhoneCorrect(false)

        if(!selectedWilaya) return setIsWilayaSelected(false)
        
        if(!selectedShipping) return setIsShippingSelected(false)

        fetchPlaceOrder(name,phoneNumber,selectedWilaya,adresse,selectedShipping,totalPrice,cart,imagesOn)

        console.log('oreder placed')
        
        cart =[]
        localStorage.setItem('cart', JSON.stringify(cart))
           

        
    }

    

    const wilayatOptionsElement = wilayat.map(wilaya=>(
        <option key={wilaya.name} value={wilaya.name}>{wilaya.name}</option>
    ))
    
    const shippingStyle={
        color: shippingPrice ? 'black' : ' rgb(220 38 38) ',
        fontWeight:shippingPrice? 'normal' : ' 600 '
    }

  return (
  <div className='bg-white h-screen overflow-x-hidden lg:overflow-hidden'>
    <header className='flex items-center justify-center'>
        <a href="/" className="logo-container w-24 block">
            <img src="assets/logo.png" className="logo" />
        </a>
    </header>
    <main>
        <section className="form-section bg-white h-screen">
            <div className="form-container">
                <h1 className='font-bold text-2xl mt-5 mb-5'>Delivery</h1>
                <form onSubmit={handelSubmit}>
                    <input onChange={handleNameChange} required className="name"  placeholder="Name" name="name" type="text" />
                    {!isPhoneCorrect && <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                        أدخل رقم هاتف صحيح 
                    </h1>}
                    <input onChange={handlePhoneChange} required className="phone"  placeholder="Phone" name="phone" type="text" />
                    {!isWilayaSelected && <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                          أدخل الولاية 
                    </h1>}
                    <select  value={selectedWilaya} onChange={handleWilayaChange} required className="wilaya"  name="wilaya"  >
                        <option value="الولاية" hidden >الولاية</option>
                        {wilayatOptionsElement}
                    </select>
                    <input onChange={handleAdresseChange} required className="baldia"  placeholder="Adresse" name="Adresse" type="text" />
                    {!isShippingSelected && <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                          أدخل طريقة التوصيل 
                    </h1>}
                    <select value={selectedShipping} onChange={handleShippingChange} required className="shippingmethod" name="shippingmethod"  >
                        <option value='طريقة التوصيل' hidden >طريقة التوصيل</option>
                        <option value="بيت">بيت</option>
                        <option value="مكتب">مكتب</option>
                    </select>
                    <div className="hidden-inputs">
                       
                        <input required  name="totalPrice" id="totalPrice" type="hidden" />
                    </div>
                    
                    <button type="submit" className="submit-button">أطلب الان</button>
                </form>
            </div>
        </section>
        <section className="order-details-section h-screen">
            <div className="order-details-container">
                <div className="order-summary-title">Order Summary</div>

                <div className="product-items-container">
                    {productsElemtnt}
                </div>
    
                <div className="order-price-cintainer">
    
                    <div className="nospasing subtotal prcie-c">
                        <div className="nospasing subtotal-text">Subtotal</div>
                        <div className="nospasing subtotal-price">
                            <span className="nospasing js-subtotal-price" >{subTotalPriceState}</span> DA
                        </div>
                    </div>
    
                    <div className="nospasing shipping prcie-c">
                        <div className="nospasing shipping-text">Shipping</div>
                        <div className="nospasing shipping-price">
                            <span style={shippingStyle} className="nospasing js-shipping-price">
                                {shippingPrice?shippingPrice+' DA':
                               ' ادخل الولاية و طريقة التوصيل لتحديد السعر'
                                }
                            </span>
                            
                        </div>
                    </div>
    
                    <div className="nospasing total prcie-c">
                        <div className="nospasing total-text">Total</div>
                        <div style={shippingStyle} className="nospasing total-price">
                        {shippingPrice?(shippingPrice+subTotalPriceState)+' DA':
                               ' ادخل الولاية و طريقة التوصيل لتحديد السعر'
                        }
                        </div>
                    </div>
    
                </div>
            </div>

        </section>
    </main>
  </div>
  )
}

export default Checkout