
import '../styles/pages/index.css'
import  ProductsGrid  from "../components/ProductsGrid"
import  ProductGSkeleton  from "../components/loadings/ProductGSkeleton"
import { Suspense } from 'react'
import Header from '../components/main/Header'
// import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import Cart from '../components/shared/Cart'
import ImageSlider from '../components/main/ImageSlider'
import Image from 'next/image'

import mainBg from '../../public/assets/oldlogo.jpg'
import axios from 'axios'



async function Home() {

  let images = []
  try{
    const res = await axios.get('/api/products/ledDesigns/images');
    images = res.data.map(design=>design.imageOn)
  }catch(err){
    console.log(err)
  }

  return (
    <>
    <Header />
      <main className='relative w-full h-auto py-5 overflow-hidden mb-2'>
        <Image 
          src={mainBg} alt=''
          width={2000} height={2000}
          className='h-auto w-full opacity-40 absolute -top-10 right-0 -z-20'
        />
        <h1
          className='text-3xl font-bold text-center mb-4'
        >
          Drawlys
          مرحبا بيك عندنا في
          
        </h1>
        <ImageSlider images={images} />
      </main>
      <section>
      <h1
          className='text-3xl font-bold text-center mb-4'
        >
         اكتشف كل منتجاتنا
          
        </h1>
      </section>
    <Cart />
    <Footer /> 
    </>
  )
}

export default Home