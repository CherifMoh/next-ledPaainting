
import Order from "../../../models/orders"
import { dbConnect } from "../../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET() {
  try {

    await dbConnect();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await Order.find({
      tracking: 'delivered',
      updatedAt: { $gte: oneWeekAgo }
    }).sort({ _id: -1 }).select('updatedAt');

    return Response.json(result)

  } catch (err) {
    return new NextResponse("Error :" + err)
  }

}
