import Workshop from "../../../models/workshop"
import {dbConnect} from "../../../lib/dbConnect"
import { NextResponse } from "next/server"

export async function GET(){
    try{
        await dbConnect()

        const result = await Workshop.find()

        return Response.json(result)
    }catch(err){
        return new NextResponse("Error :" + err)
    }
}

// export async function POST(req) {
//     try{
//       await dbConnect()
      
//       const rewMates = await req.json()
  
//       Workshop.create(rewMates)
  
//       return new NextResponse("rew Mate created ")
  
//     }catch(err){
//       return new NextResponse("Error :" + err)
// }
    
// }