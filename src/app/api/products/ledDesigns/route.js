
import Design from "../../../models/design"
import { dbConnect } from "../../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET(req) {
  const pageNum = req.nextUrl.searchParams.get('page')
  const page = parseInt(pageNum) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  try {
    await dbConnect()

    const posts = await Design.find().skip(skip).limit(limit);
    const total = await Design.countDocuments();
    const hasNextPage = skip + posts.length < total;

    return Response.json({
      data: posts,
      nextPage: hasNextPage ? page + 1 : null,
    })


  } catch (err) {
    return new NextResponse("Error :" + err.message)
  }

}

export async function POST(req) {
  try {
    await dbConnect()

    const design = await req.json()
    console.log(design.tages)
    Design.create(design)

    return new NextResponse("Design created " + design.title)

  } catch (err) {
    return new NextResponse("Error :" + err)
  }

}

