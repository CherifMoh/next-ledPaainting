
import Order from "../../../models/orders"
import { dbConnect } from "../../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET() {
  try {

    await dbConnect()
    const result = await Order.find().sort({ _id: -1 }).select('tracking')
    return Response.json(result)

  } catch (err) {
    return new NextResponse("Error :" + err)
  }

}
