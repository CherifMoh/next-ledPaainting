'use client'

import '../../../../styles/pages/checkout.css'

import { useEffect, useState } from 'react';
import {addOrder} from '../../../actions/order'
import {wilayat} from '../../../data/wilayat'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

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
    const [selectqnt, setSelectqnt] = useState(1);

    const [search,setSearch] = useState('')
    const [orders,setOrders] = useState([])

    const [isBeruAvailable,setIsBeruAvailable] = useState(true)

    const { data: Designs, isLoading, isError,error } = useQuery({
        queryKey:['AdminledDesigne'],
        queryFn: fetchProducts
    });

    const router = useRouter()

    useEffect(()=>{
        if(typeof localStorage !== 'undefined'){
             setOrders(
                JSON.parse(localStorage.getItem('adminOrder')) || []
            )
        }
    },[])

    useEffect(()=>{
        setFormData(pre=>({
            ...pre,
            orders:orders
        }))
    },[orders])

    useEffect(()=>{
        wilayat.forEach(wilaya=>{
            if(wilaya.name === formData.wilaya){
                if(wilaya.beru === ''){
                    setIsBeruAvailable(false) 
                    setFormData(pre=>({
                        ...pre,
                        shippingMethod:'بيت',
                        shippingPrice:wilaya.dar
                    }))    
                }else{
                    setIsBeruAvailable(true)     
                }
                if(formData.wilaya && formData.shippingMethod){
                    if(wilaya.name === formData.wilaya){
                        setFormData(pre=>({
                            ...pre,
                            shippingMethod:'بيت',
                            shippingPrice:wilaya.dar
                        }))  
                        formData.shippingMethod === 'بيت'
                            ? setFormData(pre=>({
                                ...pre,
                                shippingMethod:'بيت',
                                shippingPrice:wilaya.dar
                            }))
                            : setFormData(pre=>({
                                ...pre,
                                shippingMethod:'مكتب',
                                shippingPrice:wilaya.beru
                            }))
                    }
                }
                
            }
        })
    },[formData.wilaya , formData.shippingMethod])


    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error: {error.message}</div>;



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

        
        localStorage.removeItem('adminOrder')
        
        router.refresh()
        router.push('/admin/orders')
    }

    const wilayatOptionsElement = wilayat.map(wilaya=>(
        <option key={wilaya.name} value={wilaya.name}>{wilaya.name}</option>
    ))

    const designOptionsElent = Designs.map(design=>{
        if(design.title.toLowerCase().includes(search.toLocaleLowerCase() ) ||search === '' ){
            return(
                <div key={design._id} className='border-gray-500 border-b-2 p-4 bg-white'>
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
            )
        }
       
    })

    function checkFileSize(file) {
        if(file){
            const fileSize = file.size; // in bytes
            const maxSize = 1000000; // 500KB
            if (fileSize > maxSize) {
                alert('File size exceeds the limit. Please select a smaller file.');
                return false;
            }
            return true;
        }
    }

    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (err) => {
                reject(err);
            };
        });
    }

    async function handleFileUpload(e) {
        const file = e.target.files[0];
        if(!file){
            e.target.files[0]=[]
        }
        if(!checkFileSize(file)) return 
        const base64 = await convertToBase64(file);
        setSelectedImage(base64);
    }

    function addToOrders(){
        setOrders(pre=>([
            ...pre,
            {
                imageOn:selectedImage,
                qnt:selectqnt
            }
        ]))
        setSelectedImage('')
        setSelectqnt('')
    }
    localStorage.setItem('adminOrder',JSON.stringify(orders))

   

    const ordersElement = orders.map(order=>{
        return(
            <div key={order.imageOn} className='flex items-center relative'>
                <div 
                 className='bg-red-500 text-sm text-white font-thin px-1 rounded-full absolute -top-2 -right-1'
                >
                    {order.qnt}
                </div>
                <Image 
                 width={64}
                 height={64}
                 src={order.imageOn}
                 alt=''
                />
            </div>
        )
    })
    
  return (
    <div className='p-4'>
        <div className='flex items-center justify-center gap-16'> 
        
            {selectedImage 
            ?
            <Image 
                src={selectedImage} 
                alt='' 
                width={64} height={64}
                onClick={()=>{
                    setIsdesigns(pre=>!pre)
                    setSelectedImage('')
                }} 
            />
            :
            <div className='flex items-center gap-16'>
                <div>  
                    <div
                    onClick={()=>setIsdesigns(pre=>!pre)} 
                    className='border-2 border-gray-500 w-40 h-14 flex items-center p-2 cursor-pointer'
                    >
                        <p>Select Image</p>
                    </div>
                    
                    {isdesigns && 
                        <div className='max-w-96 border-2 border-gray-500 absolute mt-2'>
                            <div className='flex justify-center mt-2 border-b-2 border-gray-500'>
                                <FontAwesomeIcon 
                                icon={faMagnifyingGlass}
                                className={`pt-2 pointer-events-none z-10 absolute left-64 ${search?'hidden':'opacity-50'}`}
                                />
                                <input 
                                id="search"
                                type='search' 
                                className='w-64 px-2 py-1 rounded-xl border-2 border-gray-500 no-focus-outline text-black bg-stone-200' 
                                placeholder={`Search`}
                                onChange={(e)=>setSearch(e.target.value)}
                                />
                            </div>
                            <div className='grid grid-cols-2 max-h-[484px] overflow-y-auto'>
                                {designOptionsElent}
                            </div>
                        </div>
                    }
                </div>   
                <div>Or</div>       
                <div className='border-2 border-dashed h-14 border-slate-800 relative text-center flex justify-center'>
                    <span 
                    className='absolute top-4'
                    >
                        Add a custom
                    </span>
                    <input 
                     type='file' 
                     onChange={handleFileUpload}
                     className='w-full h-full opacity-0 m-0'
                    />
                </div> 
            </div>     
        }
            <input 
             type="number"
             placeholder='Qntity' 
             value={selectqnt} 
             className='m-0 w-24 h-14'
             min={1}
             onChange={(e)=>setSelectqnt(e.target.value)}
            />

            <button
             className='bg-green-300 px-3 py-2 rounded-lg'
             onClick={addToOrders}
            >
                Add
            </button>
                
        </div>

        <div className='mt-10 text-center text-2xl font-semibold flex-col'>
            <h1>Orders</h1>
            <div className='flex gap-8'>
                {ordersElement}
            </div>
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

                        {isBeruAvailable
                            ?<select 
                            value={formData.shippingMethod} 
                            onChange={handleChange} 
                            required className="shippingmethod" 
                            name="shippingMethod"  
                            >
                                <option value='طريقة التوصيل' hidden >طريقة التوصيل</option>
                                <option value="بيت">بيت</option>
                                <option value="مكتب">مكتب</option>
                            </select>
                            :<div className='my-5 text-xl font-semibold'>
                                التوصيل الى البيت فقط
                            </div>
                        }   

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