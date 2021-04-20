import { NextFunction, Request, Response } from "express"
import OrderReceipt from "../models/orderReceipt"
import getNextSequence from "./counter"
import getItemToOrderReceipt from "./item"
const CheckOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: Number = parseInt(req.params.userId)
    const itemId: any = req.query.itemId
    const item: any = await getItemToOrderReceipt.getItemToOrderReceipt(itemId)
    const optionId: any = req.query.optionId
    const orderId: any = await getNextSequence("orderReceipt")
    const orderReceipt = new OrderReceipt({
      orderId,
      userId,
      userEmail: "a@naver.com",
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

export default { CheckOrder }
