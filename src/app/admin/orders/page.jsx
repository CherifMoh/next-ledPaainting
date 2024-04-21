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
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import {deleteOrder} from '../../actions/order'
import { useRouter } from "next/navigation";

import Spinner from '../../../components/loadings/Spinner'


async function fetchOrders() {
    const res = await axios.get('http://localhost:3000/api/orders');
    return res.data;
}

function Orders() {
    
    typeof document !== 'undefined' && document.body.classList.add('bg-white')

    const [deleting,setDeleting] = useState([])
    
    const { data: Orders, isLoading, isError } = useQuery({
        queryKey:['orders'],
        queryFn: fetchOrders
    });

    async function fetchProducts() {
        const res = await axios.get('http://localhost:3000/api/products/ledDesigns');
        return res.data;
    }

    const { data: Designs, isLoading:designsLoding, isError:designsIsError,error } = useQuery({
        queryKey:['AdminledDesigne'],
        queryFn: fetchProducts
    });
    
    const [editedOrder,setEditedOrder] = useState({})
    
    const [editedOrderId,setEditedOrderId] = useState('')

    const [selectedDate, setSelectedDate] = useState(null);

    const [search,setSearch] = useState('')
    
    const [isdesigns,setIsdesigns] = useState({_id:'',state : false})

    const [newOrders,setNewOrders] = useState({})

    const [scheduleQnt,setScheduleQnt] = useState()

    const [isSchedule,setIsSchedule] = useState(false)

    const [saving,setSaving] = useState([])

    const router = useRouter()

    const queryClient = useQueryClient()


    useEffect(() => {        
            const inputs = document.querySelectorAll('.dynamic-width');
            inputs.forEach(input => {
                if(input.name !== 'schedule')input.style.width = `${(input.value.length+2)*9}px`;
            });
    }, [editedOrderId]);

    useEffect(() => {        
        setNewOrders(editedOrder.orders)
    }, [editedOrder]);

    useEffect(() => {
        let newSchedule = 0       
        Orders?.forEach(order=>{
            const currentDate = format(new Date(), 'yyyy-MM-dd');
    
            // Check if the saved date is the same as today
            const isSameAsToday = order.schedule === currentDate;
            if(isSameAsToday) newSchedule++    
        })
        setScheduleQnt(newSchedule)
    }, [editedOrder, Orders]);




    if (isLoading) return <div>Loading...</div>;
    
    if (isError) return <div>Error fetching Orders</div>;
    if (designsLoding) return <div>Loading...</div>;
    
    if (designsIsError) return <div>Error fetching Designs</div>;
    
    function orderIdToggel(id){
        if(editedOrderId === id){
            setEditedOrderId('')
        }else{
            setEditedOrderId(id)
        }
    }
    
    function handleChange(e) {
        const input = e.target
        
        const name = input.name;
        const value = input.value;

        if(name !== 'schedule')input.style.width = `${(input.value.length+2)*9}px`;
        setEditedOrder(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleQntChange(e,i) {
        const input = e.target

        
        const name = input.name;
        const value = input.value;

        input.style.width = `${(input.value.length+2)*9}px`;

        setNewOrders(pre =>{
            pre[i] = {...pre[i],[name]:value}
            return pre
        });
    }

    function handleOptChange(e,i) {
        const input = e.target
        const name = input.name;
        const value = input.value;

        input.style.width = `${(input.value.length+4)*10}px`;

        
        setNewOrders(pre =>{
            const newOption = pre[i].options.map(option=>{
                if(option.title === value){
                    return {...option,selected:true}
                }
                if(option.selected){
                    return {...option,selected:false}
                }
                return option
            })
            pre[i] = {...pre[i],options:newOption}
            return pre
        });
    }

    function handleDateChange(date) {

        setSelectedDate(date);
        const formattedDate = format(date, 'yyyy-MM-dd');
        setEditedOrder(prev => ({
            ...prev,
            schedule: formattedDate,
            tracking:'scheduled'

        }));
    }

    async function handleDelete(id){
        setDeleting(pre=>([...pre,{
            id:id,
            state:true
        }]))
        setEditedOrderId('')
        await deleteOrder(id)
        router.refresh()
        router.push('/admin/orders')
        queryClient.invalidateQueries('AdminledDesigne');
    }
    
    let longesOrder = []
    Orders.forEach(order=>{
        if(order.orders.length > longesOrder.length){
            longesOrder = order.orders
        }
        
    })
    
    async function handleUpdatingOrder(id){
        setEditedOrder(pre=>({...pre,orders:newOrders}))
        setSaving(pre=>([...pre,id]))
        const res = await axios.put(`http://localhost:3000/api/orders/${editedOrderId}`,editedOrder)
        
        queryClient.invalidateQueries('orders');
        setSelectedDate(null)
        setSaving(pre=>{
            const nweSaving = pre.filter(SId=>SId!==id)
            return nweSaving
        })

    }
    

    const ordersElement = Orders.map( order=>{
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        if(
            search === '' && !isSchedule||
            search !== '' && !isSchedule && order.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            search !== '' && !isSchedule && order.wilaya.toLowerCase().includes(search.toLocaleLowerCase()) ||
            search !== '' && !isSchedule && order.phoneNumber.includes(search.toLocaleLowerCase()) ||
            search !== '' && !isSchedule && order.adresse.toLowerCase().includes(search.toLocaleLowerCase())||
            isSchedule && order.schedule === currentDate

        ){        
            let cartItemsElemnt
            if(order.orders){
                cartItemsElemnt = order.orders.map((product,i)=>{
                    const optionElement = product.options.map(option=>{
                        return(
                            <option 
                             value={option.title}
                             key={option.title} 
                             className="p-2"
                            >
                                {option.title}
                            </option>
                        )
                    })
                    let slectedOption
                    product.options.forEach(option=>{
                        if(option.selected){
                            slectedOption = option.title
                        }
                    })
                    const designOptionsElent = Designs.map(design=>{
                        if(design.title.toLowerCase().includes(search.toLocaleLowerCase() ) ||search === '' ){
                            return(
                                <div key={design._id} className='border-gray-500 border-b-2 p-4 bg-white'>
                                    <Image 
                                    src={design.imageOn} 
                                    alt='' 
                                    width={128} height={128}  
                                    onClick={()=>{
                                        setNewOrders(pre=>{
                                            pre[i] = {...pre[i],imageOn:design.imageOn}
                                            return pre
                                        })
                                        setIsdesigns({_id:'',state : false})
                                    }}
                                    /> 
                                </div>
                            )
                        }
                       
                    })
                    return(
                        <td key={product._id} className="border-black relative border-2 font-medium p-3 text-center h-8">
                            {order._id === editedOrderId
                                ?
                                <select 
                                 onChange={(e)=>handleOptChange(e,i)} 
                                 name="option"
                                 defaultValue={slectedOption} 
                                 className='min-w-10 mt-2 border-2 border-black pl-1 dynamic-width'
                                >
                                    {optionElement}
                                </select>
                                :
                                <div 
                                className="mb-4 "
                                >
                                    {slectedOption}
                                </div>
                            }

                            <Image 
                             className='min-w-24 w-24' 
                             src={product.imageOn} 
                             width={24} height={24} alt=""
                             key={product._id} 
                             onClick={()=>{
                                if(order._id === editedOrderId){
                                   setIsdesigns(pre=>({
                                    _id:product._id,
                                    state:!pre.state
                                   })) 
                                } 
                             }}
                            />
                            {isdesigns.state && isdesigns._id === product._id &&
                                 <div className='max-w-96 border-2 border-gray-500 absolute mt-2 bg-white'>
                                    <div className='flex justify-center mt-2 border-b-2 border-gray-500'>
                                        <FontAwesomeIcon 
                                        icon={faMagnifyingGlass}
                                        className={`pointer-events-none absolute left-60 top-6 ${search?'hidden':'opacity-50'}`}
                                        />
                                        <input 
                                        id="search"
                                        type='search' 
                                        className='w-64 px-2 py-1 m-2 rounded-xl border-2 border-gray-500 no-focus-outline text-black bg-stone-200' 
                                        placeholder={`Search`}
                                        onChange={(e)=>setSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className='grid grid-cols-2 max-h-[484px] overflow-y-auto'>
                                        {designOptionsElent}
                                    </div>
                                </div>
                            }
                            
                            {order._id === editedOrderId
                            ?<input 
                             type="number" 
                             onChange={(e)=>handleQntChange(e,i)} 
                             name="qnt"
                             defaultValue={product.qnt} 
                             min={1}
                             className='min-w-10 mt-2 border-2 border-black pl-1 dynamic-width'
                            />
                            :<span 
                                className="bg-red-500 absolute left-24 bottom-24 rounded-lg px-1 text-sm text-white text-center"
                            >
                                {product.qnt}
                            </span>
                            }
                        </td>
                )
            })
            }
            if (editedOrderId === order._id) {
                return(
                    <tr key={order._id} className={`h-5`}>
                        <td>
                           
                            <button 
                            onClick={()=>handleDelete(order._id)}
                            className='px-3 py-2 text-white bg-red-500 rounded-lg'
                            >
                                {deleting.some(item => item.id === order._id && item.state)?'Deleting':'Delete'}
                            </button>
                            <button 
                            onClick={()=>{
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
                                <option  value="ordered">ordered</option>
                                <option  value="confirmed">confirmed</option>
                                <option  value="didntAnswer">didn&apos;t Answer</option>
                                <option  value="canseled">cancelled</option>
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
                            onChange={()=>setEditedOrder(pre=>({
                                ...pre,
                                inDelivery:!pre.inDelivery
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
                                <option value="delivered">delivered</option>
                                <option value="scheduled">scheduled</option>
                                <option value="returned">returned</option>
                            </select>
                        </td>
                        {cartItemsElemnt}
                    </tr>
                )
            }else{
                return(
                    <tr key={order._id} className={`h-5 ${saving.includes(order._id) && 'opacity-40 pointer-events-none'}`}>
                        <td>
                        {saving.includes(order._id)
                            ?
                            <Spinner size={'w-8 h-8'} color={'border-green-500'}  containerStyle={'ml-14 mb-10'}/>
                            :
                            <div>
                            <button 
                             disabled={editedOrderId !== order._id && editedOrderId !== '' || saving.includes(order._id)} 
                             onClick={()=>handleDelete(order._id)}
                             className='disabled:bg-red-200 text-white px-3 py-2 bg-red-500 rounded-lg'
                            >
                                {deleting.some(item => item.id === order._id && item.state)?'Deleting':'Delete'}
                            </button>
                           
                            <button 
                            onClick={()=>{
                                setEditedOrderId(order._id)
                                setEditedOrder(order)
                            }}
                            disabled={editedOrderId !== order._id && editedOrderId !== '' || saving.includes(order._id)}                        
                            className={`disabled:bg-green-100 ml-2 text-white bg-green-400 ${saving._id === order._id && saving.stat && 'w-8 h-10 relative'} rounded-lg px-3 py-2`}
                            >
                                Edit
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
                        <td className="text-center">{order.inDelivery?'true':'false'}</td>
                        <td>{order.tracking}</td>
                        {cartItemsElemnt}
                    </tr>
                )

            }
        }
    })


  return (
    <div className="p-4 flex flex-col gap-5 h-screen overflow-x-auto w-full min-w-max">
        
        <Link 
         href={'/admin/orders/add'}
         className='bg-gray-700 p-3 rounded-md text-white text-center'
        >
            Add
        </Link>

        <div className=" flex items-center gap-12">
            <div className='flex gap-4'>
                <div className='relative'>
                    <FontAwesomeIcon 
                        icon={faMagnifyingGlass}
                        className={`absolute left-72 top-0 pt-3 z-10 ${search?'hidden':'opacity-50'}`}
                    />
                    <input 
                    onChange={e=>setSearch(e.target.value)}
                    type="search" 
                    placeholder="Search"
                    className='w-80 p-2 border-2 border-gray-500 rounded-xl no-focus-outline'
                    />
                </div>
            </div>

            <div 
             className='relative border-gray-500 border-2 p-2 px-4 rounded-xl cursor-pointer'
             onClick={()=>setIsSchedule(pre=>!pre)}
            >
                <div 
                 className='absolute -right-3 -top-3 bg-red-500 px-2 rounded-full text-white'
                >
                    {scheduleQnt}
                </div>
                <div
                >Scheduled</div>
            </div>
        </div>

        <table border='1' className='font-normal w-full ml-auto'>
            <thead>
                <tr>
                    <th>Edit</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Wilaya</th>
                    <th>Address</th>
                    <th>Shipping Method</th>
                    <th>Total Price</th>
                    <th>Shipping Price</th>
                    <th>Notes</th>
                    <th>State</th>
                    <th>Schedule</th>
                    <th>In Delivery</th>
                    <th>tracking</th>
                    <th colSpan={longesOrder.length}>Orders</th>
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