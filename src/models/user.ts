import mongoose from 'mongoose';

const user = new mongoose.Schema({
    googleId: {
        required: false,
        type: String
    },
    kakaoId: {
        required: false,
        type: String
    },
    naverId: {
        required: false,
        type: String
    },
    userId: {
        required: false,
        type: Number
    },
    username: {
        required: false,
        type: String
    },
    email:{
        required: true,
        type: String
    },
    thumbnail:{
        required: false,
        type: String
    },
    name: {
        required: false,
        type: String
    },
    phone: {
        required: false,
        type: String
    },
   
});

export default mongoose.model("User", user);