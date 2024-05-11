import logo from '../../../public/assets/phoneLogo.png'
import burger from '../../../public/assets/burger.png'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'


function Header() {
  return (
    <div className='bg-[#f5f5f5] flex justify-between items-center px-4 w-full h-24'>

      <div className='md:w-40 flex items-center justify-center'>
        <Image 
          src={burger} alt=''
          width={80} height={80}
          className='h-6 w-auto'
          />
      </div>

      <div className='md:w-40 flex items-center justify-center'>`
        <Link href={'/'}>
          <Image 
            src={logo} alt=''
            width={80} height={80}
            className='h-14 w-auto'
            />
        </Link>
      </div>

      <div className='relative'>
        <FontAwesomeIcon 
         icon={faMagnifyingGlass}
         className='md:absolute right-2 top-1 h-4 w-4'  
        />
        <input 
         type='search'
         className='hidden md:block border border-black rounded-full' 
        />
      </div>
      
    </div>
  )
}

export default Header