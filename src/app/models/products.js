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
    description: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sales: {
        type: Array,
        required: true
    },
    parts: {
        type: Array,
        required: true
    },
    gallery: {
        type: Array,
        required: true
    },
    dropDowns: {
        type: Array,
        required: true
    },
},{timestamps: true})

const Product = mongoose.models.Product ||mongoose.model('Product', productSchem)

export default Product