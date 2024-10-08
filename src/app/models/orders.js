import mongoose from "mongoose"; 

const OrderSchem = new mongoose.Schema({
    reference: {
        type: String,
        required: true
    },
    TslTracking: {
        type: String,
        required: false,
        default: ''
    },
    name: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    blackListed: {
        type: Boolean,
        default: false
    },
    instaUserName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    wilaya: {
        type: String,
        required: false
    },
    commune: {
        type: String,
        required: false
    },
    adresse: {
        type: String,
        required: false
    },
    shippingMethod: {
        type: String,
        required: false
    },
    shippingPrice: {
        type: Number,
        required: false
    },
    totalPrice: {
        type: Number,
        required: false
    },
    orders: {
        type: Array,
        required: false
    },
    state:{
        type: String,
        default: 'غير مؤكدة'
    },
    schedule:{
        type: String,
        default: ''
    },
    deliveryNote:{
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
    note:{
        type: String,
        default: ''
    },
    
},{timestamps: true})

const Order = mongoose.models.Order ||mongoose.model('Order', OrderSchem)

export default Order