"use client"

import axios from "axios";
import Link from "next/link";
import ProductGSkeleton from './ProductGSkeleton'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";


const fetchTags = async()=>{
    const res = await axios.get('http://localhost:3000/api/products/tags');
    return res.data;
}

async function fetchProducts() {
    const res = await axios.get('http://localhost:3000/api/products/ledDesigns');
    return res.data;
}

function ProductsGrid() {

    const { data: Tags, isLoading:tagsloading, isError:tagsError , error} = useQuery({
        queryKey:['tags'],
        queryFn: fetchTags
    });

    const { data: Designs, isLoading, isError } = useQuery({
        queryKey:['products'],
        queryFn: fetchProducts
    });

    const [selectedTag,setSelectedTag] = useState('all')

    if (isLoading) return <ProductGSkeleton />;

    if (isError) return <div>Error fetching Designs</div>;

    if (tagsloading) return <ProductGSkeleton />;

    if (tagsError) return <div>Error fetching Designs</div>;

    const productsElemnts = Designs.map(design => {
        if(design.tags.includes(selectedTag) ||selectedTag=== 'all' ){
            return(
                <Link key={design._id} className="product-card" href={`/led-painting/${design._id}`}>
                <div className="product-img-container">
                <img src={`${design.imageOn}`} className="product-img product-img-on" />
                <img src={`${design.imageOff}`} className="product-img product-img2 product-img-off" />
                </div>
                <div className="card-info">
                <span className="product-title">{design.title}</span>
                {/* <span className="product-price">from ${design.price}</span> */}
                <span className="sale-product-price">{design.price} DA</span>
                </div>
                </Link>
            )
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
            <div className="flex my-8">
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
            <div className="product-grid">
                {productsElemnts}
            </div>
        </div>
    );
}

export default ProductsGrid;
