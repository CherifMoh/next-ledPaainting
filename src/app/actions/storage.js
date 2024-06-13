'use server'

import RewMates from "../models/rewMates"
import { dbConnect } from "../lib/dbConnect"

export async function addRewMates(formData){ 
    await dbConnect()
    RewMates.create(formData)   
}

export async function deleteRewMate(id){
    await dbConnect()
    const res = await RewMates.findByIdAndDelete(id) 
    return res       
}
export async function editRewMate(id,newRewMate){
    await dbConnect()
    const newDocument = await RewMates.findByIdAndUpdate(id, newRewMate, { new: true })
    return newDocument       
}
