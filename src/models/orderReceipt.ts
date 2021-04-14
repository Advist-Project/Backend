import mongoose, { Schema } from "mongoose"
import OrderReceipt from "../interfaces/orderReceipt"

const orderReceiptSchema: Schema = new Schema({
  orderId: Number,
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  receiptId: String,
  itemInfo: {
    itemId: { type: Number, required: true },
    itemImg: { type: String, required: true },
    itemName: { type: String, required: true },
    itemOwner: { type: String, required: true },
    option: {
      optionId: { type: Number, required: true },
      title: { type: String, required: true },
      type: { type: String, required: true },
      desc: { type: String, required: true },
      file: String,
      price: { type: Number, required: true },
      deleteYN: { type: Boolean, required: true },
      discountPrice: { type: Number, required: true },
    },
  },
  deleteYN: { type: Boolean, required: true },
})

export default mongoose.model<OrderReceipt>("OrderReceipt", orderReceiptSchema)
