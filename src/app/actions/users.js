'use server'

import User from "../models/users"
import { dbConnect } from "../lib/dbConnect"

// export async function addUser(formData) {
//     await dbConnect()
//     Order.create(formData)
// }

export async function deleteUser(id) {
    await dbConnect()
    const res = await User.findByIdAndDelete(id)
}