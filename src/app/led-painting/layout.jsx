import  Header  from "../../components/Header"
import  Footer  from "../../components/Footer"
import dynamic from 'next/dynamic'

const Cart = dynamic(()=>import('../../components/Cart'),{
  ssr: false,
  loading:()=><p>Loading...</p>
})


export const metadata = {
  title: 'Led Painting',
}
  
export default function Layout({ children }) {
  return (
      <>
        <Header />
            {children} 
            <Cart />
            
        <Footer /> 
      </>
      
  )
}