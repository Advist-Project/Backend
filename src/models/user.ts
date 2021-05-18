import mongoose from 'mongoose'

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
    email: {
        required: true,
        type: String
    },
    thumbnail: {
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
    company: {
        required: false,
        type: String
    },
    jobDepartment: {
        required: false,
        type: String
    },
    career: {
        required: false,
        type: String
    },
    orderIds: [{
        required: false,
        type: Number
    }], //구매내역
    likeItemIds: [{
        required: false,
        type: Number
    }] //찜한내역

})

export default mongoose.model("User", user)