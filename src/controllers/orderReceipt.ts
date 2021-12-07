import { NextFunction, Request, Response } from "express"
import OrderReceipt from "../models/orderReceipt"
import getNextSequence from "../service/counter"
import Item from "../models/item"
import userInfoService from "../service/userInfo"
import orderReceiptService from "../service/orderReceipt"

const checkOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = parseInt(req.params.userId)
    const user: any = await userInfoService.userFindOne(userId)
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
    await orderReceiptService.orderReciptFindUpdate(orderId, userParam)
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
    await orderReceiptService.orderReciptFindUpdate(orderId, userParam)
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
    const user = {
      name: userName,
      phone: userPhone
    }
    const userParam = {
      userName: userName,
      userPhone: userPhone
    }
    await userInfoService.userFindUpdate(userId, user)
    await orderReceiptService.orderReciptFindUpdate(orderId, userParam)
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
    const orderList: any = await orderReceiptService.orderReciptFindOne(orderId)
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
    await orderReceiptService.orderReciptFindUpdate(orderId, param)
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

export default
  {
    checkOrder,
    saveUserInfo,
    completeOrder,
    afterCompleteOrder,
    saveCoachingDate,
    saveConsultationOfCoaching,
  }
