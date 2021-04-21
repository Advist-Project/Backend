import { NextFunction, Request, Response } from "express"
import OrderReceipt from "../models/orderReceipt"
import getNextSequence from "./counter"
import Item from "../models/item"
import User from "../models/user"
import orderReceipt from "../models/orderReceipt"

const checkOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = parseInt(req.params.userId)
    // 이부분 고침
    const userEmail: any = await User.findOne({ userId: userId })
    const itemId: any = req.query.itemId
    const item: any = await Item.findOne({ itemId: itemId })
    const optionId: any = req.query.optionId
    const orderId: any = await getNextSequence("orderReceipt")
    const orderReceipt = new OrderReceipt({
      orderId,
      userId,
      // 이 부분고침
      userEmail,
      // receiptId 나중에 받기
      itemInfo: {
        itemId,
        itemImg: item['img'],
        itemName: item['title'],
        itemOwner: item['owner'],
        // 배열이기 때문에 optionId-1
        option: {
          optionId,
          title: item['options'][optionId - 1]['title'],
          type: item['options'][optionId - 1]['type'],
          desc: item['options'][optionId - 1]['desc'],
          //file,
          price: item['options'][optionId - 1]['price'],
          deleteYN: item['options'][optionId - 1]['deleteYN'],
          discountPrice: item['options'][optionId - 1]['discountPrice'],
        },
      },
      deleteYN: item['deleteYN'],
    })
    await orderReceipt.save()
    res.status(200).json({
      order_receipts: orderReceipt,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// 이 부분고침
const saveUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { orderId, userId, userName, userPhone } = req.body
    await User.findOneAndUpdate({ userId: userId }, { $set: { name: userName, phone: userPhone } }, { new: true })
    await orderReceipt.findOneAndUpdate({ orderId: orderId }, { $set: { userName: userName, userPhone: userPhone } }, { new: true })
    res.status(200).json({
      result: "save complete",
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// 이 부분고침
export default { checkOrder, saveUserInfo }
