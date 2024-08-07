import mongoose,{Schema} from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        required: false,
        default: 'https://drawlys.com:8444/images/pfp-defult.png'
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fcmTokens: {
        type: Array,
        required: false
    }
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User