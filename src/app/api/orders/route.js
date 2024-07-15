
import Order from "../../models/orders"
import { dbConnect } from "../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET() {
  try {

    await dbConnect()
    const startDate = new Date("2024-07-14T00:00:00.000Z");
    const endDate = new Date("2024-07-15T00:00:00.000Z");

    const result = await Order.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate
      }
    }).sort({ _id: -1 });

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


