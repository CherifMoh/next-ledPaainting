"use client"

import axios from "axios";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import Image from "next/image";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPen, faPlus, faX, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { deleteOrder } from '../../actions/order'
import { editMinusProduct } from '../../actions/storage'
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'

import orangeBg from '../../../../public/assets/orange bg.png';
import redBg from '../../../../public/assets/red bg.png';
import greenBg from '../../../../public/assets/green bg.png';
import transparent from '../../../../public/assets/transparent.png';
import '../../../styles/pages/orders.css'

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import Spinner from '../../../components/loadings/Spinner'
import { useSelector } from "react-redux";


async function fetchOrders() {
    const res = await axios.get('/api/orders');
    return res.data;
}

async function fetchDesigns() {
    const res = await axios.get('/api/products/ledDesigns/images');
    return res.data;
}
async function fetchProducts() {
    const res = await axios.get('/api/products');
    return res.data;
}

function Orders() {

    typeof document !== 'undefined' && document.body.classList.add('bg-white')

    const [deleting, setDeleting] = useState([])

    const { data: Orders, isLoading, isError, error } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders
    });


    const { data: Designs, isLoading: designsLoding, isError: designsIsError, error: designErr } = useQuery({
        queryKey: ['AdminledDesigne'],
        queryFn: fetchDesigns
    });

    const { data: Products, isLoading: ProductsLoding, isError: ProductsIsError, error: ProductsErr } = useQuery({
        queryKey: ['Admin All Products'],
        queryFn: fetchProducts
    });

    const [editedOrder, setEditedOrder] = useState({})

    const [editedOrderId, setEditedOrderId] = useState('')

    const [selectedDate, setSelectedDate] = useState(null);

    const [selectedImage, setSelectedImage] = useState({ _id: '', image: '' });

    const [search, setSearch] = useState('')

    const [isdesigns, setIsdesigns] = useState({ _id: '', state: false })
    const [isproducts, setIsproducts] = useState({ _id: '', state: false })

    const [isProductDeleted, setIsProductDeleted] = useState([])

    const [newOrders, setNewOrders] = useState({})


    const [isAddingProduct, setIsAddingProduct] = useState([])
    const [addedOrder, setAddedOrder] = useState({})
    const [isAddedProducts, setIsAddedProducts] = useState([])
    const [isAddedDesigns, setIsAddedDesigns] = useState([])
    const [selectqnt, setSelectqnt] = useState(1)


    const [scheduleQnt, setScheduleQnt] = useState()

    const [isSchedule, setIsSchedule] = useState(false)

    const [saving, setSaving] = useState([])
    
    const [dateFilter, setDateFilter] = useState('')

    const [craftingOrders, setCraftingOrders] = useState([])
    const [isCrafting, setIsCrafting] = useState(false)



    const router = useRouter()

    const queryClient = useQueryClient()

    const accessibilities = useSelector((state) => state.accessibilities.accessibilities)


    useEffect(()=>{
        if(accessibilities.length === 0)return
        const access = accessibilities.find(item=>item.name === 'orders')
        if(!access || access.accessibilities.length === 0){
            router.push('/admin')
        }
    },[accessibilities])


    useEffect(() => {
        const inputs = document.querySelectorAll('.dynamic-width');
        inputs.forEach(input => {
            if (input.name !== 'schedule') input.style.width = `${(input.value.length + 2) * 9}px`;
        });
    }, [editedOrderId]);

    useEffect(() => {
        setNewOrders(editedOrder.orders)
    }, [editedOrder]);

    useEffect(() => {
        let newSchedule = 0
        Orders?.forEach(order => {
            const currentDate = format(new Date(), 'yyyy-MM-dd');

            // Check if the saved date is the same as today
            const isSameAsToday = order.schedule === currentDate;
            if (isSameAsToday) newSchedule++
        })
        setScheduleQnt(newSchedule)
    }, [editedOrder, Orders]);



    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching Orders: {error.message}</div>;

    if (designsLoding) return <div>Loading...</div>;
    if (designsIsError) return <div>Error fetching Designs: {designErr.message}</div>;

    if (ProductsLoding) return <div>Loading...</div>;
    if (ProductsIsError) return <div>Error fetching Products: {ProductsErr.message}</div>;

    function orderIdToggel(id) {
        if (editedOrderId === id) {
            setEditedOrderId('')
        } else {
            setEditedOrderId(id)
        }
    }


    function handleChange(e) {
        const input = e.target

        const name = input.name;
        const value = input.value;

        

        if (name !== 'schedule') input.style.width = `${(input.value.length + 2) * 9}px`;
        setEditedOrder(prev => ({
            ...prev,
            [name]: value
        }));
    }
    function handleProductChange(newOrder, id) {

        setEditedOrder(prev => {
            const newOrders = prev.orders.map(order => {
                if (order._id === id) {
                    newOrder = {
                        _id: id,
                        qnt: order.qnt,
                        imageOn: newOrder.imageOn,
                        options: newOrder.options,
                    }
                    return newOrder
                }
                return order
            })
            return { ...prev, orders: newOrders }
        });
    }

    function handleQntChange(e, i) {
        const input = e.target


        const name = input.name;
        const value = input.value;

        input.style.width = `${(input.value.length + 2) * 9}px`;

        setNewOrders(pre => {
            pre[i] = { ...pre[i], [name]: value }
            return pre
        });
    }

    function handleOptChange(e, i) {
        const input = e.target
        const name = input.name;
        const value = input.value;

        input.style.width = `${(input.value.length + 4) * 10}px`;


        setNewOrders(pre => {
            let newOption = []
            pre[i].options.forEach(option => {
                if (option.title === value) {
                    newOption = [...newOption, { ...option, selected: true }]
                }
                if (option.selected) {
                    newOption = [...newOption, { ...option, selected: false }]
                }
                return option
            })
            pre[i] = { ...pre[i], options: newOption }
            return newOption = [...newOption, pre]
        });
    }

    function handleDateChange(date) {

        setSelectedDate(date);
        const formattedDate = format(date, 'yyyy-MM-dd');
        setEditedOrder(prev => ({
            ...prev,
            schedule: formattedDate,
            tracking: 'scheduled'

        }));
    }

    async function handleDelete(id) {
        setDeleting(pre => ([...pre, {
            id: id,
            state: true
        }]))
        setEditedOrderId('')
        await deleteOrder(id)
        router.refresh()
        router.push('/admin/orders')
        queryClient.invalidateQueries('AdminledDesigne');
    }

    let longesOrder = []
    Orders.forEach(order => {
        if (order.orders.length > longesOrder.length) {
            longesOrder = order.orders
        }

    })

    let ordersQnts =[]
    editedOrder?.orders?.forEach(order => {
        const i = ordersQnts.findIndex(item=>item.title === order.title)
        if(i > -1){
            ordersQnts[i].qnt = Number(ordersQnts[i].qnt) + Number(order.qnt)
        }else{
            ordersQnts.push({title: order.title, qnt: order.qnt})
        }
    })

    async function handleUpdatingOrder(id) {
        // setEditedOrder(pre => ({ ...pre, orders: newOrders }))
        setSaving(pre => ([...pre, id]))
        const oldOrder = Orders.find(order => order._id === id)
        if(oldOrder.tracking !== 'delivered' && editedOrder.tracking === 'delivered'){
            ordersQnts.forEach(order=>{
                editMinusProduct(order.title,order.qnt)
            })
        }
        const res = await axios.put(`/api/orders/${editedOrderId}`, editedOrder)
        // console.log(res.data)
        queryClient.invalidateQueries('orders');
        setIsProductDeleted([])
        setSelectedDate(null)
        setSaving(pre => {
            const nweSaving = pre.filter(SId => SId !== id)
            return nweSaving
        })

    }

    function isWithinPastWeek(dateString) {
        // Parse the input date
        const inputDate = new Date(dateString);

        // Get the current date and time
        const currentDate = new Date();

        // Calculate the date one week ago from today
        const oneWeekAgoDate = new Date();
        oneWeekAgoDate.setDate(currentDate.getDate() - 8);

        // Check if the input date is within the past week
        return inputDate >= oneWeekAgoDate && inputDate <= currentDate;
    }
    function isDateInPastMonth(dateStr) {
        // Parse the input date
        const inputDate = new Date(dateStr);

        // Get the current date and time
        const currentDate = new Date();

        // Calculate the date one month ago from today
        const oneMonthAgoDate = new Date();
        oneMonthAgoDate.setMonth(currentDate.getMonth() - 1);

        // Check if the input date is within the past month
        return inputDate >= oneMonthAgoDate && inputDate <= currentDate;
    }


    function handleDateFilterChange(e) {
        const value = e.target.value

        const currentDate = format(new Date(), 'yyyy-MM-dd')

        const cDate = new Date();
        cDate.setDate(cDate.getDate() - 1);
        const yesterdayDate = cDate.toISOString().slice(0, 10);

        if (value === 'maximum') setDateFilter('')
        if (value === 'today') setDateFilter(currentDate)
        if (value === 'yesterday') setDateFilter(yesterdayDate)
        if (value === 'this Week') setDateFilter('this Week')
        if (value === 'this Month') setDateFilter('this Month')
    }

    function filterOrders(order, currentDate) {
        const createdDate = order.createdAt.slice(0, 10).toLowerCase();
        const searchLower = search.toLowerCase();

        const isMatchingSearch = !isSchedule && (
            order.name.toLowerCase().includes(searchLower) ||
            order.wilaya.toLowerCase().includes(searchLower) ||
            order.phoneNumber.includes(searchLower) ||
            order.adresse.toLowerCase().includes(searchLower)
        );

        const isMatchingDateFilter = (
            dateFilter === 'this Week' && isWithinPastWeek(createdDate) ||
            dateFilter === 'this Month' && isDateInPastMonth(createdDate) ||
            createdDate === dateFilter || !dateFilter
        );

        return isMatchingDateFilter && (isMatchingSearch || (isSchedule && order.schedule === currentDate));
    }

    async function deleteOrderProduct(id) {
        setNewOrders(prev => {
            const newesOrders = prev.filter(order => order._id !== id)
            setEditedOrder(pre => {
                return { ...pre, orders: newesOrders }
            })
            return newesOrders

        })
        setIsProductDeleted(pre => [...pre, id])
    }

    function toggleIsAding(id) {
        setIsAddingProduct(pre => {
            if (pre.includes(id)) {
                return pre.filter(productId => productId !== id)
            }
            return [...pre, id]
        })
    }

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
        setAddedOrder(pre => ({ ...pre, image: base64 }));
    }

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
                            setSelectedImage({
                                _id: product._id,
                                image: design.imageOn
                            })
                            setIsproducts({ _id: '', state: false })
                            setIsdesigns({ _id: '', state: false })
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
                    onClick={(e) => {
                        handleProductChange(products, product._id)
                        if (products.title === 'Led Painting') {
                            setIsdesigns({
                                _id: product._id,
                                state: true
                            })
                        } else {
                            setSelectedImage({
                                _id: product._id,
                                image: products.imageOn
                            })
                            setIsproducts({ _id: '', state: false })
                            setIsdesigns({ _id: '', state: false })
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

    function addDesignOptionsElent(id) {
        return Designs.map(design => {
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
                            className='size-32'
                            onClick={() => {
                                // setSelectedImage({
                                //     _id: product._id,
                                //     image: design.imageOn
                                // })
                                setAddedOrder(pre => ({ ...pre, image: design.imageOn }))
                                setIsAddedDesigns(pre => pre.filter(item => item !== id))
                                setIsAddedProducts(pre => pre.filter(item => item !== id))
                            }}
                        />
                    </div>
                )
            }

        })
    }

    function addProductsOptionsElent(id) {
        return Products.map(product => {
            if (product.title.toLowerCase().includes(search.toLocaleLowerCase()) || search === '') {
                return (
                    <div
                        key={product._id}
                        className='flex p-4 z-50 border-gray-500 border-b-2 w-full items-center justify-between bg-white'
                        onClick={(e) => {
                            setAddedOrder(pre => {
                                return product.title === 'Led Painting'
                                    ? { ...product, }
                                    : { ...product, image: product.imageOn }
                            })
                            setIsAddedDesigns(pre => {
                                if (product.title === 'Led Painting') pre = [...pre, id]
                                return pre
                            })
                            if (product.title !== 'Led Painting') {
                                setIsAddedProducts(pre => {
                                    return pre.filter(item => item !== id)
                                })
                            }
                        }}
                    >
                        <Image
                            src={product.imageOn}
                            alt=''
                            width={128} height={128}
                        />
                        <h1>
                            {product.title}
                        </h1>
                    </div>
                )
            }

        })
    }

    function addToOrders() {
        setNewOrders(pre => {
            pre = [
                ...pre,
                {
                    imageOn: addedOrder.image,
                    qnt: selectqnt,
                    title: addedOrder.title,
                    options: addedOrder.options,
                    _id: uuidv4()
                }
            ]

            // console.log(pre)
            setEditedOrder(prev => {
                return { ...prev, orders: pre }
            })
            return pre
        })
        setAddedOrder({})
        setSelectqnt(1)
        // handleUpdatingOrder(id)
    }
    // console.log(editedOrder)

    const productOptsElement = addedOrder.options?.map(option => {
        return (
            <option
                key={option.title}
                value={option.title}
            >
                {option.title}
            </option>
        )
    })

    function handelOptChange(e) {
        const value = e.target.value
        let options = addedOrder.options
        const newOptions = options.map((option, i) => {
            if (option.title === value) {
                return { ...option, selected: true }
            }
            if (option.selected) {
                return { ...option, selected: false }
            }
            return option
        })
        setAddedOrder(pre => ({ ...pre, options: newOptions }))
    }

    const ordersElementFun = (product, i, order) => {

        if (isProductDeleted.includes(product._id)) return

        const optionElement = product.options?.map(option => {
            return (
                <option
                    value={option.title}
                    key={uuidv4()}
                    className="p-2"
                >
                    {option.title}
                </option>
            )
        })
        let slectedOption
        product.options?.forEach(option => {
            if (option.selected) {
                slectedOption = option.title
            }
        })

        return (
            <td
                key={i}
                className=" border-y border-solid border-[rgb(128,128,128)]  relative font-medium p-2 pr-4 text-center h-8"
            >

                {order._id === editedOrderId
                    ?
                    <select
                        onChange={(e) => handleOptChange(e, i)}
                        name="option"
                        defaultValue={slectedOption}
                        className='min-w-10 border-2 border-gray-300 rounded-md pl-1 dynamic-width'
                    >
                        {optionElement}
                    </select>
                    :
                    <div
                        className="mb-1 "
                    >
                        {slectedOption}
                    </div>
                }

                {order._id === editedOrderId &&
                    <div
                        className='absolute top-0 right-0 px-1 rounded-full bg-gray-200 cursor-pointer'
                        onClick={() => deleteOrderProduct(product._id)}
                    >
                        X
                    </div>
                }

                <Image
                    className=' w-auto m-auto h-8'
                    src={selectedImage._id === product._id ? selectedImage.image : product.imageOn}
                    width={24} height={24} alt=""
                    key={product._id}
                    onClick={() => {
                        if (order._id === editedOrderId) {
                            setIsproducts(pre => ({
                                _id: product._id,
                                state: !pre.state
                            }))
                        }
                    }}
                />

                {isproducts.state && isproducts._id === product._id &&
                    <div className='max-w-96 border-y border-solid border-[rgb(128,128,128)]  absolute mt-2 bg-white z-50'>
                        <div className='flex justify-center mt-2 border-b-2 border-gray-500 z-50'>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className={`pointer-events-none absolute left-60 top-6 ${search ? 'hidden' : 'opacity-50'}`}
                            />
                            <input
                                id="search"
                                type='search'
                                className='w-64 px-2 py-1 m-2 rounded-xl border-2 border-gray-500 no-focus-outline text-black bg-stone-200'
                                placeholder={`Search`}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {isdesigns.state && isdesigns._id === product._id
                            ? <div
                                className='grid grid-cols-2 max-h-[484px] z-50 overflow-y-auto'
                            >
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


                {order._id === editedOrderId
                    ? <input
                        type="number"
                        onChange={(e) => handleQntChange(e, i)}
                        name="qnt"
                        defaultValue={product.qnt}
                        min={1}
                        className='min-w-10 mt-2 border-2 border-gray-300 rounded-md pl-1 dynamic-width'
                    />
                    : <span
                        className="bg-red-500 absolute left-4 bottom-8 rounded-lg px-1 text-[10px] text-white text-center"
                    >
                        {product.qnt}
                    </span>
                }
            </td>
        )
    }

    function trackingBg(track){
        if(track === 'delivered'){
            return greenBg
        }
        if(track === 'returned'){
            return redBg
        }
        if(track === 'scheduled'){
            return orangeBg
        }
        return transparent
    }

    function handleSelectCrafting(order) {
        setCraftingOrders(pre=>{
            if(pre.some(item => item._id === order._id)){
                return pre.filter(item => item._id !== order._id)
            }
            return [...pre, order]
        })
    }



    const ordersElement = Orders.map((order, index) => {
        
        const currentDate = format(new Date(), 'yyyy-MM-dd');

        if (filterOrders(order, currentDate)) {
            let cartItemsElemnt
            if (order.orders) {
                cartItemsElemnt = order.orders.map((product, i) => ordersElementFun(product, i, order))

                if (editedOrderId === order._id && Array.isArray(newOrders)) {
                    cartItemsElemnt = newOrders.map((product, i) => ordersElementFun(product, i, order))
                }
            }
            if (editedOrderId === order._id) {
                return (
                    <tr key={order._id} className={`h-5`}>
                        <td>

                            {deleting.some(item => item.id === order._id && item.state)
                                ? <Spinner size={'h-8 w-8'} color={'border-red-500'} containerStyle={'ml-6 -mt-3'} />
                                : <button
                                    className=' p-2 rounded-md'
                                    onClick={() => handleDelete(order._id)}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} className="text-red-700" />
                                </button>
                            }

                            <button
                                onClick={() => {
                                    handleUpdatingOrder(order._id)
                                    orderIdToggel(order._id)
                                }}
                                className='px-3 py-2 ml-2  text-white bg-green-400 rounded-lg'
                            >
                                save
                            </button>
                        </td>
                        <td className="bg-blue-100">
                            <input
                                type="text"
                                onChange={handleChange}
                                name="name"
                                defaultValue={editedOrder.name}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                            />
                        </td>
                        <td className="bg-blue-100">
                            <input
                                type='text'
                                onChange={handleChange}
                                name="phoneNumber"
                                defaultValue={editedOrder.phoneNumber}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width '
                            />
                        </td>
                        <td className="bg-blue-100">
                            <input
                                type="text"
                                onChange={handleChange}
                                name="wilaya"
                                defaultValue={editedOrder.wilaya}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                            />
                        </td>
                        <td className="bg-blue-100">
                            <input
                                type="text"
                                onChange={handleChange}
                                name="adresse"
                                defaultValue={editedOrder.adresse}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                            />
                        </td>
                        <td className="bg-gray-200">
                            <select
                                value={editedOrder.shippingMethod}
                                onChange={handleChange}
                                className="border-2 bg-transparent border-gray-300 rounded-md pl-1 "
                                name="shippingMethod"
                            >
                                <option value="بيت">بيت</option>
                                <option value="مكتب">مكتب</option>
                            </select>
                        </td>
                        <td className="bg-gray-200">
                            <input
                                type="text"
                                onChange={handleChange}
                                name="totalPrice"
                                defaultValue={editedOrder.totalPrice}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                            />
                        </td>
                        <td className="bg-gray-200">
                            <input
                                type="text"
                                onChange={handleChange}
                                name="shippingPrice"
                                defaultValue={editedOrder.shippingPrice}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                            />
                        </td>
                        <td className="bg-gray-200">
                            <input
                                type="text"
                                onChange={handleChange}
                                name="note"
                                defaultValue={editedOrder.note}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                            />
                        </td>
                        <td className="bg-gray-200">
                            <select
                                onChange={handleChange}
                                value={editedOrder.state}
                                className="border-2 bg-transparent border-gray-300 rounded-md pl-1 max-w-32"
                                name="state"
                            >
                                <option 
                                    value="ordered" 
                                    className="bg-yellow-300"
                                >
                                    غير مؤكدة
                                </option>
                                <option 
                                    value="confirmed"
                                    className="bg-green-300"
                                >
                                    مؤكدة
                                </option>
                                <option 
                                    value="didntAnswer"
                                    className="bg-orange-300"
                                >
                                    لم يرد
                                </option>
                                <option 
                                    value="canseled"
                                    className="bg-red-500"
                                >
                                    ملغاة
                                </option>
                            </select>
                        </td>
                        <td>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className='border-2 bg-transparent border-gray-300 rounded-md pl-1 dynamic-width'
                                dateFormat="yyyy-MM-dd"
                            />
                        </td>
                        <td className="text-center">
                            <input type='checkbox'
                                name="inDelivery"
                                onChange={() => setEditedOrder(pre => ({
                                    ...pre,
                                    inDelivery: !pre.inDelivery
                                })
                                )}
                                defaultChecked={editedOrder.inDelivery}
                            />
                        </td>
                        <td>
                            <select
                                value={editedOrder.tracking}
                                onChange={handleChange}
                                className="border-2 bg-transparent border-gray-300 rounded-md pl-1 max-w-32"
                                name="tracking"
                            >
                                <option hidden>Tracking</option>
                                <option value="delivered">delivered</option>
                                <option value="scheduled">scheduled</option>
                                <option value="returned">returned</option>
                            </select>
                        </td>
                        {cartItemsElemnt}
                        <td>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className='cursor-pointer'
                                onClick={() => toggleIsAding(order._id)}
                            />
                            {isAddingProduct.includes(order._id) &&
                                <div className='flex items-center justify-center gap-8'>
                                    {addedOrder.image
                                        ?
                                        <Image
                                            src={addedOrder.image}
                                            alt=''
                                            width={64} height={64}
                                            onClick={() => {
                                                setIsAddedProducts(pre => {
                                                    if (pre.includes(order._id)) {
                                                        return pre.filter(item => item !== order._id)
                                                    }
                                                    pre = [...pre, order._id]
                                                    return pre
                                                })
                                                setAddedOrder({})
                                            }}
                                        />
                                        :
                                        <div className='flex items-center gap-16'>
                                            <div>
                                                <div
                                                    onClick={() => {
                                                        setIsAddedProducts(pre => {
                                                            if (pre.includes(order._id)) {
                                                                return pre.filter(item => item !== order._id)
                                                            }
                                                            pre = [...pre, order._id]
                                                            return pre
                                                        })
                                                        setIsAddedDesigns(pre => pre.filter(item => item !== order._id))
                                                    }}
                                                    className='border-2 border-gray-500 w-40 h-14 flex items-center p-2 cursor-pointer'
                                                >
                                                    <p>Select a Product</p>
                                                </div>

                                                {isAddedProducts?.includes(order._id) &&
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
                                                        {isAddedDesigns?.includes(order._id)
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
                                                                                setIsAddedDesigns(pre => pre.filter(item => item !== order._id))
                                                                                setIsAddedProducts(pre => pre.filter(item => item !== order._id))
                                                                            }}
                                                                            className='size-full opacity-0 m-0'
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {addDesignOptionsElent(order._id)}
                                                            </div>
                                                            : <div
                                                                className='max-h-[484px] w-80 z-50 overflow-y-auto'
                                                            >
                                                                {addProductsOptionsElent(order._id)}
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>

                                        </div>
                                    }
                                    <input
                                        type="number"
                                        placeholder='Qntity'
                                        value={selectqnt}
                                        className='w-10 h-14 rounded-md border border-gray-600 pl-1 dynamic-width'
                                        min={1}
                                        onChange={(e) => setSelectqnt(e.target.value)}
                                    />

                                    {productOptsElement?.length > 0 &&
                                        <select
                                            name="options"
                                            onChange={handelOptChange}
                                            className='m-0 p-2 h-14 rounded-md border border-gray-600'
                                        >
                                            <option hidden>
                                                اختر الخيار
                                            </option>
                                            {productOptsElement}
                                        </select>
                                    }

                                    <button
                                        className='bg-green-300 px-3 py-2 rounded-lg'
                                        onClick={addToOrders}
                                    >
                                        Add
                                    </button>

                                </div>
                            }
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr
                        key={order._id}
                        className={`h-5 ${saving.includes(order._id) && 'opacity-40'} ${deleting.some(item => item.id === order._id && item.state) && 'opacity-40'}`}
                    >
                        <td>
                            {saving.includes(order._id)
                                ?
                                <Spinner size={'w-8 h-8'} color={'border-green-500'} containerStyle={'ml-6 -mt-3'} />
                                :
                                <div className=" whitespace-nowrap flex items-center justify-center">
                                    {isCrafting &&
                                        <div className="p-2 flex items-center">
                                            <input 
                                                type="checkbox" 
                                                className="size-4 m-0"
                                                checked={craftingOrders.some(item => item._id === order._id)}
                                                onChange={(e) => handleSelectCrafting(order)} 
                                            />
                                        </div>
                                    }
                                    {deleting.some(item => item.id === order._id && item.state)
                                        ? <Spinner size={'h-8 w-8'} color={'border-red-500'} containerStyle={'ml-6 -mt-3'} />
                                        : <button
                                            className=' p-2 rounded-md'
                                            onClick={() => handleDelete(order._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="text-red-700" />
                                        </button>
                                    }
                                    <button
                                        onClick={() => {
                                            setEditedOrderId(order._id)
                                            setEditedOrder(order)
                                        }}
                                        disabled={editedOrderId !== order._id && editedOrderId !== '' || saving.includes(order._id)}
                                        className={` text-white 
                                         ${saving._id === order._id && saving.stat && 'w-8 h-10 relative'}
                                         ${deleting.some(item => item.id === order._id) && 'hidden'}
                                         rounded-lg px-3 py-2
                                      `}
                                    >
                                        <FontAwesomeIcon icon={faPen} className='text-green-600' />
                                    </button>
                                </div>
                            }
                        </td>
                        <td className="bg-blue-100">{order.name}</td>
                        <td className="bg-blue-100">{order.phoneNumber}</td>
                        <td className="bg-blue-100">{order.wilaya}</td>
                        <td className="bg-blue-100">{order.adresse}</td>
                        <td className="bg-gray-200">{order.shippingMethod}</td>
                        <td className="bg-gray-200">{order.shippingPrice}</td>
                        <td className="bg-gray-200">{order.totalPrice}</td>
                        <td className="relative bg-gray-200 max-w-40 whitespace-nowrap overflow-hidden text-ellipsis hover:overflow-visible group">
                            <div className="overflow-hidden text-ellipsis">
                                {order.note}
                            </div>
                            <div className="absolute top-0 left-0 mt-2 w-max max-w-xs p-2 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {order.note}
                            </div>
                        </td>
                        <td className="bg-gray-200">{order.state}</td>
                        <td>{order.schedule}</td>
                        <td className="text-center">
                            {order.inDelivery
                                ? <FontAwesomeIcon icon={faCheck} className={`text-green-500`} />
                                : <FontAwesomeIcon icon={faX} className={`text-orange-500`} />
                            }
                        </td>
                        <td className='relative'>
                            <div className="opacity-0">
                                {order.tracking}
                            </div>
                            <div className='z-10 absolute top-1/2 right-3 -translate-y-1/2'>
                                {order.tracking}
                            </div>
                            <Image 
                                src={trackingBg(order.tracking)} 
                                alt='' 
                                width={64} height={64} 
                                className='absolute top-1/2 right-3 -translate-y-1/2'
                            />
                        </td>
                        {cartItemsElemnt}
                    </tr>
                )

            }
        }
    })

    const dateFilterArray = [
        'maximum', 'today', 'yesterday', 'this Week', 'this Month'
    ]
    const dateFilterElements = dateFilterArray.map((value, i) => (
        <option
            key={i}
            value={value}
            className='capitalize'
        >
            {value}
        </option>
    ))

    const buttonStyle = {
        boxShadow: isSchedule && 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
    }

    const generatePDF = (data) => {
        const doc = new jsPDF();
    
        const colors = ['#e3f2fd', '#f5f5f5']; // Light blue and light gray colors
        let colorIndex = 0; // Index to alternate colors
    
        let ordersPerPage = 5; // Number of orders per page
        let orderIndex = 0; // Current order index on the page
    
        data.forEach((order, index) => {
            if (orderIndex === ordersPerPage) {
                doc.addPage(); // Add a new page when the current page has 5 orders
                orderIndex = 0; // Reset order index for the new page
            }
    
            // Calculate vertical position for the current order
            const yPos = 10 + orderIndex * 60;
    
            // Set background color for each order
            const bgColor = colors[colorIndex % colors.length];
            doc.setFillColor(bgColor);
            doc.rect(10, yPos, 190, 50, 'F'); // Adjust rectangle dimensions based on your layout
    
            // Add customer information for each order
            doc.setTextColor('#000000');
            const customerInfo = `${order.name}, ${order.adresse}`;
            doc.text(customerInfo, 15, yPos + 10);
    
            order.orders.forEach((item, i) => {
                // Add quantity and image (resized to 16x16 pixels)
                doc.text(`${item.qnt}`, 15 + i * 30, yPos + 20);
                doc.addImage(item.imageOn, 'JPEG', 15 + i * 30, yPos + 23, 16, 16);
    
                // Add selected option, if available
                const selectedOption = item.options.find(opt => opt.selected);
                if (selectedOption) {
                    doc.text(selectedOption.title, 15 + i * 30, yPos + 45);
                }
            });
    
            colorIndex++; // Move to the next color for the next order
            orderIndex++; // Move to the next order position on the current page
        });
    
        // Output the PDF as a Blob
        const pdfBlob = doc.output('blob');
    
        // Create a URL for the Blob and open it in a new window
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
    };
    
      

    return (
        <div className="py-4 pl-4 pr-48 flex flex-col gap-5 h-screen overflow-x-auto w-full min-w-max">

            <div
                className="flex items-center 2xl:max-w-7xl xl:max-w-5xl  justify-start gap-12"
            >
                <div className='flex gap-4'>
                    <div className='relative'>
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className={`absolute left-72 top-0 pt-3 z-10 ${search ? 'hidden' : 'opacity-50'}`}
                        />
                        <input
                            onChange={e => setSearch(e.target.value)}
                            type="search"
                            placeholder="Search"
                            className='w-80 p-2 border-2 border-gray-500 rounded-xl no-focus-outline'
                        />
                    </div>
                </div>

                <div
                    className='relative justify-self-end border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer'
                    onClick={() => setIsSchedule(pre => !pre)}
                    style={buttonStyle}
                >
                    <div
                        className='absolute -right-3 -top-3 bg-red-500 px-2 rounded-full text-white'
                    >
                        {scheduleQnt}
                    </div>
                    <div
                    >Scheduled</div>
                </div>

                <div
                    className='relative whitespace-nowrap justify-self-end border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer'
                    onClick={() => {
                        if(isCrafting) {
                            setIsCrafting(pre => !pre)
                            generatePDF(craftingOrders)
                        }else{
                            setIsCrafting(pre => !pre)
                        }
                    }}
                >
                    {isCrafting ? 'Show PDF' : 'start Crafting'}
                </div>

                <select
                    name="date"
                    onChange={handleDateFilterChange}
                    className="ml-auto capitalize border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer"
                >
                    {dateFilterElements}
                </select>

                <Link
                    className='justify-self-end  whitespace-nowrap border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer'
                    href={'/admin/orders/add'}    
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ml-2 whitespace-nowrap">Add a new order</span>
                </Link>
            </div>

            <div className="relative max-h-[700px] overflow-y-auto w-full">
                <table border={0} className="font-normal w-full ml-auto" style={{ borderSpacing: '0' }}>
                    <thead className="sticky top-0 z-[999999999] border-2 border-gray-500 bg-white">
                        <tr>
                            <th>
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    تعديل       
                                </div>
                            </th>
                            <th className="bg-blue-100">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    الأسم
                                </div>
                                    
                            </th>
                            <th className="bg-blue-100">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    الرقم
                                </div>
                            </th>
                            <th className="bg-blue-100">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    الولاية
                                </div>
                            </th>
                            <th className="bg-blue-100">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    البلدية 
                                </div>
                            </th>
                            <th className="bg-gray-200">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    نوع التوصيل 
                                </div>
                            </th>
                            <th className="bg-gray-200">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    سعر التوصيل 
                                </div>
                            </th>
                            <th className="bg-gray-200">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    سعر كلي 
                                </div>
                            </th>
                            <th className="bg-gray-200">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    ملاحضة   
                                </div>
                            </th>
                            <th className="bg-gray-200">
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    الحالة   
                                </div>
                            </th>
                            <th>
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    التأجيل    
                                </div>
                            </th>
                            <th>
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    في التوصيل 
                                </div>
                            </th>
                            <th>
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                    التتبع      
                                </div>
                            </th>
                            <th colSpan={longesOrder.length}>
                                <div className=" border-y border-solid border-[rgb(128,128,128)] p-[13px]">
                                الطلبيات      
                                </div>
                            </th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {ordersElement}
                    </tbody>
                </table>
            </div>



        </div>
    )
}

export default Orders