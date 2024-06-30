import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function page() {
  return (
    <main className="p-4">
        <div className='flex justify-between items-center p-4 '>
            <div>
                <h1 className='text-3xl font-semibold'>
                    Add a Role
                </h1>
                <h4 className='text-sm'>
                    creat a new role and it&apos;s accessibility                   
                </h4>
            </div>
            <div>
                <button className="rounded text-gray-400 border border-gray-400 px-6 py-2 mr-6">
                    Reset                    
                </button>
                <button className="rounded border border-green-600 bg-green-600 text-white px-20 py-2">
                    Save
                </button>
            </div>
        </div>
        <div className="m-4 p-8 bg-slate-50 shadow-md flex justify-between gap-12">
            <div className="flex flex-col flex-grow">
                <label 
                    htmlFor="title"
                    className="self-start mb-2 font-bold tracking-wider"
                >
                    Name
                </label>
                <input 
                    type="text" 
                    id="title" 
                    name="title"
                    placeholder="Name of the role"
                    className="w-full border border-gray-400 px-4 py-2 bg-transparent rounded"
                />
            </div>
            <div className="flex flex-col flex-grow">
                <label 
                    htmlFor="description"
                    className="self-start mb-2 font-bold tracking-wider"
                >
                    Description
                </label>
                <input 
                    type="text" 
                    id="description" 
                    name="description"
                    placeholder="Description"
                    className="w-full border border-gray-400 px-4 py-2 bg-transparent rounded"
                />
            </div>
        </div>
        <div className="m-4 bg-slate-50 shadow-md flex justify-between gap-12">
          <div className="flex justify-between w-full">
            <div className="w-1/4 text-center bg-slate-200 py-6 font-semibold">Orders</div>
            <div className="w-1/4 text-center bg-slate-50 border-t-4 border-blue-500 py-6 font-semibold">Products</div>
            <div className="w-1/4 text-center bg-slate-200 py-6 font-semibold">Users</div>
            <div className="w-1/4 text-center bg-slate-200 py-6 font-semibold">Storage</div>
          </div>
        </div>
    </main>
  )
}

export default page