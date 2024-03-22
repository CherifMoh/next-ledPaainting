import mongoose from "mongoose"; 

const productSchem = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageOn: {
        type: String,
        required: true
    },
    imageOff: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 4500
    },
},{timestamps: true})

const Product = mongoose.models.Product ||mongoose.model('Product', productSchem)

export default Product