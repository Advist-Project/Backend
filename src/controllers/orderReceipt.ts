import { NextFunction, Request, Response } from "express"
import OrderReceipt from "../models/orderReceipt"
import getNextSequence from "./counter"
import Item from "../models/item"
import User from "../models/user"
import orderReceipt from "../models/orderReceipt"

const orderReciptFindUpdate = async (id: number, param: any) => {
  try {
    await orderReceipt.findOneAndUpdate(
      { orderId: id },
      { $set: param },
      { new: true })
  }
  catch (error) {
    console.log(error.message)
  }
}

const checkOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = parseInt(req.params.userId)
    const user: any = await User.findOne({ userId: userId })
    const userEmail: string = user.email
    const itemId: any = req.query.itemId
    const item: any = await Item.findOne({ itemId: itemId })
    const optionId: any = req.query.optionId
    const orderId: any = await getNextSequence("orderReceipt")
    const orderReceipt = new OrderReceipt({
      orderId,
      userId,
      userEmail,
      customerOrderId: orderId + 484930,
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
      // 결제 승인전
      status: -1,
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
// 코칭 날짜 저장
const saveCoachingDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { orderId, dates } = req.body
    const userParam = {
      coachingDates: dates
    }
    await orderReciptFindUpdate(orderId, userParam)
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
// 코칭 상담내용 저장
const saveConsultationOfCoaching = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { orderId, content } = req.body
    const userParam = {
      coachingContent: content
    }

    await orderReciptFindUpdate(orderId, userParam)
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

const saveUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { orderId, userId, userName, userPhone } = req.body
    const userParam = {
      userName: userName,
      userPhone: userPhone
    }
    await User.findOneAndUpdate({ userId: userId }, { $set: userParam }, { new: true })
    await orderReciptFindUpdate(orderId, userParam)
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

const completeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: number = parseInt(req.params.orderId)
    const orderList: any = await orderReceipt.findOne({ orderId: orderId })
    res.status(200).json({
      order_receipts: orderList
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const afterCompleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId: number = parseInt(req.params.orderId)
    const param = {
      status: 2
    }
    // 최종 완료
    await orderReciptFindUpdate(orderId, param)
    console.log("successful update status")
    res.status(200).json({
      result: "success"
    })
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export default { checkOrder, saveUserInfo, completeOrder, afterCompleteOrder, orderReciptFindUpdate, saveCoachingDate, saveConsultationOfCoaching }
