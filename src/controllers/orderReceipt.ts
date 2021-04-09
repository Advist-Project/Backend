import {NextFunction, Request, Response} from 'express'
import OrderReceipt from '../models/orderReceipt'
import getNextSequence from './counter'

const CheckOrder = async (req : Request, res : Response, next : NextFunction) => {
       const userId : String = req.params.userId
       const itemId = req.query.itemId
       const optionId = req.query.optionId
       const itemImg = "https://www.doctorsnews.co.kr/news/photo/201904/128662_79142_126.jpg"
       const orderId = await getNextSequence('orderReceipt')
       const orderReceipt = new OrderReceipt ({
              orderId,
              userId,
              userEmail : 'a@naver.com',
              // receiptId 나중에 받기
              itemInfo : {
                     itemId,
                     itemImg, 
                     itemName : "'책에서 삶을 보다'를 공부해보자",
                     itemOwner : "천사",
                     option : {
                            optionId,
                            title : "책에서 삶을 보다",
                            type : "workbook",
                            desc : "demo", 
                            //file, 
                            price : "2000",
                            deleteYN : 0,
                            discountPrice : 1000
                     }
              },
              deleteYN : 0
       })
       orderReceipt.save()
       .then(result =>{
              return res.status(200).json({
                     order_receipts : result
              })
       })
       .catch((error) => {
              // 500-> 실패 했다면
              return res.status(500).json({
                  // message에 에러 메세지를 넣어서 보낸다
                  message : error.message,
                  error
              });
       }) 
       
}


export default {CheckOrder}
