import mongoose, { Schema } from "mongoose"
import OrderReceipt from "../interfaces/orderReceipt"

const orderReceiptSchema: Schema = new Schema({
  orderId: Number,
  userId: { type: Number, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: false },
  userPhone: { type: String, required: false },
  receiptId: { type: String, required: false },
  itemInfo: {
    itemId: { type: Number, required: true },
    itemImg: { type: String, required: false },
    itemName: { type: String, required: true },
    itemOwner: { type: String, required: true },
    option: {
      optionId: { type: Number, required: true },
      title: { type: String, required: true },
      type: { type: String, required: true },
      desc: { type: String, required: true },
      file: { type: String, required: false },
      price: { type: Number, required: true },
      deleteYN: { type: Boolean, required: true },
      discountPrice: { type: Number, required: true },
    },
  },
  deleteYN: { type: Boolean, required: true },
})

export default mongoose.model<OrderReceipt>("OrderReceipt", orderReceiptSchema)
