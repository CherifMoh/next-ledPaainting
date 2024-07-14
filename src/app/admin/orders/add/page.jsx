'use client'

import '../../../../styles/pages/checkout.css'

import { useEffect, useState } from 'react';
import { addOrder } from '../../../actions/order'
import { wilayat } from '../../../data/wilayat'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from 'axios';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../../../components/loadings/Spinner';
import { useSelector } from 'react-redux';

async function fetchDesigns() {
    const res = await axios.get('/api/products/ledDesigns');
    return res.data;
}
async function fetchProducts() {
    const res = await axios.get('/api/products/addOrders');
    return res.data;
}


function Page() {
    const [formData, setFormData] = useState({});

    // Form validation States
    const [isShippingSelected, setIsShippingSelected] = useState(true);
    const [isWilayaSelected, setIsWilayaSelected] = useState(true);
    const [isPhoneCorrect, setIsPhoneCorrect] = useState(true);


    const [isSubmiting, setIsSubmiting] = useState(false);

    const [isdesigns, setIsdesigns] = useState(false);
    const [isproducts, setIsproducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [selectqnt, setSelectqnt] = useState(1);

    const [search, setSearch] = useState('')
    const [orders, setOrders] = useState([])

    const [isBeruAvailable, setIsBeruAvailable] = useState(true)

    const { data: Designs, isLoading: designsLoding, isError: designsIsErr, error: designsErr } = useQuery({
        queryKey: ['AdminledDesigne'],
        queryFn: fetchDesigns
    });
    const { data: Products, isLoading: productsLoding, isError: productsIsErr, error: productsErr } = useQuery({
        queryKey: ['AdminProducts'],
        queryFn: fetchProducts
    });

    const router = useRouter()

    const accessibilities = useSelector((state) => state.accessibilities.accessibilities)


    useEffect(()=>{
        if(accessibilities.length === 0)return
        const access = accessibilities.find(item=>item.name === 'orders')
        if(!access || access.accessibilities.length === 0 || !access.accessibilities.includes('create')){
           return router.push('/admin')
        }
       
    },[accessibilities])

    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            setOrders(
                JSON.parse(localStorage.getItem('adminOrder')) || []
            )
        }
    }, [])

    useEffect(() => {
        setFormData(pre => ({
            ...pre,
            orders: orders
        }))
    }, [orders])

    useEffect(() => {
        wilayat.forEach(wilaya => {
            if (wilaya.name === formData.wilaya) {
                if (wilaya.beru === '') {
                    setIsBeruAvailable(false)
                    setFormData(pre => ({
                        ...pre,
                        shippingMethod: 'بيت',
                        shippingPrice: wilaya.dar
                    }))
                } else {
                    setIsBeruAvailable(true)
                }
                if (formData.wilaya && formData.shippingMethod) {
                    if (wilaya.name === formData.wilaya) {
                        setFormData(pre => ({
                            ...pre,
                            shippingMethod: 'بيت',
                            shippingPrice: wilaya.dar
                        }))
                        formData.shippingMethod === 'بيت'
                            ? setFormData(pre => ({
                                ...pre,
                                shippingMethod: 'بيت',
                                shippingPrice: wilaya.dar
                            }))
                            : setFormData(pre => ({
                                ...pre,
                                shippingMethod: 'مكتب',
                                shippingPrice: wilaya.beru
                            }))
                    }
                }

            }
        })
    }, [formData.wilaya, formData.shippingMethod])


    if (productsLoding || designsLoding) return <div>Loading...</div>;

    if (productsIsErr) return <div>Error: {productsErr.message}</div>;
    if (designsIsErr) return <div>Error: {designsErr.message}</div>;


    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        setFormData(preState => ({
            ...preState,
            [name]: value
        }))
    }
    const phonePattern = /^\d{10}$/;

    async function handelSubmit(e) {
        e.preventDefault()

        if (!phonePattern.test(formData.phoneNumber)) return setIsPhoneCorrect(false)

        if (!formData.wilaya) return setIsWilayaSelected(false)

        if (!formData.shippingMethod) return setIsShippingSelected(false)

        setIsSubmiting(true)

        const res = await axios.post(`/api/orders`, formData)

        console.log(res)


        localStorage.removeItem('adminOrder')

        router.refresh()
        router.push('/admin/orders')
    }

    const wilayatOptionsElement = wilayat.map(wilaya => (
        <option key={wilaya.name} value={wilaya.name}>{wilaya.name}</option>
    ))

    const designOptionsElent = Designs.map(design => {
        if (design.title.toLowerCase().includes(search.toLocaleLowerCase()) || search === '') {
            return (
                <div
                    key={design._id}
                    className='border-gray-500 z-50 border-b-2 p-4 bg-white'
                >
                    <Image
                        src={design.imageOn}
                        alt=''
                        width={128} height={128}
                        onClick={() => {
                            setSelectedProduct(pre => ({ ...pre, image: design.imageOn }))
                            setIsproducts(false)
                            setIsdesigns(false)
                        }}
                    />
                </div>
            )
        }

    })

    const productsOptionsElent = Products.map(products => {
        if (products.title.toLowerCase().includes(search.toLocaleLowerCase()) || search === '') {
            return (
                <div
                    key={products._id}
                    className='flex p-4 z-50 border-gray-500 border-b-2 w-full items-center justify-between bg-white'
                    onClick={() => {
                        if (products.title === 'Led Painting') {
                            setIsdesigns(true)
                            setSelectedProduct(products)
                        } else {
                            setSelectedProduct({ ...products, image: products.imageOn })
                            setIsproducts(false)
                            setIsdesigns(false)
                        }
                    }}
                >
                    <Image
                        src={products.imageOn}
                        alt=''
                        width={128} height={128}
                    />
                    <h1>
                        {products.title}
                    </h1>
                </div>
            )
        }

    })

    function checkFileSize(file) {
        if (file) {
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
        if (!file) {
            e.target.files[0] = []
        }
        if (!checkFileSize(file)) return
        const base64 = await convertToBase64(file);
        setSelectedProduct(pre => ({ ...pre, image: base64 }));
    }

    async function handelAddGalleryImg(e) {
        const file = e.target.files[0];
        if (!file) {
            // e.target.files[0] = []
        }
        if (!checkFileSize(file)) return
        const base64 = await convertToBase64(file);
   
        setSelectedProduct(pre =>{
            if(pre.gallery){
                return{ ...pre, gallery:[...pre.gallery, base64] }
            }
            return{ ...pre, gallery:[ base64] }
        });
    }



    function addToOrders() {
        setOrders(pre => ([
            ...pre,
            {
                imageOn: selectedProduct.image,
                gallery: selectedProduct.gallery,
                qnt: selectqnt,
                title: selectedProduct.title,
                options: selectedProduct.options,
                _id: uuidv4()
            }
        ]))
        setSelectedProduct({})
        setSelectqnt('')
    }

    function removeOrder(id) {
        setOrders(prevOrders => {
            const newOrders = prevOrders.filter(order => order._id !== id)
            return newOrders
        })
    }


    function handelOptChange(e) {
        const value = e.target.value
        let options = selectedProduct.options
        const newOptions = options.map((option, i) => {
            if (option.title === value) {
                return { ...option, selected: true }
            }
            if (option.selected) {
                return { ...option, selected: false }
            }
            return option
        })
        setSelectedProduct(pre => ({ ...pre, options: newOptions }))
    }

    const productOptsElement = selectedProduct.options?.map(option => {
        return (
            <option
                key={option.title}
                value={option.title}
            >
                {option.title}
            </option>
        )
    })


    const ordersElement = orders.map(order => {

        const selectedOption = order.options.find(item => item.selected)

        return (
            <div key={order.imageOn} className='flex items-center flex-col relative'>
                <div
                    className='bg-red-500 text-sm text-white px-1 rounded-full absolute -top-2 -right-1'
                >
                    {order.qnt}
                </div>
                <div
                    className='px-1 cursor-pointer bg-gray-200 text-sm rounded-full absolute -top-2 -left-1'
                    onClick={() => removeOrder(order._id)}
                >
                    X
                </div>
                <Image
                    width={64}
                    height={64}
                    src={order.imageOn}
                    alt=''
                />
                {selectedOption &&
                    <div className='text-sm'>
                        {selectedOption.title}
                    </div>
                }
            </div>
        )
    })

    const galleryElement = selectedProduct.gallery?.map(img=>{
        return(
            <div key={uuidv4()}>
            <Image
                src={img}
                alt=''
                width={64} height={64}
            />
            </div>
        )
    })

    return (
        <div className='p-4 pt-0 flex flex-col-reverse md:flex-row gap-36 md:gap-4'>
            <form
                onSubmit={handelSubmit}
                className='md:border-r-2 h-screen md:w-1/2 md:border-gray-400 pr-4'
            >
                <h1 className='text-center mt-4 text-2xl font-semibold mb-10'>Order details</h1>
                <input
                    onChange={handleChange}
                    required
                    className="name"
                    placeholder="Name"
                    name="name"
                    type="text"
                />
                <input
                    onChange={handleChange}
                    className="name"
                    placeholder="instagram UserName"
                    name="instaUserName"
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
                    ? <select
                        value={formData.shippingMethod}
                        onChange={handleChange}
                        required className="shippingmethod"
                        name="shippingMethod"
                    >
                        <option value='طريقة التوصيل' hidden >طريقة التوصيل</option>
                        <option value="بيت">بيت</option>
                        <option value="مكتب">مكتب</option>
                    </select>
                    : <div className='my-5 text-xl font-semibold'>
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

                <button 
                    type="submit" 
                    className={`w-full p-4 rounded text-white text-sm font-semibold ${isSubmiting && 'h-16'} ${formData.orders.length === 0 ? 'bg-blue-300':'bg-[#1773B0] '} flex justify-center items-start`}
                    disabled={isSubmiting ||formData.orders.length === 0 }
                >
                    {isSubmiting
                        ? <Spinner color={'border-gray-500'} size={'h-10 w-10 '} />
                        :
                        ' أطلب الان'
                    }
                </button>
            </form>
            <div className='md:w-1/2'>
                <h1
                    className='text-center mt-4 text-2xl font-semibold mb-10'
                >
                    Add Order
                </h1>
                <div className='flex flex-col items-center justify-center gap-6'>
                    <div>
                        {selectedProduct.image
                            ?
                            <div className='flex items-center gap-2'>
                                <Image
                                    src={selectedProduct.image}
                                    alt=''
                                    width={64} height={64}
                                    onClick={() => {
                                        setIsproducts(pre => !pre)
                                        setSelectedProduct({})
                                    }}
                                />
                                {galleryElement}
                                <div 
                                    className='flex items-center justify-center relative size-16 border border-dashed border-gray-500'
                                >

                                    <input 
                                        type="file" 
                                        name="" id="" 
                                        className='opacity-0 absolute top-0 right-0 size-full'
                                        onChange={(e) => handelAddGalleryImg(e)}
                                    />

                                     <FontAwesomeIcon icon={faPlus} className='size-6 text-gray-600'/>
                                </div>
                            </div>
                            :
                            <div className='flex items-center gap-16'>
                                <div>
                                    <div
                                        onClick={() => {
                                            setIsproducts(pre => !pre)
                                            setIsdesigns(false)
                                        }}
                                        className='border-2 border-gray-500 w-40 h-14 flex items-center p-2 cursor-pointer'
                                    >
                                        <p>Select a Product</p>
                                    </div>

                                    {isproducts &&
                                        <div
                                            className='max-w-96 bg-white border-2 border-gray-500 z-50 absolute mt-2'
                                        >
                                            <div className='flex justify-center mt-2 border-b-2 border-gray-500'>
                                                <FontAwesomeIcon
                                                    icon={faMagnifyingGlass}
                                                    className={`pt-2 pointer-events-none z-10 absolute left-64 ${search ? 'hidden' : 'opacity-50'}`}
                                                />
                                                <input
                                                    id="search"
                                                    type='search'
                                                    className='w-64 px-2 py-1 rounded-xl border-2 border-gray-500 no-focus-outline text-black bg-stone-200'
                                                    placeholder={`Search`}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            </div>
                                            {isdesigns
                                                ? <div
                                                    className='grid grid-cols-2 max-h-[484px] z-50 overflow-y-auto'
                                                >
                                                    <div className='border-gray-500 z-50 border-b-2 p-4 bg-white flex items-center '>
                                                        <div className='border-2 border-dashed border-slate-800 relative size-32 text-center flex justify-center items-center '>
                                                            <span
                                                                className='absolute top-1/3'
                                                            >
                                                                Add a custom
                                                            </span>
                                                            <input
                                                                type='file'
                                                                onChange={(e) => {
                                                                    handleFileUpload(e)
                                                                    setIsproducts(false)
                                                                    setIsdesigns(false)
                                                                }}
                                                                className='size-full opacity-0 m-0'
                                                            />
                                                        </div>
                                                    </div>
                                                    {designOptionsElent}
                                                </div>
                                                : <div
                                                    className='max-h-[484px] w-80 z-50 overflow-y-auto'
                                                >
                                                    {productsOptionsElent}
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>

                            </div>
                        }
                    </div>

                    <div className='flex flex-col xl:flex-row items-center justify-center gap-16 '>
                        <input
                            type="number"
                            placeholder='Qntity'
                            value={selectqnt}
                            className='m-0 w-24 h-14'
                            min={1}
                            onChange={(e) => setSelectqnt(e.target.value)}
                        />
                        {productOptsElement?.length > 0 &&
                            <select
                                name="options"
                                onChange={handelOptChange}
                                className='m-0 w-max'
                            >
                                <option hidden>
                                    اختر الخيار
                                </option>
                                {productOptsElement}
                            </select>
                        }
                        </div>

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
            </div>
        </div>
    )
}

export default Page