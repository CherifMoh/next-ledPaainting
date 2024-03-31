import Order from "../../../models/orders"
import {dbConnect} from "../../../lib/dbConnect"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache";

export async function PUT(req,{params}) {
    try{
      await dbConnect()
  
      const NewOrder = await req.json()
      const id = params.orderId
  
      const newDocument = await Order.findByIdAndUpdate(id , NewOrder , {new: true})

      revalidatePath('/admin/orders')
      return new NextResponse("Order Updated "+newDocument)
  
    }catch(err){
      return new NextResponse("Error :" + err)
    }
    
  }