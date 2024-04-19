import  Dashboard   from "../../components/admin/Dashboard"

function Loading() {
  typeof document !== 'undefined' && document.body.classList.add('bg-white')
  return (
    <div className="bg-white h-screen w-screen">
      <Dashboard />
    </div>
  )
}

export default Loading