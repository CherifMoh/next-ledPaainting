import dynamic from 'next/dynamic'

const Cart = dynamic(()=>import('../../components/Cart'),{
  ssr: false,
  loading:()=><p>Loding...</p>
})


export const metadata = {
  title: 'Led Painting',
}
  
export default function Layout({ children }) {
  return (
      <>
            {children} 
            <Cart />
      </>
      
  )
}