import mongoose, { Schema } from "mongoose"
import Counter from "../interfaces/review"

const reviewSchema: Schema = new Schema({
    reviewId: { type: Number, required: true },
    userId: { type: Number, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: false },
    orderInfo: {
        orderId: { type: Number, required: true },
        itemId: { type: Number, required: true },
        itemOwner: { type: String, required: true }, //코치
        itemName: { type: String, required: true },
        optionId: { type: Number, required: true },
        optionName: { type: String, required: true }
    },
    score: { type: Number, required: true },
    good: [{ type: String, required: false }], //엄지척
    bad: [{ type: String, required: false }],
    content: { type: String, required: false },
    deletYN: { type: Boolean, required: true },
    createdAt: { type: String, required: true }
})
export default mongoose.model<Counter>("Review", reviewSchema)
