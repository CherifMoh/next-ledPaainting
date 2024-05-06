"use client"
import { useState } from 'react'
import '../../styles/shared/header.css'
import Link from 'next/link'
import Image from 'next/image'
import instaIcon from '../../../public/assets/Instagram.png'
import tiktokIcon from '../../../public/assets/tiktok.png'
import burger from '../../../public/assets/burger.png'
import logo from '../../../public/assets/logo.png'


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
                  <Image className="utility-bar--icons" width={76} height={76} src={instaIcon} alt='instagram icon'/>
                </Link>
                <Link href="https://www.instagram.com/drawlys_deco/">
                  <Image className="utility-bar--icons z-50" width={76} height={76} src={tiktokIcon} alt='tiktok icon'/>
                </Link>
            </div>
            <h5>
              الخيار الأفضل  / the best choice
            </h5>
            <span>!</span>

        </div>
    </div>
    <header>
        <Image onClick={handleSideToggel} src={burger} alt='' width={25} height={20} className="burger-button" /> 
        <div>
          <div className="w-full">
            <div className='m-auto mb-4 max-w-20'>
              <Link href='/'>
               <Image src={logo} alt='Drawlys' className="header--logo" height={80} width={80} /> 
              </Link>
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
                  <Image className="utility-bar--icons" alt='' width={76} height={76} src={instaIcon} />                 
                </Link>
                <Link href="https://www.instagram.com/drawlys_deco/">
                  <Image className="utility-bar--icons" alt='' width={76} height={76} src={tiktokIcon} />
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