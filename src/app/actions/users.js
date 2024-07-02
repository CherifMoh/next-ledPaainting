'use server'

import User from "../models/users"
import Role from "../models/roles"
import { dbConnect } from "../lib/dbConnect"
import { cookies } from "next/headers"

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

export async function createRole(newRole) {

    await dbConnect();

    try {
        await Role.create(newRole);
        
        return 'created';
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}

export async function deleteRole(id) {
    

    try {
        await dbConnect();

        await Role.findByIdAndDelete(id);

        return 'deleted';
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}

export async function updateRole(id,newRole) {
    

    try {
        await dbConnect();

        await Role.findByIdAndUpdate(id,newRole,{new:true});

        return 'updated';
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}

export async function dleleteCookies() {
    cookies().delete('access-token')
    cookies().delete('user-email')
}

