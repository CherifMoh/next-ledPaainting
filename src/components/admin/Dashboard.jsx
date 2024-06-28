'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { faTag, faBoxesStacked, faWarehouse, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie';
import { jwtVerify } from 'jose'






function Dashboard() {

  const [cookieValue, setCookieValue] = useState('');


  useEffect(() => {
    const getCookieValue = async () => {
      const token = Cookies.get('access-token');
      if (token) {
        try {
          const decoded = await decodeToken(token);
          setCookieValue(JSON.stringify(decoded));
        } catch (error) {
          setCookieValue('Invalid token');
        }
      } else {
        setCookieValue('Cookie not found');
      }
    };

    getCookieValue();
  }, []);

  

  const AdminLinks = [
    { 
      name: 'Orders', 
      icon:faBoxesStacked,
      href: '/admin/orders' 
    },
    { 
      name: 'Products', 
      icon:faTag, 
      href: '/admin/products' 
    },
    { 
      name: 'Users', 
      icon:faUsers,
      href: '/admin/users' 
    },
    { 
      name: 'Storage', 
      icon:faWarehouse,
      href: '/admin/storage' 
    },
    // { name: 'Category', href: '/admin/categoreis' },
  ]

  typeof document !== 'undefined' && document.body.classList.add('bg-white')

  const pathName = usePathname()
  const AdminLinksElemnts = AdminLinks.map(link => {
    const isActive = pathName.startsWith(link.href)
    return (
      <Link
        href={link.href}
        className={`h-10 flex items-center gap-4 hover:bg-gray-300 p-4 ${isActive && 'bg-gray-300'}`}
        key={link.name}
      >
        <span>
          <FontAwesomeIcon icon={link.icon}/>
        </span>
        <span>{link.name}</span>
      </Link>)
  })

  return (
    <div className='w-48 md:w-72 h-screen bg-gray-100 pt-5 mr-5 z-[9999999] fixed left-0 overflow-y-auto'>
      <Link
        href='/admin/dashboard'
        className='text-3xl font-extrabold text-center block mb-10'
      >
        Dashboard
      </Link>   

      {AdminLinksElemnts}


    </div>
  )
}

export default Dashboard