import { NextResponse } from 'next/server'
import Role from '../../../models/roles'
import {dbConnect} from '../../../lib/dbConnect'

export async function GET() {
    try {
  
      await dbConnect()
      const result = await Role.find()

      return Response.json(result)
  
    } catch (err) {
      return new NextResponse("Error :" + err)
    }
  
}