'use client'


import '../../styles/pages/index.css'
import ImageSlider from './ImageSlider'
import Image from 'next/image'

import mainBg from '../../../public/assets/oldlogo.jpg'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'



async function ProductsSlider() {

    async function fetchProducts() {
        try {
            const res = await axios.get('/api/products');
            return res.data;
        } catch (err) {
            // console.log('*********************** Error *****************************')
            console.log(err.message)
        }
    }

    const { data: Products, isLoading, isError, error: designErr } = useQuery({
        queryKey: ['Products images'],
        queryFn: fetchProducts
    });

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>{designErr.message}</div>

    const slidersElemnt = Products.map(product => {
        return (
            <div key={product._id} className='md:mt-48 mt-28 gap-4 flex flex-col items-center justify-center'>
                <h1
                    className='md:text-5xl text-3xl font-bold text-center capitalize'
                >
                    {product.title}

                </h1>
                <ImageSlider images={product.gallery} />
                <a
                    href={product.title === 'Led Painting' ? '/led-painting' : product._id}
                    className='bg-[#4B3724] text-white text-lg md:text-3xl px-6 py-2 rounded-full'
                >
                    المزيد
                </a>
            </div>
        )

    })



    return (
        <>
            {slidersElemnt}
        </>
    )
}

export default ProductsSlider