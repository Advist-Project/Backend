import { NextFunction, Request, Response } from "express"
import { RestClient } from "@bootpay/server-rest-client"
import config from "../config/config"
import orderReceipt from "../models/orderReceipt"
import orderReciptController from "./orderReceipt"

const payVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    RestClient.setConfig(
      config.bootpay.restApplicationID,
      config.bootpay.privateKey
    )
    // front에서 주는 값들을 받기
    const receiptId: string = req.params.receiptId
    const orderId: any = req.query.orderId
    // orderId를 기준으로 item collection에 있는 discountPrice를 가져오기 -> await로 꺼내지 않으면
    // promise객체로 나옴..
    const order: any = await orderReceipt.findOne({ orderId: orderId })
    const realPrice: any = order.itemInfo.option.discountPrice
    // bootpay accesstoken
    const response = await RestClient.getAccessToken()
    // 네트워크 오류가 없고, token존재시
    if (response.status === 200 && response.data.token !== undefined) {
      console.log(realPrice)
      //      receiptId 기준으로 검증하기
      const verifyResponse = await RestClient.verify(receiptId)
      // 네트워크 오류 없으면
      if (verifyResponse.status === 200) {
        //    front에서 보내주는 price 와 우리 db내에있는 price비교 && 결제완료 되었는지 확인
        if (verifyResponse.data.price == realPrice && verifyResponse.data.status === 1) {
          // 상품 지급 혹은 결제 완료 처리
          console.log("success verify")
          // receiptId를 해당 orderReceipt field에 update
          const params = {
            receiptId: receiptId,
            paymentInfo: {
              method: verifyResponse.data.payment_data.pm,
              cardName: verifyResponse.data.payment_data.card_name,
              cardNumber: verifyResponse.data.payment_data.card_no,
              purchasedTime: verifyResponse.data.purchased_at,
              revokedTime: verifyResponse.data.revoked_at
            },
            // -1 -> 1 결제 검증 완료
            status: 1
          }
          await orderReciptController.orderReciptFindUpdate(orderId, params)
          console.log("successful update receiptId")
          res.status(200).json({
            message: "success verify"
          })
        } else {
          console.log("fail verify")
          // 아니라면 결제 취소 하기
          const cancelResponse = await RestClient.cancel({
            receiptId: receiptId,
            price: verifyResponse.data.price,
            name: order.userEmail,
            reason: "Fail verification",
          })
          if (cancelResponse.status === 200) {
            // 해당 orderReceipt는 사용하지 않는 것. (statue : -1 -> 0)
            // 검증 실패 후 취소
            const cancelParams = {
              status: 0,
              receiptId: receiptId,
              paymentInfo: {
                method: verifyResponse.data.payment_data.pm,
                cardName: verifyResponse.data.payment_data.card_name,
                cardNumber: verifyResponse.data.payment_data.card_no,
                purchasedTime: verifyResponse.data.purchased_at,
                revokedTime: cancelResponse.data.revoked_at
              }
            }
            await orderReciptController.orderReciptFindUpdate(orderId, cancelParams)
            console.log("success cancel")
            console.log("successful update status")
            res.status(201).json({
              message: "success cancel"
            })
          } else {
            res.status(501).json({
              message: "Fail to cancel"
            })
          }

        }
      }
    }
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// 아직 안씀
const payCancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    RestClient.setConfig(
      config.bootpay.restApplicationID,
      config.bootpay.privateKey
    )
    const token = await RestClient.getAccessToken()
    let { receiptId, price, name, reason } = req.body
    if (token.status === 200) {
      // 보내주는 값
      const response = await RestClient.cancel({
        receiptId: receiptId,
        price: price,
        name: name,
        reason: reason,
      })
      if (response.status === 200) {
        // 해당 orderReceipt는 사용하지 않는 것. (status : 1 -> 2)
        await orderReceipt.findOneAndUpdate({ receiptId: receiptId }, { $set: { status: 2 } }, { new: true })
        console.log("success cancel" + response)
      }
    }
  }
  catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

}

export default { payVerify, payCancel }
