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

 

function Storage() {

    const accessibilities = useSelector((state) => state.accessibilities.accessibilities)

    const router = useRouter()

    useEffect(()=>{
        if(accessibilities.length === 0)return
        const access = accessibilities.find(item=>item.name === 'storage')
        if(!access || access.accessibilities.length === 0){
            router.push('/admin')
        }
    },[accessibilities])

    
    return (
        <main className='p-4'>
            <header
                className='flex justify-evenly'
            >
            <Link
                href={'/admin/storage/rew-mates'}
                className="text-lg hover:text-purple-800 font-medium underline"
            >
                مواد أولية
            </Link>
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
                <ProductsComp/>
                <PartsComp />
                <RewMatesComp />
            </div>
        </main>
    )
}

export default Storage