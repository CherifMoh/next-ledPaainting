'use client'
import Image from 'next/image'

import lines from '../../../public/assets/thankYou/lines.png'
import logoDown from '../../../public/assets/thankYou/logoDown.png'
import logoUP from '../../../public/assets/thankYou/logoUP.png'
import phone from '../../../public/assets/thankYou/phone.png'
import shareArrow from '../../../public/assets/thankYou/shareArrow.png'
import wave from '../../../public/assets/thankYou/wave.png'
import emailIcon from '../../../public/assets/thankYou/emailIcon.png'
import instagramIcon from '../../../public/assets/thankYou/instagram.png'
import phoneIcon from '../../../public/assets/thankYou/phoneIcon.png'

import { useEffect, useState } from 'react'
import Link from 'next/link'

function Thank() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set isVisible to true after a certain delay or any other condition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  const socialArray=[
    {icon:emailIcon,name:'drawlys@gmail.com',link:'mailto:'},
    {icon:phoneIcon,name:'055555555',link:'tel:+213'},
    {icon:instagramIcon,name:'drawlys_deco',link:'https://www.instagram.com/'},
  ]

  const socialElements =socialArray.map(social=>(
    <Link 
     href={social.link+social.name} 
     className='flex justify-center items-center w-1/4 hover:underline' 
     key={social.name}
    >
      <Image 
        src={social.icon} alt='' 
        width={400} height={300} 
        className='w-auto h-22 translate-x-12 mr-14'
      />
      <div 
       className='text-2xl'
       
      >
        {social.name}
      </div>
    </Link>
  ))

  return (
    <>
      <div className='flex overflow-hidden'>
        <Image
          src={lines}
          alt=''
          width={1080}
          height={500}
          className={`h-3/4 w-auto ${isVisible 
            ? 'opacity-100 transition duration-500 transform translate-y-0 translate-x-0' 
            : 'opacity-0 -translate-y-3/4 -translate-x-3/4'}
          `}
            />

        <Image 
        src={phone} alt='' 
        width={1080} height={500} 
        className={`h-3/4 w-auto -translate-x-12 ${isVisible 
          ? 'opacity-100 transition duration-500 transform translate-y-52 ' 
          : 'opacity-0 translate-y-[500px]'}
        `}
        />
        <Image 
        src={logoUP} alt='' 
        width={1080} height={500} 
        className={`h-3/4 w-auto ${isVisible 
          ? 'opacity-100 transition duration-500 transform translate-y-80 translate-x-0' 
          : 'opacity-0 translate-y-3/4 translate-x-1/4'}
        `}
        />

      </div>

      <div>
        <Image 
         src={wave} alt='' 
         width={1080} height={1920} 
         className='h-full w-full'
        />
      </div>

      <div className='flex-col w-full items-center h-screen'>

        <div className='flex w-full justify-between px-24'>
          <Image 
           src={logoDown} alt='' 
           width={400} height={300} 
           className='w-auto h-24 translate-x-12 translate-y-48'
          />

          <a 
           className='bg-white text-6xl py-12 px-6 rounded-full font-semibold flex items-center'
           style={{
            boxShadow:'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset'
           }}
           href={'http://localhost:3000/led-painting'}
          >
            تصفح منتجاتنا مجددا
          </a>

          <div className='text-center translate-y-28'>
            <Image 
            src={shareArrow} alt='' 
            width={400} height={300} 
            className='h-24 w-auto'
            />
            <p className='text-5xl leading-[60px]'>
              شارك الموقع مع
              <br />
              أصدقائك وعائلتك
            </p>
          </div>
        </div>

        <h1 className='w-full text-end text-5xl underline underline-offset-8 px-24 mt-80 font-semibold'>
          :
        تواصلوا معنا عبر
        
        </h1>

        <div className='flex justify-between items-center mt-12 px-24'>
           {socialElements}
        </div>
      </div>
    </>
  )
}

export default Thank