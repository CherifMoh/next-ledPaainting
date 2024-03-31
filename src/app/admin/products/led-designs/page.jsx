"use client"

import Link from 'next/link'
import axios from "axios";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


async function fetchDesigns() {
    try{
        const res = await axios.get('http://localhost:3000/api/products/ledDesigns');
        return res.data;
    }catch(err){
        console.log(err)
    }
}


function Page() {
    const router = useRouter()
    const queryClient = useQueryClient()
    
    const [deleting,setDeleting] = useState({
        id:'',
        state:false
    })
    
    const { data: designs, isLoading, isError } = useQuery({
        queryKey:['designs'],
        queryFn: fetchDesigns
    });

    const [search,setSearch] = useState('')

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error fetching designs</div>;

    const handleDelete = async (id)=>{
        try{
            setDeleting({
                id:id,
                state:true
            })
            const res = await axios.delete(`http://localhost:3000/api/products/ledDesigns/${id}`);       
            console.log(res.data);
            router.refresh()
            queryClient.invalidateQueries('designs');
        }catch(err){
            console.log(err)
        }
    }

    const productsElemnts = designs.map(design=>{
        if(
            search === ''||
            design.title.toLowerCase().includes(search.toLocaleLowerCase()) ||
            design.tags.includes(search)  
        ){
            return(
                <tr key={design._id} className='h-5 flex-none'>
                    <td className='w-24'>
                        <div>{design._id}</div>
                    </td>
                    <td className='w-24'>
                        <Image src={design.imageOn} width={96} height={96} alt="" />
                    </td>
                    <td>
                        {design.title}
                    </td>
                    <td>
                        <div className='capitalize'>
                            {design.tags}
                        </div>
                    </td>
                    <td>               
                        <Link href={`/admin/products/${design._id}`} className='bg-green-200 p-2 rounded-md'>Update</Link>                
                    </td>
                    <td>               
                        <button 
                        onClick={()=>handleDelete(design._id)} 
                        className='bg-red-400 p-2 rounded-md'
                        >
                            {deleting.state && deleting.id === design._id ?'Deleting':'Delete'}
                        </button>                
                    </td>
                </tr>
            )
        }
    })

    const tHeades =[
        {name:'ID'},
        {name:'Image'},
        {name:'Title'},
        {name:'Tags'},
        {name:'Update'},
        {name:'Delete'},
    ]

    const tHeadesElements=tHeades.map(tHead=>(
        <th key={tHead.name}>{tHead.name}</th>
    ))

  return (
    <div className='p-4 flex flex-col gap-5'>
        <Link 
         href={'/admin/products/led-designs/add'}
         className='bg-gray-700 p-3 rounded-md text-white text-center'
        >
            Add
        </Link>

        <div className='flex gap-4'>
            <div className='relative'>
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass}
                    className={`absolute left-72 top-0 pt-3 z-10 ${search?'hidden':'opacity-50'}`}
                />
                <input 
                onChange={e=>setSearch(e.target.value)}
                type="search" 
                placeholder="Search"
                className='w-80 p-2 border-2 border-gray-500 rounded-xl no-focus-outline'
                />
            </div>
        </div>

        <table border='1' className='font-normal h-1'>
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
  )
}

export default Page