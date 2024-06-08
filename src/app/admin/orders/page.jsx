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
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'

import Spinner from '../../../components/loadings/Spinner'


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

    const router = useRouter()

    const queryClient = useQueryClient()


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

    async function handleUpdatingOrder(id) {
        // setEditedOrder(pre => ({ ...pre, orders: newOrders }))
        console.log(editedOrder)
        setSaving(pre => ([...pre, id]))
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
                className="border-black relative border-2 font-medium p-2 pr-4 text-center h-8"
            >

                {order._id === editedOrderId
                    ?
                    <select
                        onChange={(e) => handleOptChange(e, i)}
                        name="option"
                        defaultValue={slectedOption}
                        className='min-w-10 border-2 border-black pl-1 dynamic-width'
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
                    className='min-w-16 m-auto w-16'
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
                    <div className='max-w-96 border-2 border-gray-500 absolute mt-2 bg-white z-50'>
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
                        className='min-w-10 mt-2 border-2 border-black pl-1 dynamic-width'
                    />
                    : <span
                        className="bg-red-500 absolute left-16 bottom-16 rounded-lg px-1 text-sm text-white text-center"
                    >
                        {product.qnt}
                    </span>
                }
            </td>
        )
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
                                    <FontAwesomeIcon icon={faTrashCan} />
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
                        <td>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="name"
                                defaultValue={editedOrder.name}
                                className='border-2 border-black pl-1 dynamic-width'
                            />
                        </td>
                        <td>
                            <input
                                type='text'
                                onChange={handleChange}
                                name="phoneNumber"
                                defaultValue={editedOrder.phoneNumber}
                                className='border-2 border-black pl-1 dynamic-width '
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="wilaya"
                                defaultValue={editedOrder.wilaya}
                                className='border-2 border-black pl-1 dynamic-width'
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="adresse"
                                defaultValue={editedOrder.adresse}
                                className='border-2 border-black pl-1 dynamic-width'
                            />
                        </td>
                        <td>
                            <select
                                value={editedOrder.shippingMethod}
                                onChange={handleChange}
                                className="border-2 border-black pl-1 "
                                name="shippingMethod"
                            >
                                <option value="بيت">بيت</option>
                                <option value="مكتب">مكتب</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="totalPrice"
                                defaultValue={editedOrder.totalPrice}
                                className='border-2 border-black pl-1 dynamic-width'
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="shippingPrice"
                                defaultValue={editedOrder.shippingPrice}
                                className='border-2 border-black pl-1 dynamic-width'
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                onChange={handleChange}
                                name="note"
                                defaultValue={editedOrder.note}
                                className='border-2 border-black pl-1 dynamic-width'
                            />
                        </td>
                        <td>
                            <select
                                onChange={handleChange}
                                value={editedOrder.state}
                                className="border-2 border-black pl-1 max-w-32"
                                name="state"
                            >
                                <option value="ordered">ordered</option>
                                <option value="confirmed">confirmed</option>
                                <option value="didntAnswer">didn&apos;t Answer</option>
                                <option value="canseled">cancelled</option>
                            </select>
                        </td>
                        <td>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className='border-2 border-black pl-1 dynamic-width'
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
                                className="border-2 border-black pl-1 max-w-32"
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
                                <div>
                                    {deleting.some(item => item.id === order._id && item.state)
                                        ? <Spinner size={'h-8 w-8'} color={'border-red-500'} containerStyle={'ml-6 -mt-3'} />
                                        : <button
                                            className=' p-2 rounded-md'
                                            onClick={() => handleDelete(order._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    }
                                    <button
                                        onClick={() => {
                                            setEditedOrderId(order._id)
                                            setEditedOrder(order)
                                        }}
                                        disabled={editedOrderId !== order._id && editedOrderId !== '' || saving.includes(order._id)}
                                        className={`ml-2 text-white 
                                         ${saving._id === order._id && saving.stat && 'w-8 h-10 relative'}
                                         ${deleting.some(item => item.id === order._id) && 'hidden'}
                                         rounded-lg px-3 py-2
                                      `}
                                    >
                                        <FontAwesomeIcon icon={faPen} className='text-black' />
                                    </button>
                                </div>
                            }
                        </td>
                        <td>{order.name}</td>
                        <td>{order.phoneNumber}</td>
                        <td>{order.wilaya}</td>
                        <td>{order.adresse}</td>
                        <td>{order.shippingMethod}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.shippingPrice}</td>
                        <td>{order.note}</td>
                        <td>{order.state}</td>
                        <td>{order.schedule}</td>
                        <td className="text-center">
                            {order.inDelivery
                                ? <FontAwesomeIcon icon={faCheck} className={`text-green-500`} />
                                : <FontAwesomeIcon icon={faX} className={`text-red-500`} />
                            }
                        </td>
                        <td>{order.tracking}</td>
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


    return (
        <div className="py-4 pl-4 pr-48 flex flex-col gap-5 h-screen overflow-x-auto w-full min-w-max">

            <Link
                href={'/admin/orders/add'}
                className='bg-gray-700 p-3 rounded-md text-white text-center'
            >
                Add
            </Link>

            <div
                className="flex items-center 2xl:max-w-7xl xl:max-w-5xl justify-start gap-12"
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

                <select
                    name="date"
                    onChange={handleDateFilterChange}
                    className="ml-auto capitalize border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer"
                >
                    {dateFilterElements}
                </select>
            </div>

            <table border='1' className='font-normal w-full ml-auto'>
                <thead>
                    <tr>
                        <th>تعديل</th>
                        <th>الأسم</th>
                        <th>الرقم</th>
                        <th>الولاية</th>
                        <th>البلدية</th>
                        <th>نوع التوصيل</th>
                        <th>سعر كلي </th>
                        <th>سعر توصيل</th>
                        <th>ملاحضة </th>
                        <th>الحالة </th>
                        <th>التأجيل</th>
                        <th>في التوصيل</th>
                        <th>التتبع</th>
                        <th colSpan={longesOrder.length}>الطلبيات</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersElement}
                </tbody>
            </table>
        </div>
    )
}

export default Orders