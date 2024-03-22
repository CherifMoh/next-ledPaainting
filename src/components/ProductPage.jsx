"use client"

import '../styles/pages/ledProductPage.css'
import '../styles/pages/index.css'

import { useSelector, useDispatch } from 'react-redux'
import { addProduct, removeProduct, updatedQuntity } from '../app/redux/features/cart/cartSlice'
import { showCartToggle } from "../app/redux/features/showCart/showCartSlice";
import { useState } from 'react'


function ProductPage({ mproduct }) {

    const [qnt, setQnt] = useState(1)

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
                    <img src={mproduct.imageOn} className="main-image main-image-on" />
                    <img src={mproduct.imageOff} className="main-image main-image-off" />
                </div>
                <div className="gallery-container flex gap-1">
                    <img src={mproduct.imageOff} className="gallery-image" />
                    <img src={mproduct.imageOn} className="gallery-image" />
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
                <a href="/checkout">
                    <button 
                    className="Add-to-cart spawn-anime buy-now" 
                    data-product-id={mproduct._id}
                    onClick={() => handleAddToCart(mproduct._id, qnt, 4500)}
                    >Buy now</button></a>

                <div className="discription-container spawn-anime">
                    <p className="discription mt-4 mb-4">
                        An emotional reunion between two destined lovers. This piece perfectly captures the essence of this entire scene and the true meaning of love that we all yearn for. When the light ignites, it's as if magic unfolds before your eyes<br />—our cherished long-lost lovers are reunited for one last time.
                        <br /><br />Step into the enchanting world of "Your Name" with our handcrafted masterpiece, where each brushstroke is lovingly crafted to perfection, ensuring an experience that touches your heart and soul.
                    </p>
                    <div className="drop-container">
                        <div className="drop-down">
                            <div className="drop-header js-dimensions">
                                <img className="drop-icon" src="../../../../assets/ruler.svg" alt="" />
                                <h2 className="drop-title">Dimensions</h2>
                                <img className="drop-arrow js-dimensions-arrow" src="../../../../assets/arrow-down.svg" alt="" />
                            </div>
                            <div className="dimensions-body display-none">
                                <p className="drop-dimensions-title">(L x W)</p>
                                <p className="dimensions">
                                    21 cm x 29.7 cm
                                </p>
                            </div>
                        </div>


                        <div className="drop-down">
                            <div className="drop-header js-material drop-header2">
                                <img className="drop-icon" src="../../../../assets/Material.svg" alt="" />
                                <h2 className="drop-title">Material</h2>
                                <img className="drop-arrow js-material-arrow" src="../../../../assets/arrow-down.svg" alt="" />
                            </div>
                            <div className="material-body display-none">
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