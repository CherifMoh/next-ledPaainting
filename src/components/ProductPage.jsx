"use client"

import '../styles/pages/ledProductPage.css'
import '../styles/pages/index.css'

import { useSelector, useDispatch } from 'react-redux'
import { addProduct, removeProduct, updatedQuntity } from '../app/redux/features/cart/cartSlice'
import { showCartToggle } from "../app/redux/features/showCart/showCartSlice";
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ruler from '../../public/assets/ruler.svg'
import arrowDown from '../../public/assets/arrow-down.svg'
import Material from '../../public/assets/Material.svg'


function ProductPage({ mproduct }) {

    const [qnt, setQnt] = useState(1)
    const [isDimensions, setIsDimensions] = useState(false)
    const [isMaterial, setIsMaterial] = useState(false)

    const isCartShown = useSelector((state) =>state.isCartShown.isCartShown)

    
    const cart = useSelector((state) => state.cart.cart)
    const dispatch = useDispatch();
    
    const handelCartToggle =()=>{
        dispatch(showCartToggle());
    }
    
    const handleAddToCart = (productId, qnt, price) => {
        console.log("Adding product to cart:", productId, qnt);
        handelCartToggle()
        dispatch(addProduct({
            _id: productId,
            qnt: qnt,
            price:price
        }));
    };
    const handleUpdateCart = (productId, qnt) => {
        dispatch(updatedQuntity({
            _id: productId,
            qnt: qnt
        }));
    };

    
    localStorage.setItem('cart', JSON.stringify(cart))

    
    return (
        <section className="selected-prodect-container">
            <section className="product-gallery">
                <div className="main-image-container">
                    <Image alt='' src={mproduct.imageOn} width={20} height={20} className="main-image main-image-on" />
                    <Image alt='' src={mproduct.imageOff} width={20} height={20} className="main-image main-image-off" />
                </div>
                <div className="gallery-container flex gap-1">
                    <Image alt='' src={mproduct.imageOff} width={20} height={20} className="gallery-image" />
                    <Image alt='' src={mproduct.imageOn} width={20} height={20} className="gallery-image" />
                </div>
            </section>
            <section className="product-info">
                <div className="product-title spawn-anime">{mproduct.title}</div>
                <div className="price-container spawn-anime">
                    {/* <span className="price-befor-sale ">{mproduct.price} DA</span> */}
                    <span className="price-after-sale ">{mproduct.price} DA</span>
                    <span className="sale-mark">Sale</span>
                </div>
                <p className="spawn-anime mt-4 mb-4">Quantity</p>
                <div className="quantity-container spawn-anime flex">
                    <button
                        className="minus-quantity-button flex items-start justify-center"
                        onClick={() =>{
                            if(qnt > 1 ){
                                setQnt(pre => pre - 1)
                            }
                        }}
                    >
                        _
                    </button>
                    <div
                        className="quantity-input text-center flex items-center justify-center"
                    >{qnt}</div>
                    <button
                        className="plus-quantity-button pb-1"
                        onClick={() => (setQnt(pre => pre + 1))}
                    >
                        +
                    </button>
                </div>
                <button
                    className="Add-to-cart spawn-anime"
                    data-product-id={mproduct._id}
                    onClick={() => handleAddToCart(mproduct._id, qnt, 4500)}
                >
                    Add to cart
                </button>
                <Link href="/checkout">
                    <button 
                    className="Add-to-cart spawn-anime buy-now" 
                    data-product-id={mproduct._id}
                    onClick={() => handleAddToCart(mproduct._id, qnt, 4500)}
                    >Buy now</button></Link>

                <div className="discription-container spawn-anime">
                    <p className="discription mt-4 mb-4">
                        An emotional reunion between two destined lovers. This piece perfectly captures the essence of this entire scene and the true meaning of love that we all yearn for. When the light ignites, it&apos;s as if magic unfolds before your eyes<br />—our cherished long-lost lovers are reunited for one last time.
                        <br /><br />Step into the enchanting world of &quot;Your Name&quot; with our handcrafted masterpiece, where each brushstroke is lovingly crafted to perfection, ensuring an experience that touches your heart and soul.
                    </p>
                    <div className="drop-container">
                        <div className="drop-down">
                            <div className="drop-header js-dimensions cursor-pointer" onClick={()=>setIsDimensions(pre=>!pre)}>
                                <Image className="drop-icon" src={ruler} width={5} height={5} alt="" />
                                <h2 className="drop-title">Dimensions</h2>
                                <Image 
                                 src={arrowDown} width={5} height={5} alt="" 
                                 className={`drop-arrow js-dimensions-arrow transition-all duration-100 ${isDimensions && 'rotate-180'}`}
                                />
                            </div>
                                <div className={`dimensions-body transition-all duration-500 ${!isDimensions && 'hidden'}`}>
                                    <p className="drop-dimensions-title">(L x W)</p>
                                    <p className="dimensions">
                                        21 cm x 29.7 cm
                                    </p>
                                </div>
                        </div>


                        <div className="drop-down">
                            <div className="drop-header js-material drop-header2 cursor-pointer" onClick={()=>setIsMaterial(pre=>!pre)}>
                                <Image  
                                 className="drop-icon" 
                                 src={Material}
                                 width={10}
                                 height={10} 
                                 alt="" 
                                />
                                <h2 className="drop-title">Material</h2>
                                <Image  
                                 className={`drop-arrow js-material-arrow transition-all duration-100 ${isMaterial && 'rotate-180'}` }
                                 src={arrowDown} alt=""
                                 height={5} width={5} 
                                />
                            </div>
                                <div className={`material-body transition-all duration-500 ${!isMaterial && 'hidden'}`}>
                                    <p className="material" >Frame: Exquisite wood grain frame</p>
                                </div>      
                        </div>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default ProductPage