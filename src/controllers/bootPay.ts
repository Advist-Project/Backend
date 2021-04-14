import { NextFunction, Request, Response } from "express"
import { RestClient } from "@bootpay/server-rest-client"
import config from "../config/config"
import orderReceipt from "../models/orderReceipt"

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

    const realPrice: any = await orderReceipt
      .findOne({ orderId: orderId })
      .then((result) => {
        return result?.itemInfo?.option?.discountPrice
      })
      .catch((error) => {
        res.status(501).json({
          message: error.message
        })
      })
    // bootpay accesstoken
    RestClient.getAccessToken()
      .then(function (response) {
        //  Access Token을 발급 받았을 때
        if (response.status === 200 && response.data.token !== undefined) {

          //      receiptId 기준으로 검증하기
          RestClient.verify(receiptId)
            .then(function (_response) {
              //       검증 결과를 제대로 가져왔을 때
              if (_response.status === 200) {
                //    front에서 보내주는 price 와 우리 db내에있는 price비교 && 결제완료 되었는지 확인
                if (_response.data.price == realPrice && _response.data.status === 1) {
                  // TODO : 이곳이 상품 지급 혹은 결제 완료 처리를 하는 로직으로 사용하면 됩니다
                  console.log("success verify")
                  res.status(200).json({
                    message: "success verify"
                  })
                  //     맞다면 receiptId를 우리 order collection에 저장
                  orderReceipt
                    .findOneAndUpdate({
                      orderId: orderId,
                      receiptId: receiptId,
                    })
                    .then((result) => {
                      console.log("success update receiptId")
                    })
                    .catch((error) => {
                      res.status(502).json({
                        message: error.message
                      })
                    })
                } else {
                  console.log("fail verify")
                  // 아니라면 결제 취소 하기
                  RestClient.cancel({
                    receiptId: receiptId,
                    price: _response.data.price,
                    name: "name",
                    reason: "?",
                  })
                    .then(function (response) {
                      //  결제 취소가 완료되었다면 
                      if (response.status === 200) {
                        //      TODO: 결제 취소에 관련된 로직을 수행하시면 됩니다
                        console.log("success cancel")
                        res.status(200).json({
                          message: "success cancel"
                        })
                      }
                    })
                    .catch((error) => {
                      res.status(503).json({
                        message: error.message
                      })
                    })
                }
              }
            })
            .catch((error) => {
              res.status(504).json({
                message: error.message
              })
            })
        }
      })
      .catch((error) => {
        res.status(505).json({
          message: error.message
        })
      })
  } catch (error) {
    res.status(506).json({
      message: error.message
    })
  }
}
// 아직 안고침
const payCancel = (req: Request, res: Response, next: NextFunction) => {
  RestClient.setConfig(
    config.bootpay.restApplicationID,
    config.bootpay.privateKey
  )
  RestClient.getAccessToken()
    .then(function (token) {
      let { receiptId, price, name, reason } = req.body
      if (token.status === 200) {
        // 보내주는 값
        RestClient.cancel({
          receiptId: receiptId,
          price: price,
          name: name,
          reason: reason,
        })
          .then(function (response) {
            // 결제 취소가 완료되었다면
            if (response.status === 200) {
              // TODO: 결제 취소에 관련된 로직을 수행하시면 됩니다.
              console.log("success cancel" + response)
            }
          })
          .catch((error) => {
            console.log("1" + error.message)
          });
      }
    })
    .catch((error) => {
      console.log("2" + error.message)
    })

}

export default { payVerify, payCancel }
