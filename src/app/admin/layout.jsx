import Dashboard from "../../components/admin/dashboard/Dashboard"


export default function Layout({ children }) {
  return (
    <div className='md:pl-72 pl-48 bg-white'>
      <Dashboard />
      {children}
    </div>

  )
}