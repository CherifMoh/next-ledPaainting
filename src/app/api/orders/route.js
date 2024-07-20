
import Order from "../../models/orders"
import { dbConnect } from "../../lib/dbConnect"
import { NextResponse } from "next/server"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays } from 'date-fns';


export async function GET(req) {
  try {
    await dbConnect();

    const dateFilter = req.nextUrl.searchParams.get('date');
    let query = {};

    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);

    if (dateFilter === 'today') {
      query = {
        createdAt: {
          $gte: startToday,
          $lte: endToday,
        },
      };
    } else if (dateFilter === 'yesterday') {
      const startYesterday = startOfDay(subDays(today, 1));
      const endYesterday = endOfDay(subDays(today, 1));
      query = {
        createdAt: {
          $gte: startYesterday,
          $lte: endYesterday,
        },
      };
    } else if (dateFilter === 'thisWeek') {
      query = {
        createdAt: {
          $gte: startOfWeek(today),
          $lte: endOfWeek(today),
        },
      };
    } else if (dateFilter === 'maximum') {
      // No additional filtering needed for 'maximum'
    } else {
      // Default to return all orders if no valid date filter is provided
    }

    const result = await Order.find(query).sort({ _id: -1 });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.error({ message: "Error: " + err });
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


