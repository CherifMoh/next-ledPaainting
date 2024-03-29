"use client"

import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { useState } from "react";

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

    const [editedOrder,setEditedOrder] = useState('')

    const [editedOrderId,setEditedOrderId] = useState('')

    if (isLoading) return <div>Loading...</div>;
    
    if (isError) return <div>Error fetching Orders</div>;

    function orderIdToggel(id){
        if(editedOrderId === id){
            setEditedOrderId('')
        }else{
            setEditedOrderId(id)
        }
    }

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setEditedOrder(prev => ({
            ...prev,
            [name]: value
        }));
    }

    console.log(editedOrder)

    let longesOrder = []
    Orders.forEach(order=>{
        if(order.imagesOn.length > longesOrder.length){
            longesOrder = order.imagesOn
        }
    })

    const ordersElement = Orders.map( order=>{
        let cartItemsElemnt
        if(order.imagesOn){
            cartItemsElemnt = order.imagesOn.map((imageOn,i)=>{
                return(
                    <td key={imageOn.imageOn} className="border-black relative border-2 font-medium p-3 h-8">
                        <img className='min-w-24 w-24' src={imageOn.imageOn} alt="" />
                        
                        <span 
                         className="bg-red-500 absolute left-24 top-2 rounded-lg px-1 text-sm text-white text-center"
                        >
                            {order.orders[i].qnt}
                        </span>
                    </td>
            )
        })
        }
        if (editedOrderId === order._id) {
            return(
                <tr key={order._id} className='h-5 flex-none'>
                    <td>
                        <button 
                        onClick={()=>orderIdToggel(order._id)}
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
                         defaultValue={order.name} 
                         className='border-2 border-black pl-1 w-min'
                        />
                    </td>
                    <td>
                        <input 
                         type='number'
                         onChange={handleChange} 
                         name="phoneNumber"
                         defaultValue={order.phoneNumber} 
                         className='border-2 border-black pl-1 w-min ' 
                        />
                    </td>
                    <td>
                        <input 
                         type="text"
                         onChange={handleChange} 
                         name="wilaya"
                         defaultValue={order.wilaya} 
                         className='border-2 border-black pl-1 w-min' 
                        />
                    </td>
                    <td>
                        <input 
                         type="text"
                         onChange={handleChange} 
                         name="adresse"
                         defaultValue={order.adresse} 
                         className='border-2 border-black pl-1 w-min' 
                        />
                    </td>
                    <td>
                        <select 
                         value={order.shippingMethod} 
                         className="border-2 border-black pl-1 w-min" name="shippingmethod" 
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
                         defaultValue={order.totalPrice} 
                         className='border-2 border-black pl-1 w-min' 
                        />
                    </td>
                    <td>
                        <select 
                         value={order.state} 
                         className="border-2 border-black pl-1 max-w-32" name="shippingmethod"  
                        >
                            <option name='state' value="ordered">ordered</option>
                            <option name='state' value="confirmed">confirmed</option>
                            <option name='state' value="didntAnswer">didn't Answer</option>
                            <option name='state' value="canseled">canseled</option>
                        </select>
                    </td>
                    <td>{order.schedule}</td>
                    <td className="text-center">
                        <input type='checkbox' defaultChecked={order.inDelivery} />
                    </td>
                    <td>
                        <select 
                         value={order.tracking} 
                         className="border-2 border-black pl-1 max-w-32" name="shippingmethod"  
                        >
                            <option name='tracking' value="ordered">delivered</option>
                            <option name='tracking' value="confirmed">scheduled</option>
                            <option name='tracking' value="didntAnswer">returned</option>
                        </select>
                    </td>
                    {cartItemsElemnt}
                </tr>
            )
        }else{
            return(
                <tr key={order._id} className='h-5 flex-none'>
                    <td>
                        <button 
                        onClick={()=>{
                            setEditedOrderId(order._id)
                            setEditedOrder(order)
                        }}
                        className='px-3 py-2 bg-green-400 rounded-lg'
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
    })


  return (
    <div className="flex items-center justify-center h-screen overflow-x-auto w-full min-w-max">
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