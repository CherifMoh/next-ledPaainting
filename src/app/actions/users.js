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

export async function editeUserPfp(email, pfp) {
    await dbConnect();

    if (!pfp) return;

    try {
        console.log(pfp);

        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $set: { pfp: pfp } },
            { new: true }
        );

        return updatedUser;
    } catch (error) {
        console.error("Error updating user profile picture:", error);
        throw error;
    }
}
