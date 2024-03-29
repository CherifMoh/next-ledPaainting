'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


function Dashboard() {

  const AdminLinks =[
    {name:'Orders',href:'/admin/orders'},
    {name:'Products',href:'/admin/products'},
    {name:'Users',href:'/admin/creatUser'},
    {name:'Category',href:'/admin/categoreis'},
  ]

  typeof document !== 'undefined' && document.body.classList.add('bg-white')

  const pathName = usePathname()
  const AdminLinksElemnts = AdminLinks.map(link=>{
    const isActive = pathName.startsWith(link.href)
    return(
    <Link 
     href={link.href} 
     className={`h-10 flex items-center hover:bg-gray-300 p-4 ${isActive && 'bg-gray-400'}`}
     key={link.name}
    >
      <span  className=''>{link.name}</span>
    </Link>)
  })

  return (
    <div className='h-screen w-72 bg-gray-100 pt-5 mr-5 absolute left-0'>
        <Link 
         href='/admin' 
         className='font-semibold text-3xl text-center block mb-10'
        >
          Dashboard
        </Link>

        {AdminLinksElemnts}
      
        
    </div>
  )
}

export default Dashboard