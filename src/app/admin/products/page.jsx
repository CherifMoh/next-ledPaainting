"use client"

import Link from 'next/link'
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {deleteProduct} from '../../actions/product'
import { useEffect, useState } from 'react';
import Spinner from '../../../components/loadings/Spinner';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faCircleInfo, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

async function fetchProducts() {
    const res = await axios.get('/api/products');
    return res.data;
}

function Page() {

    const { data: products, isLoading, isError } = useQuery({
        queryKey:['products'],
        queryFn: fetchProducts
    });

    const [deleting,setDeleting] = useState([])

    const [isCreateAccess, setIsCreateAccess] = useState(false)
    const [isUpdateAccess, setIsUpdateAccess] = useState(false)
    const [isDeleteAccess, setIsDeleteAccess] = useState(false)

    const accessibilities = useSelector((state) => state.accessibilities.accessibilities)

    const router = useRouter()

    useEffect(()=>{
        if(accessibilities.length === 0)return
        const access = accessibilities.find(item=>item.name === 'products')
        if(!access || access.accessibilities.length === 0){
            router.push('/admin')
        }
        setIsDeleteAccess(access.accessibilities.includes('delete'))
        setIsUpdateAccess(access.accessibilities.includes('update'))
        setIsCreateAccess(access.accessibilities.includes('create'))
    },[accessibilities])

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching products</div>;

   

    function handleDelete (id){
        setDeleting(pre=>([...pre,{
            id:id,
            state:true
        }]))
        deleteProduct(id)
    }

    const productsElemnts = products.map(product=>(
        <tr key={product._id} className='h-5 flex-none'>
            <td className='w-24'>
                <div>{product._id}</div>
            </td>
            <td className='w-24'>
                <Image src={product.imageOn} width={96} height={96} alt="" />
            </td>
            <td>{product.title}</td>
            <td>{product.price}</td>
            <td>
                {
                    product.title === 'Led Painting' 
                    ?
                    <div className='flex gap-3'>
                        <Link href={`/admin/products/led-designs`} className='p-2 rounded-md'>
                            <FontAwesomeIcon  icon={faCircleInfo} />
                        </Link>
                        {isUpdateAccess &&
                            <Link href={`/admin/products/${product._id}`} className=' p-2 rounded-md'>
                                <FontAwesomeIcon  icon={faPen} />
                            </Link>
                        }
                        {isDeleteAccess && deleting.some(item => item.id === order._id && item.state) &&
                            <Spinner size={'h-8 w-8'} color={'border-red-500'} />
                        }  
                        {isDeleteAccess && !deleting.some(item => item.id === order._id && item.state) &&
                            <button
                                className=' p-2 rounded-md'
                                onClick={() => handleDelete(order._id)}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>                            
                        }  
                        
                    </div>
                    :<div className='flex gap-3'>
                       {isUpdateAccess &&
                            <Link href={`/admin/products/${product._id}`} className=' p-2 rounded-md'>
                                <FontAwesomeIcon  icon={faPen} />
                            </Link>
                        }
                        {isDeleteAccess && deleting.some(item => item.id === order._id && item.state) &&
                            <Spinner size={'h-8 w-8'} color={'border-red-500'} />
                        }  
                        {isDeleteAccess && !deleting.some(item => item.id === order._id && item.state) &&
                            <button
                                className=' p-2 rounded-md'
                                onClick={() => handleDelete(order._id)}
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>                            
                        }  
                    </div>
                }
            </td>
        </tr>
    ))

    const tHeades =[
        {name:'ID'},
        {name:'Image'},
        {name:'Title'},
        {name:'Price'},
        {name:'Actions'},
    ]

    const tHeadesElements=tHeades.map(tHead=>(
        <th key={tHead.name}>{tHead.name}</th>
    ))

  return (
    <div>
        <div className='flex items-center justify-around p-20 pt-14'>
            {isCreateAccess &&
                <Link
                    className='justify-self-end  whitespace-nowrap border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer'
                    href={'/admin/products/add'}
                    >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ml-2 whitespace-nowrap">Add a new product</span>
                </Link>
            }
        </div>
        <div className='flex items-center justify-center w-full'>
            <table border='1' className='font-normal h-1 w-full'>
                <thead>
                    <tr>
                        {tHeadesElements}
                    </tr>
                </thead>
                <tbody>
                {productsElemnts}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Page