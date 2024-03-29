import mongoose from "mongoose"; 

const designSchem = new mongoose.Schema({
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
        default: 3900,
        required: false
    },
    tags: {
        type: Array,
        required: false
    },
},{timestamps: true})

const Design = mongoose.models.Design ||mongoose.model('Design', designSchem)

export default Design