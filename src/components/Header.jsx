"use client"
import { useState } from 'react'
import '../styles/shared/header.css'

function Header() {
  const [isSideShown,srtIsSideShown] = useState(false)

  const sideStyle = {
    translate: isSideShown? '0px' :'-400px 0px '
  }
  const shadowStyle = {
    display: isSideShown? 'block' :'none'
  }

  function handleSideToggel(){
    srtIsSideShown(pre=>!pre)
  }
  return (
    <>
    <div className="utility-bar">
        <div className="utility-bar--container">
            <div className="utility-bar--icons-container">
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src="../../assets/Instagram.png" />
                </a>
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src="../../assets/tiktok.png" />
                </a>
            </div>
            <h5>Free shipping WORLDWIDE on all orders!</h5>
            <span>!</span>

        </div>
    </div>
    <header>
        <img onClick={handleSideToggel} src="../../assets/burger.png" className="burger-button" /> 
        <div>
          <div className="w-full">
            <div className='m-auto mb-4 max-w-20'>
              <a href='/led-painting'>
               <img src='../../assets/logo.png' className="header--logo " /> </a>
            </div>
          </div>
        </div>
        <div onClick={handleSideToggel} style={shadowStyle} className="side-menu-shadow z-20"></div>
        <div style={sideStyle} className="side-menu">
            <section className="side-menu--top">
              <a href="/led-painting" className='text-gray-900'>Luminous Frames</a>
              <a href="/faq" className='text-gray-900'>FAQS</a>
              <a href="/contact" className='text-gray-900'>Contact Us</a>
            </section>
            <section className="side-menu--low">
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src='../../assets/instagram.png' />                 
                </a>
                <a href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src="../../assets/tiktok.png" />
                </a>
            </section>
        </div>
        <nav>
            <a href="/led-painting">Luminous Frames</a>
            <a href="/faq">FAQS</a>
            <a href="/contact">Contact Us</a>
        </nav>
    </header>
    </>
  )
}

export default Header