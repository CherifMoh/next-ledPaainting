import mongoose,{Schema} from "mongoose";

const RewMatesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    qnt: {
        type: Number,
        default:1
    },
},{timestamps:true})

const RewMates = mongoose.models.RewMates || mongoose.model('RewMates', RewMatesSchema)

export default RewMates