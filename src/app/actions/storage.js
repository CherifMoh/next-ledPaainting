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
export async function editAddRewMateQnt(id,newQnts){
    await dbConnect()
    
    let result = await RewMates.findById(id)
    result.qnts =[...result.qnts, newQnts]
    const newDocument = await RewMates.findByIdAndUpdate(id, result, { new: true })

    return newDocument       
}

export async function editMinusRewMateQnt(id,newQnt){

    let result = await RewMates.findById(id);
 
    if (!result || !result.qnts || !result.qnts.length) {
        console.log('No data found or qnts array is empty');
        return;
    }

    // Convert qnt values to numbers since they are strings in the database
    let qnts = result.qnts.map(item => ({
        price: item.price,
        qnt: Number(item.qnt)
    }));

    // Process the qnts array from the last element to the first
    for (let i = qnts.length - 1; i >= 0 && newQnt > 0; i--) {
        if (qnts[i].qnt <= newQnt) {
            newQnt -= qnts[i].qnt;
            qnts.splice(i, 1);  // Remove the element from the array
        } else {
            qnts[i].qnt -= newQnt;
            newQnt = 0;
        }
    }

    // Convert qnt values back to strings before updating the database
    qnts = qnts.map(item => ({
        price: item.price,
        qnt: item.qnt.toString()
    }));

    // Save the updated qnts array back to the database
    result.qnts = qnts;

    const newDocument = await RewMates.findByIdAndUpdate(id, result, { new: true })

    return newDocument;
}
