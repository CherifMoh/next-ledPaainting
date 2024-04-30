import User from "../../../models/users"
import {dbConnect} from "../../../lib/dbConnect"
import { NextResponse } from "next/server"



export async function DELETE(req,{params}) {
  try{
    await dbConnect()
    return User.deleteOne({_id:params.productId})
    .then(result=> Response.json(result))
    .catch(err=>Response.json({message:err.message}))
  }catch(err){
    return new NextResponse("Error :" + err)
  }
  
}

export async function PUT(req,{params}) {
  try{
    await dbConnect()
    const newProduct = await req.json()
    await User.findByIdAndUpdate({_id:params.productId},newProduct)

    return new NextResponse("Product Updated ")

  }catch(err){
    return new NextResponse("Error :" + err)
  }
  
}