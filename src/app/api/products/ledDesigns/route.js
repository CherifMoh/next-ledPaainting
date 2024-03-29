
import Design from "../../../models/design"
import {dbConnect} from "../../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET() {
  try{
    await dbConnect()
    return Design.find()
    .then(result=> Response.json(result))
    .catch(err=>Response.json({message:err.message}))

    
  }catch(err){
    return new NextResponse("Error :" + err)
  }
  
}

export async function POST(req) {
  try{
    await dbConnect()
    
    const design = await req.json()
    console.log(design.tages)
    Design.create(design)

    return new NextResponse("Design created " + design.title)

  }catch(err){
    return new NextResponse("Error :" + err)
  }
  
}

