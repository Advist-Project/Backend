import mongoose, { Schema } from "mongoose"
import OrderReceipt from "../interfaces/orderReceipt"
import moment from "../controllers/moment"

const orderReceiptSchema: Schema = new Schema({
  orderId: Number,
  userId: { type: Number, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: false },
  userPhone: { type: String, required: false },
  receiptId: { type: String, required: false },
  customerOrderId: { type: Number, required: false },
  createdAt: { type: String, required: false },
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
    }
  },
  paymentInfo: {
    method: { type: String, required: false },
    cardName: { type: String, required: false },
    cardNumber: { type: String, required: false },
    purchasedTime: { type: String, required: false },
    revokedTime: { type: String, required: false },
    revokedReason: { type: String, required: false }
  },

  coachingDates: [{ type: String, required: false }],
  coachingContent: { type: String, required: false },
  //-1, 0, 1, 2
  status: { type: Number, required: true }
})

orderReceiptSchema.pre<OrderReceipt>('save', function () {
  this.createdAt = moment.nowDateTime()
  console.log(this.createdAt)
})

export default mongoose.model<OrderReceipt>("OrderReceipt", orderReceiptSchema)
