"use client"
import { useState } from 'react'
import '../styles/shared/header.css'
import Link from 'next/link'

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
                <Link href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src="../../assets/Instagram.png" />
                </Link>
                <Link href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons z-50" src="../../assets/tiktok.png" />
                </Link>
            </div>
            <h5>
              الخيار الأفضل  / the best choice
            </h5>
            <span>!</span>

        </div>
    </div>
    <header>
        <img onClick={handleSideToggel} src="../../assets/burger.png" className="burger-button" /> 
        <div>
          <div className="w-full">
            <div className='m-auto mb-4 max-w-20'>
              <Link href='/led-painting'>
               <img src='../../assets/logo.png' className="header--logo " /> </Link>
            </div>
          </div>
        </div>
        <div onClick={handleSideToggel} style={shadowStyle} className="side-menu-shadow z-20"></div>
        <div style={sideStyle} className="side-menu">
            <section className="side-menu--top">
              <Link href="/led-painting" className='text-gray-900'>Luminous Frames</Link>
              <Link href="/faq" className='text-gray-900'>FAQS</Link>
              <Link href="/contact" className='text-gray-900'>Contact Us</Link>
            </section>
            <section className="side-menu--low">
                <Link href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src='../../assets/instagram.png' />                 
                </Link>
                <Link href="https://www.instagram.com/drawlys_deco/">
                  <img className="utility-bar--icons" src="../../assets/tiktok.png" />
                </Link>
            </section>
        </div>
        <nav>
            <Link href="/led-painting">Luminous Frames</Link>
            <Link href="/faq">FAQS</Link>
            <Link href="/contact">Contact Us</Link>
        </nav>
    </header>
    </>
  )
}

export default Header