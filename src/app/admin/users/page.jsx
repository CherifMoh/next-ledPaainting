'use client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';

async function fetchUsers() {
  const res = await axios.get('/api/users');
  return res.data;
}

function User() {

  const { data: users, isLoading, isError } = useQuery({
    queryKey:['users'],
    queryFn: fetchUsers
  });
  
  const [nav , setNav] = useState('users')

  if(isLoading) return <div>Loading ...</div>

  const headsArray=[
    'User Name',
    'E-mail',
    'Role',
    'Actions',
  ]
  
  const headsElement = headsArray.map(title=>{
    return(
      <td 
        key={title} 
        className='border-0 border-r border-r-[#e8edeb] text-sm p-1'
      >
        {title}
      </td>
    )
  })

  console.log(users)

  const usersElements = users?.map(user=>{
    return(
      <tr 
       className='border-b border-y-[#e8edeb] border-0'
       key={user._id}
      >
        <td className='border-0'>{user.name}</td>
        <td className='border-0'>{user.email}</td>
        <td className='border-0'>{user.role}</td>
      </tr>
    )
  })

  return (
    <section className='p-4'> 

        <header 
          className='mt-20 border-b-4 flex px-4 border-b-[#e8edeb] relative'
        >
            <div
              className={`py-2 px-6 font-semibold text-base cursor-pointer ${nav==='custom' && 'opacity-30'}`} 
              onClick={()=>setNav('users')} 
            >
                Admin Users
            </div> 
            <div
              className={`py-2 px-6 font-semibold text-base cursor-pointer ${nav==='users' && 'opacity-30'}`}
              onClick={()=>setNav('custom')} 
            >
                Custom Roles
            </div> 
            <div 
              className={`bg-gray-400 inline-block transition-all duration-1000 w-36 h-1 absolute -bottom-1 
              ${nav==='custom' && 'left-40'}`}
            ></div>
        </header>

       

        {nav==='users'? 
        <>
          <div className='flex justify-end p-4'>
            <Link 
             className='bg-gray-400 rounded-lg text-white text-sm px-2 py-1'
             href={'/admin/users/creatUser'}
            >
              <span className='mr-2 font-bold text-base'>+</span>
              Add New Admin User
            </Link>
          </div>
          <table className='w-full'>
          <thead>
            <tr className='border-y-2 border-y-[#e8edeb] border-x-0'>
              {headsElement}
            </tr>
          </thead>
          <tbody>
            {usersElements}
          </tbody>
          </table>
        </>
        :''}
    </section>
  )
  
}

export default User