import mongoose,{Schema} from "mongoose";

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    accessibility: {
        type: Array,
        required: true
    },
     
},{timestamps:true})

const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema)

export default Role