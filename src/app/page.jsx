
import '../styles/pages/index.css'
import  ProductsGrid  from "../components/ProductsGrid"
import  ProductGSkeleton  from "../components/loadings/ProductGSkeleton"
import { Suspense } from 'react'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import Cart from '../components/shared/Cart'


function Home() {
  return (
    <>
    <Header />
      <main className="main">
        <div className="main-container">
          <h1 className="text-4xl text-[#1a2332] font-bold mb-5">
            Luminous Frames
          </h1>            
          <ProductsGrid />   
        </div>
      </main>
    <Cart />
    <Footer /> 
    </>
  )
}

export default Home