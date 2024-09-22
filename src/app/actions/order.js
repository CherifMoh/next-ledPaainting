'use server'

import Order from "../models/orders"
import BlackList from "../models/blackLists"
import { dbConnect } from "../lib/dbConnect"

export async function addOrder(formData){ 
    await dbConnect()
    Order.create(formData)   
}

export async function deleteOrder(id){
    await dbConnect()
    const res = await Order.findByIdAndDelete(id)        
}

export async function addToBlackList(ip,phoneNumber) {
  try {
    await dbConnect()


    // Find the blacklist entry with name 'IP'
    const blacklist = await BlackList.findOne({ name: 'IP' });

    if (!blacklist) {
        // If no blacklist entry exists, create one
        await BlackList.create({
            name: 'IP',
            ip: [{ip: ip,phoneNumber:phoneNumber}]
        });
    } else {
        // If blacklist entry exists, add the IP address if it's not already present
        if (!blacklist.ip.includes(ip)) {
            blacklist.ip.push({ip: ip,phoneNumber:phoneNumber});
            await blacklist.save();
        }
    }

    const userName = await getUserNameByEmail(cookies().get('user-email').value)
   
    AddToArchive({
        user: userName,
        tracking: phoneNumber,
        action: "أُضيف إلى القائمة السوداء",
    });

    return {sucsess: true, message: "IP added to blacklist"}

  } catch (err) {
    return {sucsess: false, err:err}
  }
}

export async function addAbandonedCheckout(order) {
  try {
    await dbConnect();

    const oldOrders = await Order.find({ phoneNumber: order.phoneNumber, state:'abandoned' });

    const newOrder ={
      ...order,
      state:'abandoned',
    }

    if (!oldOrders || oldOrders.length === 0) {
      // If no order exists, create one
      await Order.create(newOrder);
    } else {

      for (const oldOrder of oldOrders) {
        await Order.findByIdAndDelete(oldOrder._id);
      }
      // Delete the old orders and create a new one
      await Order.create(newOrder);
    }

    return 'updated';
  } catch (err) {
    return err;
  }
}

export async function getOrder(methode, value){
    await dbConnect()
    const res = await Order.find({[methode]: value}).sort({ _id: -1 })    
    const formattedRes = res.map(order => {
        return {
          ...order._doc,
          createdAt: order.createdAt.toISOString(),  // or any other date format
          updatedAt: order.updatedAt.toISOString()   // or any other date format
        };
      }); 
    return formattedRes
}