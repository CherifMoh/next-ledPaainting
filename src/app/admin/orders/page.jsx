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


async function fetchOrders() {
    const res = await axios.get('http://localhost:3000/api/orders');
    return res.data;
}

function Orders() {
    
    typeof document !== 'undefined' && document.body.classList.add('bg-white')
    
    const { data: Orders, isLoading, isError } = useQuery({
        queryKey:['orders'],
        queryFn: fetchOrders
    });
    
    const [editedOrder,setEditedOrder] = useState({})
    
    const [editedOrderId,setEditedOrderId] = useState('')

    const [selectedDate, setSelectedDate] = useState(null);

    const [search,setSearch] = useState('')
    
    const queryClient = useQueryClient()

    useEffect(() => {        
            const inputs = document.querySelectorAll('.dynamic-width');
            inputs.forEach(input => {
                if(input.name !== 'schedule')input.style.width = `${(input.value.length+2)*9}px`;
            });
    }, [editedOrderId]);


    if (isLoading) return <div>Loading...</div>;
    
    if (isError) return <div>Error fetching Orders</div>;
    console.log(Orders)
    
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
    console.log(editedOrder)

    function handleDateChange(date) {

        setSelectedDate(date);
        const formattedDate = format(date, 'yyyy-MM-dd');
        setEditedOrder(prev => ({
            ...prev,
            schedule: formattedDate,
            tracking:'scheduled'

        }));
    }
    
    
    let longesOrder = []
    Orders.forEach(order=>{
        if(order.orders.length > longesOrder.length){
            longesOrder = order.orders
        }
        
    })
    
    async function handleUpdatingOrder(){
        const res = await axios.put(`http://localhost:3000/api/orders/${editedOrderId}`,editedOrder)
        
        queryClient.invalidateQueries('orders');
        setSelectedDate(null)

    }

    const ordersElement = Orders.map( order=>{
        if(
            search === ''||
            order.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            order.wilaya.toLowerCase().includes(search.toLocaleLowerCase()) ||
            order.adresse.toLowerCase().includes(search.toLocaleLowerCase()) 

        ){        
            let cartItemsElemnt
            if(order.orders){
                cartItemsElemnt = order.orders.map((product,i)=>{
                    return(
                        <td key={product.imageOn} className="border-black relative border-2 font-medium p-3 h-8">
                            <Image className='min-w-24 w-24' src={product.imageOn} width={24} height={24} alt="" />
                            
                            <span 
                            className="bg-red-500 absolute left-24 top-2 rounded-lg px-1 text-sm text-white text-center"
                            >
                                {product.qnt}
                            </span>
                        </td>
                )
            })
            }
            if (editedOrderId === order._id) {
                return(
                    <tr key={order._id} className='h-5'>
                        <td>
                            <button 
                            onClick={()=>{
                                handleUpdatingOrder()
                                orderIdToggel(order._id)
                            }}
                            className='px-3 py-2 bg-green-400 rounded-lg'
                            >
                                Save
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
                    <tr key={order._id} className='h-5'>
                        <td>
                            <button 
                            onClick={()=>{
                                setEditedOrderId(order._id)
                                setEditedOrder(order)
                            }}
                            disabled={editedOrderId !== order._id && editedOrderId !== ''}                        
                            className={`
                            ${editedOrderId !== order._id && editedOrderId !== ''
                            ?'bg-gray-200' 
                            : 'bg-green-400' }
                            rounded-lg px-3 py-2`}
                            >
                                Edit
                            </button>
                        </td>
                        <td>{order.name}</td>
                        <td>{order.phoneNumber}</td>
                        <td>{order.wilaya}</td>
                        <td>{order.adresse}</td>
                        <td>{order.shippingMethod}</td>
                        <td>{order.totalPrice}</td>
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