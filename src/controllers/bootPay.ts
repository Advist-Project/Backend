import {NextFunction, Request, Response} from 'express'
import { RestClient } from "@bootpay/server-rest-client"
import config from '../config/config'

const payVerify = (req : Request, res : Response, next : NextFunction) => {
       RestClient.setConfig(
              config.bootpay.restApplicationID,
	       config.bootpay.privateKey
       )
       const receiptId = req.params.receiptId
       RestClient.getAccessToken()
       .then(function (response) {
              console.log(response.data.token)
	       // Access Token을 발급 받았을 때
	       if (response.status === 200 && response.data.token !== undefined) {
                     console.log(response)
                     RestClient.verify(receiptId)
                     .then(function (_response) {
                           // 검증 결과를 제대로 가져왔을 때
                           if (_response.status === 200) {
                                  console.log(_response);
                                  if (_response.data.price === 2200 && _response.data.status === 1) {
					// TODO: 이곳이 상품 지급 혹은 결제 완료 처리를 하는 로직으로 사용하면 됩니다.
                                          console.log("success verify")
                                   
				       }else {
                                          console.log("fail verify")
                                          RestClient.cancel({
                                                 receiptId: receiptId,
                                                 price: 2200,
                                                 name: "name",
                                                 reason: "?"
                                             }).then(function (response) {
                                                   // 결제 취소가 완료되었다면
                                                    if (response.status === 200) {
                                                    // TODO: 결제 취소에 관련된 로직을 수행하시면 됩니다.
                                                    console.log("success cancel" + response)
                                                    }
                                             }).catch((error) => {
                                                    console.log("1"+ error.message)
                                             })
                                   }
                            }
                     }).catch((error) => {
                            console.log("1"+ error.message)
                     })
             }
       }).catch((error) => {
              console.log("2"+ error.message)
       })
     res.redirect('/')
}

const payCancel = (req: Request, res: Response, next : NextFunction) => {
       RestClient.setConfig(
              config.bootpay.restApplicationID,
	       config.bootpay.privateKey
       )
       RestClient.getAccessToken()
       .then(function (token) {
              let {receiptId, price, name, reason} = req.body;
	       if (token.status === 200) {
                     // 보내주는 값
                     RestClient.cancel({
                         receiptId: receiptId,
                         price: price,
                         name: name,
                         reason: reason
                     }).then(function (response) {
                           // 결제 취소가 완료되었다면
			       if (response.status === 200) {
				// TODO: 결제 취소에 관련된 로직을 수행하시면 됩니다.
                            console.log("success cancel" + response)
                            }
                     }).catch((error) => {
                            console.log("1"+ error.message)
                     })
             }
       }).catch((error) => {
              console.log("2"+ error.message)
       })
       res.redirect('/')
}

export default {payVerify, payCancel}
