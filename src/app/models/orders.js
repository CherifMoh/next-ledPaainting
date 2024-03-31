import mongoose from "mongoose"; 

const OrderSchem = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    wilaya: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    shippingMethod: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orders: {
        type: Array,
        required: true
    },
    state:{
        type: String,
        default: 'ordered'
    },
    schedule:{
        type: String,
        default: ''
    },
    inDelivery:{
        type: Boolean,
        default: false
    },
    tracking:{
        type: String,
        default: ''
    },
    
},{timestamps: true})

const Order = mongoose.models.Order ||mongoose.model('Order', OrderSchem)

export default Order