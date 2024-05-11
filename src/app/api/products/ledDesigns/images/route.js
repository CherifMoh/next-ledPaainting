
import Design from "../../../../models/design"
import { dbConnect } from "../../../../lib/dbConnect"
import { NextResponse } from "next/server"


export async function GET() {
  try {
    await dbConnect()
    const result = await Design.find({}, 'imageOn').sort({ _id: -1 })
    return Response.json(result)


  } catch (err) {
    return new NextResponse("Error :" + err)
  }

}

