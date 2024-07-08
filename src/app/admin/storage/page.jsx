'use client'

import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link"
import { useEffect, useState } from "react";

import RewMatesComp from '../../../components/admin/storage/RewMates'
import PartsComp from '../../../components/admin/storage/Parts'
import ProductsComp from '../../../components/admin/storage/Products'
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { unstable_noStore as noStore} from "next/cache";


const fetchRewMates = async () => {
    noStore()
    const res = await axios.get(`/api/storage/rewMates`);
    if(!res.data) return []
    return res.data;
}

const fetchPartByName = async (name) => {
    noStore()
    const response = await fetch(`/api/storage/workshop/${name}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('An error occurred while fetching the data.');
    }
    return response.json();
}

const fetchParts = async () => {
    noStore()
    const res = await axios.get(`/api/storage/workshop`);
    if(!res.data) return []
    return res.data;
}



const fetchProductsParts = async () => {
    const res = await axios.get(`/api/products/parts`);
    if(!res.data) return []
    return res.data;
}

const fetchProductByName = async (title) => {
    const res = await axios.get(`/api/storage/products/${title}`);
    if(!res.data[0]) return []
    return res.data[0]
}



function Storage() {


    const [isCreateAccess, setIsCreateAccess] = useState(false)
    const [isUpdateAccess, setIsUpdateAccess] = useState(false)
    const [isDeleteAccess, setIsDeleteAccess] = useState(false)

    const accessibilities = useSelector((state) => state.accessibilities.accessibilities)

    const router = useRouter()

    useEffect(()=>{
        if(accessibilities.length === 0)return
        const access = accessibilities.find(item=>item.name === 'storage')
        if(!access || access.accessibilities.length === 0){
            router.push('/admin')
        }
        setIsDeleteAccess(access.accessibilities.includes('delete'))
        setIsUpdateAccess(access.accessibilities.includes('update'))
        setIsCreateAccess(access.accessibilities.includes('create'))
    },[accessibilities])

    
    return (
        <main className='p-4'>
            <header
                className='flex justify-evenly'
            >
            {(isCreateAccess || isDeleteAccess) && ( 
                <Link
                    href={'/admin/storage/rew-mates'}
                    className="text-lg hover:text-purple-800 font-medium underline"
                    >
                    مواد أولية
                </Link>
            )}
            <Link
                href={'/admin/storage/archive'}
                className="text-lg hover:text-purple-800 font-medium underline"
            >
                أرشيف
            </Link>
            </header>

            <div className="flex justify-center mt-5">
                <button 
                    className='text-3xl font-semibold rounded shadow-md bg-green-300 px-12 py-5 border-black'
                    >
                    أدخل
                </button>
            </div>

            <div 
                className="m-auto text-xl w-[800px] flex justify-between items-start mt-10 "
            >
                <ProductsComp 
                    isUpdateAccess={isUpdateAccess}
                    fetchProductByName={fetchProductByName}
                    fetchProductsParts={fetchProductsParts}
                    fetchParts={fetchParts}
                    />
                <PartsComp 
                    isUpdateAccess={isUpdateAccess}
                    fetchProductsParts={fetchProductsParts}
                    fetchParts={fetchParts}
                    fetchRewMates={fetchRewMates}
                    fetchPartByName={fetchPartByName}
                />
                <RewMatesComp isUpdateAccess={isUpdateAccess}/>
            </div>
        </main>
    )
}

export default Storage