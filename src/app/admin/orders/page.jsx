"use client"

import axios from "axios";
import { useQuery } from '@tanstack/react-query';

async function fetchOrders() {
    const res = await axios.get('http://localhost:3000/api/orders');
    return res.data;
}


function Orders() {

    const { data: Orders, isLoading, isError } = useQuery({
            queryKey:['orders'],
            queryFn: fetchOrders
    });
    if (isLoading) return <div>Loading...</div>;
    
    if (isError) return <div>Error fetching Orders</div>;

    const ordershElement = Orders.map( (order,i)=>{
        return order.imagesOn.map((img,i)=>{
            
            return(
                <th key={i} className="border-black border-2 font-medium p-3">
                product {i}
            </th>
        )
        })
    })
    const ordersElement = Orders.map( order=>{
        let cartItemsElemnt
        if(order.imagesOn){
            cartItemsElemnt = order.imagesOn.map(imageOn=>{
                console.log(imageOn)
                return(
                    <th key={imageOn.imageOn} className="border-black border-2 font-medium p-3">
                        <img className='w-36' src={imageOn.imageOn} alt="" />
                    </th>
            )
        })
    }
        return(
        <tr key={order._id} className="border-black border-2 font-medium ">
            <th className="border-black border-2 font-medium p-3">{order.name}</th>
            <th className="border-black border-2 font-medium p-3">{order.phoneNumber}</th>
            <th className="border-black border-2 font-medium p-3">{order.wilaya}</th>
            <th className="border-black border-2 font-medium p-3">{order.adresse}</th>
            <th className="border-black border-2 font-medium p-3">{order.shippingMethod}</th>
            <th className="border-black border-2 font-medium p-3">{order.totalPrice}</th>
            {cartItemsElemnt}
        </tr>)
    })
  return (
    <table border='1' className='border-black border-2 font-normal'>
        <thead>
            <tr className="border-black border-2 font-medium">
                <th className="border-black border-2 font-medium p-3">Name</th>
                <th className="border-black border-2 font-medium p-3">Phone Number</th>
                <th className="border-black border-2 font-medium p-3">Wilaya</th>
                <th className="border-black border-2 font-medium p-3">Address</th>
                <th className="border-black border-2 font-medium p-3">Shipping Method</th>
                <th className="border-black border-2 font-medium p-3">Total Price</th>
                {ordershElement}
            </tr>
        </thead>
        <tbody>
            {ordersElement}
        </tbody>
    </table>
  )
}

export default Orders