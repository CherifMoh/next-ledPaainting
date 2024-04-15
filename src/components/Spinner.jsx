
function Spinner({ color, size }) {

  return (
    <div className="flex">
        <div className="relative">
            <div
             className={`${size} rounded-full absolute border-4 
              border-solid border-gray-200`}
             >
            </div>
            <div 
             className={`${size} rounded-full animate-spin absolute
               border-4 border-solid ${color} border-t-transparent`}
             >
            </div>
        </div>
    </div>
  )
}

export default Spinner