import express from 'express'
import cors from "cors"
import mongoose from "mongoose"
import config from './config/config'
import { RestClient } from "@bootpay/server-rest-client"
// cors 등록

const app = express()
app.use(express.json())
mongoose
.connect(config.mongo.url, config.mongo.options)
.then((result) => {
       console.log('connected')
})
.catch((error) => {
       console.log(error.message)
})

app.use(cors())
RestClient.setConfig(
              '6051d8fdd8c1bd0024f4c34f',
	       'b835jHuBNL2OvAGzwhLoUCMnORM02BMhX1gld9C7Exo='
)

app.get("/pay", (req : express.Request , res : express.Response, next : express.NextFunction) => {
       
       RestClient.getAccessToken()
       .then(function (response) {
              console.log(response.data.token)
	       // Access Token을 발급 받았을 때
	       if (response.status === 200 && response.data.token !== undefined) {
                     console.log(response)
                     RestClient.verify("6069b297d8c1bd001d46d7c6")
                     .then(function (_response) {
                           // 검증 결과를 제대로 가져왔을 때
                           if (_response.status === 200) {
                                  console.log(_response);
                                  if (_response.data.price === 2200 && _response.data.status === 1) {
					// TODO: 이곳이 상품 지급 혹은 결제 완료 처리를 하는 로직으로 사용하면 됩니다.
                                          console.log("success verify")
                                   
				       }
                            }
                     }).catch((error) => {
                            console.log("1"+ error.message)
                     })
             }
       }).catch((error) => {
              console.log("2"+ error.message)
       })
       // res.redirect('/')
})
app.post("/cancel", (req : express.Request , res : express.Response, next : express.NextFunction) => {
       
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
})
app.get("/", (req : express.Request , res : express.Response, next : express.NextFunction) => {
       res.send("hi")
})
 

const port = process.env.PORT || 8080
app.listen(port,()=>console.log("start"+port))