import  Dashboard   from "../../components/Dashboard"

  
export default function Layout({ children }) {
  return (
      <div className='pl-72 bg-white'>
        <Dashboard />
            {children} 
      </div>
      
  )
}