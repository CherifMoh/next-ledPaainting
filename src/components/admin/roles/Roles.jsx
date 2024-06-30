import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faTrashCan,faPen,faCopy } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

function Roles() {
  return (
    <section>
        <div className='flex justify-between items-center p-4'>
            <div>
                <h1 className='text-3xl font-semibold'>
                    Roles
                </h1>
                <h4 className='text-sm'>
                    List of roles                   
                </h4>
            </div>
            <div>
                <a
                className='bg-blue-500 text-white text-sm px-5 py-3'
                href={'/admin/users/addRole'}
                >
                <FontAwesomeIcon icon={faPlus} className='mr-2'/>
                    Add a new role
                </a>
            </div>
        </div>

        <div className='m-4 p-8 bg-slate-50 shadow-md'>
            <div className='flex justify-between items-center'>
                <div className='text-lg font-semibold'>
                    3 roles                    
                </div>
                <button
                    className='bg-gray-200 text-gray-300 font-semibold text-sm px-5 py-3'
                >
                    Delete
                </button>
            </div>
            <div className='mt-6 flex flex-col'>
                <div className='flex justify-between items-center border-b py-4 border-gray-100'>
                    <div className='flex gap-4'>
                        <input type="checkbox" name="" id="" />
                        Auther
                    </div>
                    <div>Auther can manege and publish posts</div>
                    <div>2 users</div>
                    <div className='flex gap-4'>
                        <FontAwesomeIcon icon={faCopy} className='mr-2'/>
                        <FontAwesomeIcon icon={faPen} className='mr-2'/>
                        <FontAwesomeIcon icon={faTrashCan} className='mr-2'/>
                    </div>
                </div>
                <div className='flex justify-between items-center border-b py-4 border-gray-100'>
                    <div className='flex gap-4'>
                        <input type="checkbox" name="" id="" />
                        Editor
                    </div>
                    <div>Editor can manege and publish contents</div>
                    <div>3 users</div>
                    <div className='flex gap-4'>
                        <FontAwesomeIcon icon={faCopy} className='mr-2'/>
                        <FontAwesomeIcon icon={faPen} className='mr-2'/>
                        <FontAwesomeIcon icon={faTrashCan} className='mr-2'/>
                    </div>
                </div>
                <div className='flex justify-between items-center border-b py-4 border-gray-100'>
                    <div className='flex gap-4'>
                        <input type="checkbox" name="" id="" />
                        Admin
                    </div>
                    <div>Admin can access and manege anything</div>
                    <div>1 users</div>
                    <div className='flex gap-4'>
                        <FontAwesomeIcon icon={faCopy} className='mr-2'/>
                        <FontAwesomeIcon icon={faPen} className='mr-2'/>
                        <FontAwesomeIcon icon={faTrashCan} className='mr-2'/>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Roles