
import '../../styles/pages/index.css'
import  ProductsGrid  from "../../components/ProductsGrid"
import { Suspense } from 'react'


function Home() {
  return (
    <>
    <main className="main">
      <div className="main-container">
        <h1 className="text-4xl font-bold mt-5 mb-5">
          Luminous Frames
        </h1>            
        <ProductsGrid />        
      </div>
    </main>
    </>
  )
}

export default Home