'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { faTag, faBoxesStacked, faWarehouse, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import defultPfp from '../../../public/assets/pfp defult.png'
import { editeUserPfp } from '../../app/actions/users'
import Link from 'next/link';

const fetchUserEmail = async (email) => {
    const res = await axios.get(`/api/users/email/${email}`);
     if(res.data){
      return res.data
     }
     return []
  }

function UserProfile({userEmail}) {

    const [selectedImage, setSelectedImage] = useState('');
  
    const [User, setUser] = useState('');
    
    const [filebig, setFilebig] = useState(false);
  
    const { data: User1, isLoading, isError, error } = useQuery({
      queryKey: ['user by email', userEmail],
      queryFn: ({ queryKey }) => fetchUserEmail(queryKey[1]),
      enabled: !!userEmail,
    });
  
  
    useEffect(() => {
      if(User1){
        setUser(User1)
      } 
    }, [User1]);
  
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathName = usePathname()

    typeof document !== 'undefined' && document.body.classList.add('bg-white')
  
    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>{error.message}</div>

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

    function checkFileSize(file, input) {
        if (file) {
            const fileSize = file.size; // in bytes
            const maxSize = 12 * 1024 * 1024; // 12MB in bytes
            if (fileSize > maxSize) {
                alert('File size exceeds the limit. Please select a smaller file.');
                input.value = ''
                return false;
            }
            return true;
        }
    }
    
    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (err) => {
                reject(err);
            };
        });
    }
    
    
    async function changePfp(e) {
        const file = e.target.files[0];
        if (!file) {
          setSelectedImage('')
          return e.target.value = ''
        }
        
        if (!checkFileSize(file, e.target)){
          setSelectedImage('' )
          setFilebig(true)
          return 
        }
    
        const base64 = await convertToBase64(file);
        try{
          setSelectedImage(base64)
          editeUserPfp(userEmail, base64)
          queryClient.invalidateQueries(['user by email', userEmail])
          router.refresh()
    
        }catch(error){
          console.log(error)
        }
        
    }
  
  return (
    <>
        <div className='flex flex-col justify-center items-center mb-16'>
            <div className='relative'>
            <input
                type="file"
                className='opacity-0 size-full absolute'
                id="pfp"
                onChange={changePfp}
            />
            <Image 
                src={selectedImage ||User?.pfp || defultPfp} alt='pfp'
                width={150} height={150}
            />
            </div>
            <div
            className='text-blue-600 font-semibold'
            >
            {User?.role}
            </div>
            <div className='capitalize'>{User?.name}</div>
        </div>
        {AdminLinksElemnts}
    </>
  )
}

export default UserProfile