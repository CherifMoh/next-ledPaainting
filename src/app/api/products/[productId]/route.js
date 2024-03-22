import Product from "../../../models/products"
import {dbConnect} from "../../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET(req,{params}) {
  try{
    await dbConnect()
    return Product.find({_id:params.productId})
    .then(result=> Response.json(result))
    .catch(err=>Response.json({message:err.message}))

    
  }catch(err){
    return new NextResponse("Error :" + err)
  }
  
}