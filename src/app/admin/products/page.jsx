"use client"

import Link from 'next/link'
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {deleteProduct} from '../../actions/product'
import { useState } from 'react';
import Spinner from '../../../components/loadings/Spinner';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faCircleInfo, faPen } from '@fortawesome/free-solid-svg-icons';

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
                        <Link href={`/admin/products/${product._id}`} className=' p-2 rounded-md'>
                            <FontAwesomeIcon  icon={faPen} />
                        </Link>
                        {deleting.some(item => item.id === product._id && item.state)
                        ?<Spinner size={'h-8 w-8'} color={'border-red-500'} />
                        :<button 
                         className=' p-2 rounded-md'
                         onClick={()=>handleDelete(product._id)}
                        >
                            <FontAwesomeIcon  icon={faTrashCan} />
                        </button>
                        }
                    </div>
                    :<div className='flex gap-3'>
                        <Link href={`/admin/products/${product._id}`} className=' p-2 rounded-md'>
                            <FontAwesomeIcon  icon={faPen} />
                        </Link>
                        {deleting.some(item => item.id === product._id && item.state)
                        ?<Spinner size={'h-8 w-8'} color={'border-red-500'} />
                        :<button 
                         className=' p-2 rounded-md'
                         onClick={()=>handleDelete(product._id)}
                        >
                            <FontAwesomeIcon  icon={faTrashCan} />
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
            <Link className='bg-gray-700 p-3 rounded-md text-white' href={'/admin/products/add'}>Add a product</Link>
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