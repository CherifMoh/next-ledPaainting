'use server'

import Product from "../models/products"
import { dbConnect } from "../lib/dbConnect"


export async function addProduct(newProduct){ 
    try{
        await dbConnect()
    
        Product.create(newProduct)
    
        return "product created " + newProduct.title
    
      }catch(err){
        return "Error :" + err
      } 
}

export async function deleteProduct(id){
    await dbConnect()
    const res = await Product.findByIdAndDelete(id)

    return res
}