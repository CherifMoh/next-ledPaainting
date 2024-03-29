import Design from "../../../../models/design"
import {dbConnect} from "../../../../lib/dbConnect"
import { NextResponse } from "next/server"

export async function DELETE(req,{params}) {
    try{
      await dbConnect()
      await Design.findByIdAndDelete({_id:params.designId})
  
      return new NextResponse("Design Deleted ")
  
    }catch(err){
      return new NextResponse("Error :" + err)
    }
    
}