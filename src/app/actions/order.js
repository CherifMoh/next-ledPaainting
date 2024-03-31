'use server'

import Order from "../models/orders"
import { dbConnect } from "../lib/dbConnect"

export async function addOrder(formData){
    await dbConnect()

    Order.create(formData)
}
