"use client"

import axios from "axios";
import Link from "next/link";
import ProductGSkeleton from './ProductGSkeleton'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


const fetchTags = async()=>{
    const res = await axios.get('http://localhost:3000/api/products/tags');
    return res.data;
}

async function fetchProducts() {
    const res = await axios.get('http://localhost:3000/api/products/ledDesigns');
    return res.data;
}

function ProductsGrid() {

    const { data: Tags, isLoading:tagsloading, isError:tagsError , error:tagErr} = useQuery({
        queryKey:['tags'],
        queryFn: fetchTags
    });

    const { data: Designs, isLoading, isError, error:designErr } = useQuery({
        queryKey:['products'],
        queryFn: fetchProducts
    });

    const [selectedTag,setSelectedTag] = useState('all')

    const [search,setSearch] = useState('')

    if (isLoading) return <ProductGSkeleton />;

    if (isError) return <div>Error: {designErr}</div>;

    if (tagsloading) return <ProductGSkeleton />;

    if (tagsError) return <div>Error: {tagErr}</div>;

    const productsElemnts = Designs.map(design => {
        if(design.tags.includes(selectedTag) ||selectedTag=== 'all' ){
            if(design.title.toLowerCase().includes(search.toLocaleLowerCase() ) ||search === '' ){

                return(
                    <Link key={design._id} className="product-card" href={`/led-painting/${design._id}`}>
                    <div className="product-img-container">
                    <Image alt="" src={`${design.imageOn}`} width={20} height={20} className="product-img product-img-on" />
                    <Image alt="" src={`${design.imageOff}`} width={20} height={20} className="product-img product-img2 product-img-off" />
                    </div>
                    <div className="card-info">
                    <span className="product-title">{design.title}</span>
                    {/* <span className="product-price">from ${design.price}</span> */}
                    <span className="sale-product-price">{design.price} DA</span>
                    </div>
                    </Link>
                )
            }
        }
    })

    
    
    const filterElement = Tags.map (tag=>(
        <div 
         key={tag.name}
         className={` 
          ${selectedTag ===tag.name
            ?'bg-white text-black font-semibold'
            : 'bg-gray-900 text-white hover:bg-gray-700'}
          cursor-pointer px-4 py-1 rounded-xl capitalize ml-4`}
         onClick={()=>setSelectedTag(tag.name)}
        >
            {tag.name
        }</div>
    ))

    return (
        <div>
            <div className="flex items-center justify-between relative">

                <div className="flex my-8 relative">
                    <div 
                        className={` 
                        ${selectedTag ==='all'
                        ?'bg-white text-black font-semibold'
                        : 'bg-gray-900 text-white hover:bg-gray-700'}
                        px-4 py-1 rounded-xl cursor-pointer`}
                        onClick={()=>setSelectedTag('all')}
                        >
                            All
                        </div>
                        {filterElement}
                    </div>
                <div>
                    <FontAwesomeIcon 
                     icon={faMagnifyingGlass}
                     className={`pt-2 pointer-events-none z-10 absolute right-2 ${search?'hidden':'opacity-50'}`}
                    />
                    <input 
                     id="search"
                     type='search' 
                     className='w-64 px-2 py-1 rounded-xl border-2 border-gray-500 no-focus-outline text-black bg-stone-200' 
                     placeholder={`Search`}
                     onChange={(e)=>setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="product-grid">
                {productsElemnts}
            </div>
        </div>
    );
}

export default ProductsGrid;
