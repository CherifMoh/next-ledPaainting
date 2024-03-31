'use client'

import '../../../../styles/pages/checkout.css'

import { useState } from 'react';
import {addOrder} from '../../../actions/order'
import {wilayat} from '../../../data/wilayat'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import Image from 'next/image';

async function fetchProducts() {
    const res = await axios.get('http://localhost:3000/api/products/ledDesigns');
    return res.data;
}


function Page() {
    const [formData, setFormData] = useState({});

    // Form validation States
    const [isShippingSelected, setIsShippingSelected] = useState(true);
    const [isWilayaSelected, setIsWilayaSelected] = useState(true);
    const [isPhoneCorrect, setIsPhoneCorrect] = useState(true);


    const [isdesigns, setIsdesigns] = useState(false);
    const [selectedImage, setSelectedImage] = useState(false);
    const [selectqnt, setSelectqnt] = useState('');

    const { data: Designs, isLoading, isError,error } = useQuery({
        queryKey:['AdminledDesigne'],
        queryFn: fetchProducts
    });

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error: {error.message}</div>;
    // Form Change Functions
    const handleChange =(e)=>{
        const value = e.target.value
        const name = e.target.name
        setFormData(preState=>({
            ...preState,
            [name]:value
        }))
    }
    const phonePattern = /^\d{10}$/;

    async function handelSubmit(e){
        e.preventDefault()

        if (!phonePattern.test(formData.phoneNumber)) return setIsPhoneCorrect(false)

        if(!formData.wilaya) return setIsWilayaSelected(false)
        
        if(!formData.shippingMethod) return setIsShippingSelected(false)

        const res = await axios.post(`http://localhost:3000/api/orders`,formData )

        console.log(res)
        
        localStorage.setItem('cart', [])
        
    }

    const wilayatOptionsElement = wilayat.map(wilaya=>(
        <option key={wilaya.name} value={wilaya.name}>{wilaya.name}</option>
    ))

    const designOptionsElent = Designs.map(design=>(
        <div key={design._id} className='border-gray-800 border-b-2 p-4 bg-white'>
            <Image 
             src={design.imageOn} 
             alt='' 
             width={128} height={128}  
             onClick={()=>{
                setSelectedImage(design.imageOn)
                setIsdesigns(false)
            }}
            /> 
        </div>
       
    ))

    let orderDesignsInputNumber = [0]

    
  return (
    <div className='p-4'>
        <div className='flex justify-around items-center'> 
            <div>
                {selectedImage 
                    ?<Image src={selectedImage} alt='' width={64} height={64}/>
                    :<div
                    onClick={()=>setIsdesigns(pre=>!pre)} 
                    className='border-2 border-gray-800 w-40 p-2'
                    >
                        Select Image
                    </div>
                }  
                {isdesigns && <div className='max-w-96 border-2 border-gray-800 absolute'>
                    {designOptionsElent}
                </div>}
            </div>          

            <input 
             type="number" 
             value={selectqnt} 
             className='m-0 w-24'
             onChange={(e)=>setSelectqnt(e.target.value)}
            />

            <button
             className=''
            >
                Add
            </button>
                
        </div>
    
        <form onSubmit={handelSubmit} className='mt-16'>
                        <input 
                        onChange={handleChange} 
                        required 
                        className="name"  
                        placeholder="Name" 
                        name="name" 
                        type="text" 
                        />

                        {!isPhoneCorrect && 
                            <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                                أدخل رقم هاتف صحيح 
                            </h1>
                        }

                        <input 
                        onChange={handleChange} 
                        required 
                        className="phone"  
                        placeholder="Phone" 
                        name="phoneNumber" 
                        type="text" 
                        />

                        {!isWilayaSelected && 
                            <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                                أدخل الولاية 
                            </h1>
                        }

                        <select  
                        value={formData.wilaya} 
                        onChange={handleChange} 
                        required className="wilaya"  
                        name="wilaya"  
                        >
                            <option value="الولاية" hidden >الولاية</option>
                            {wilayatOptionsElement}
                        </select>

                        <input 
                        onChange={handleChange} 
                        required 
                        className="baldia"  
                        placeholder="Adresse" 
                        name="adresse" 
                        type="text" 
                        />

                        {!isShippingSelected && 
                            <h1 className='flex justify-end text-red-600 font-semibold mb-1'>
                                أدخل طريقة التوصيل 
                            </h1>
                        }

                        <select 
                        value={formData.shippingMethod} 
                        onChange={handleChange} 
                        required className="shippingmethod" 
                        name="shippingMethod"  
                        >
                            <option value='طريقة التوصيل' hidden >طريقة التوصيل</option>
                            <option value="بيت">بيت</option>
                            <option value="مكتب">مكتب</option>
                        </select>

                        <input 
                        onChange={handleChange} 
                        required 
                        placeholder="Total Price" 
                        name="totalPrice" 
                        type="number" 
                        />
                        
                        <button type="submit" className="submit-button">أطلب الان</button>
        </form> 
    </div>
  )
}

export default Page