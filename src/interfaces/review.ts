import { Document } from "mongoose"

export default interface Review extends Document {
    reviewId: number,
    userId: number,
    userEmail: string,
    userName: string, //로그인 시 받는 이름
    orderInfo: {
        orderId: number,
        itemId: number,
        itemOwner: string, //코치
        itemName: string,
        optionId: number,
        optionName: string
    },
    score: number,
    good: [string], //엄지척
    bad: [string],
    content: string,
    deletYN: boolean,
    createdAt: string
}
