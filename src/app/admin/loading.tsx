import  Dashboard   from "../../components/Dashboard"

function loading() {
  typeof document !== 'undefined' && document.body.classList.add('bg-white')
  return (
    <div className="bg-white h-screen w-screen">
      <Dashboard />
    </div>
  )
}

export default loading