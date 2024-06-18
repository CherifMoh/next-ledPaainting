import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import arrowDown from '../../../../public/assets/arrow-down.svg'
import Image from "next/image";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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
    const [isDetails, setIsDetails] = useState(false);

    const [EditedPart, setEditedPart] = useState();

    const [qnt, setQnt] = useState(1);



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
                    className='relative  cursor-pointer' 
                    key={part.name}
                    onClick={()=>{setEditedPart(part)}}
                >
                    <div class="line-before"></div>

                    <div 
                        className="px-2 relative w-max py-1 flex items-center justify-center flex-col gap-2 rounded-md border border-black"
                    >

                        {part.name}
                    </div>
                </div>
            )
        })
        return (
            <div className="flex flex-col items-center justify-center">
                <div 
                    className="px-2 w-max py-1 flex items-center justify-center flex-col gap-2 rounded-md border border-black"
                    key={product._id}
                >
                        <div 
                            className="flex justify-center items-center gap-1 cursor-pointer"
                            onClick={()=>togelParts(product._id)}
                        >
                            {product.title}
                            <Image 
                                src={arrowDown} alt="" 
                                className={`${isParts.includes(product._id) ? 'rotate-180' :'pt-4'}`}
                            />
                        </div>
                </div>
                {isParts.includes(product._id) && 
                <div className='border-r-2 border-black pr-4 mr-8 pt-2 flex flex-col items-end gap-1'>
                    {PartsElement}
                </div>
                }
            </div>
        )
    })

    const rewMtesElement = EditedPart?.mates.map(mate=>{
        return (

            <div 
                className='relative  cursor-pointer' 
                key={mate.name}
            >
                <div class="line-before"></div>

                <div 
                    className="px-2 relative w-max py-1 flex items-center justify-center flex-col gap-2 rounded-md border border-black"
                >
                    <div className="flex items-center justify-center gap-1">
                        <span>{qnt*mate.qnt}</span>
                        <span>{mate.name}</span>
                    </div>
                </div>
            </div>
        )
    })



  return (
    <div className="flex flex-col items-center"> 
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
            {EditedPart &&
            <div  
                className="bg-[#0000004f] md:p-48 p-80 z-[999] backdrop-filter backdrop-blur-md h-screen w-screen fixed top-0 right-0"
                // onClick={()=>setEditedPart()}
            >
                <div className="ml-auto w-3/4 p-4 bg-[#f5f5f5] flex flex-col items-center rounded-xl">
                    <div className="flex items-center justify-between w-full">
                        <span className='opacity-0'>.</span>
                        
                        <span className='text-2xl'>
                            {EditedPart.name}  
                        </span>
                        
                        <button 
                        className='bg-red-700 py-1 px-3 ml-2 rounded-full'
                        onClick={()=>{
                            setEditedPart()
                        }}
                    >
                        <FontAwesomeIcon icon={faX} className="text-white" />
                    </button>                    
                    </div>
                    <div className="flex items-start justify-around w-full">
                        <div className="shadow-sm p-1">
                            <table className='m-auto'>
                                    <thead>
                                        <th>كمية</th>
                                        <th>سعر</th>
                                        <th>total</th>
                                    </thead>
                                    <tbody>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="no-focus-outline bg-transparent w-full h-full"
                                                placeholder="كمية"
                                                onChange={(e)=>{
                                                    // handleRewMatesChange(Number(e.target.value)+Number(rewMate.qnt),rewMate)
                                                    // setQnt(e.target.value)
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="no-focus-outline bg-transparent w-full h-full"
                                                placeholder="سعر"
                                                // onClick={(e)=>setPrice(e.target.value)}
                                            />

                                        </td>
                                        {/* <td>{qnt&&price&&qnt*price}</td> */}
                                    </tbody>
                            </table>
                            <div className="flex items-center justify-center mt-4">
                                <button 
                                    className='bg-gray-900 w-48 rounded-lg pb-1 text-white'
                                    // onClick={()=>{
                                    //     submitRewMates(rewMate._id)
                                    //     setIsPlus(pre=>pre.filter(id=>id !== rewMate._id))
                                    //     setQnt()
                                    //     setPrice()
                                    // }}
                                >
                                    Save
                                </button>
                                
                            </div>                      
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="border border-black w-min p-1 cursor-pointer" onClick={()=>setIsDetails(pre=>!pre)}>
                                Details                           
                            </div>
                            {isDetails &&
                            <div className='border-r-2 border-black pr-4 mr-8 pt-2 flex flex-col items-end gap-1'>
                                {rewMtesElement}
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            }
        </div>
    </div>
  )
}

export default Parts