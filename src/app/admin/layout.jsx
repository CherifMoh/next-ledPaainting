import  Dashboard   from "../../components/admin/Dashboard"

  
export default function Layout({ children }) {
  return (
      <div className='pl-72 bg-white'>
        <Dashboard />
        {children} 
      </div>
      
  )
}