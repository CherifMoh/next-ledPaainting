import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import arrowDown from '../../../../public/assets/arrow-down.svg'
import Image from "next/image";


const fetchProductsParts = async () => {
    const res = await axios.get(`/api/products/parts`);
    if(!res.data) return []
    return res.data;
}


function Parts() {

    const { data: Products, isLoading: IsLoading, isError: IsError, error: Error } = useQuery({
        queryKey: ['parts'],
        queryFn: fetchProductsParts
    });

    const [isProducts, setIsProducts] = useState(false);
    const [isParts, setIsParts] = useState([]);

    if(IsLoading) return <div>Loading...</div>;
    if(IsError) return <div>Error: {Error.message}</div>;

    function togelParts(id){
        setIsParts(pre=>{
            return pre.includes(id) ? pre.filter(item=>item!==id) : [...pre, id]
        })
    }

    const ProductsElement = Products.map(product=>{
        const PartsElement = product.parts.map(part=>{       
            if(!part) return
            return (
                <div 
                    className="px-2 w-max py-1 flex items-center justify-center flex-col gap-2 rounded-md border border-black"
                    key={part.name}
                >
                        {part.name}
                </div>
            )
        })
        return (
            <div 
                className="px-2 w-max py-1 flex items-center justify-center flex-col gap-2 rounded-md border border-black"
                key={product._id}
            >
                    <div 
                        className="flex justify-center items-center gap-1"
                        onClick={()=>togelParts(product._id)}
                    >
                        {product.title}
                        <Image 
                            src={arrowDown} alt="" 
                            className={`${isParts.includes(product._id) ? 'rotate-180' :'pt-4'}`}
                        />
                    </div>
                    {isParts.includes(product._id) && PartsElement}
            </div>
        )
    })

    const PartsElement = Products.map(product=>{
        
    })

  return (
    <div> 
        <button
            className="px-8 py-3 rounded-md border border-black"
            onClick={()=>setIsProducts(pre=>!pre)}
        >
            ورشة
        </button>
        <div className="flex flex-col items-center gap-2 mt-4">
            {isProducts &&
                ProductsElement
            }
        </div>
    </div>
  )
}

export default Parts