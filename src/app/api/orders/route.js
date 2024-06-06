
import Order from "../../models/orders"
import { dbConnect } from "../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET() {
  try {

    await dbConnect()
    const result = await Order.find().sort({ _id: -1 })
    return Response.json(result)

  } catch (err) {
    return new NextResponse("Error :" + err)
  }

}
export async function POST(req) {
  try {
    await dbConnect()

    const order = await req.json()

    Order.create(order)

    return new NextResponse("Order created ")

  } catch (err) {
    return new NextResponse("Error :" + err)
  }

}


