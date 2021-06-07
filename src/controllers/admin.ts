import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import orderReceipt from "../models/orderReceipt"
import bootPay from "./bootPay"
import mypageController from "./myPage"
import orderReceiptController from "./orderReceipt"
import exhibition from "./exhibition"
import getNextSequence from "./counter"
import Exhibition from "../models/exhibition"
const findAdminPaymentHistory = async () => {
    try {
        const paymentHistroy = await orderReceipt.find()
            .sort({ "createdAt": -1 })
        // 구매 내역이 없는 경우
        if (_.isEmpty(paymentHistroy)) return -1
        else return paymentHistroy
    }
    catch (error) {
        console.log("findAdminPaymentHistory" + error.message)
        return 0
    }
}

// 구매내역
const getAdminPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await findAdminPaymentHistory()
        if (payment === 0) {
            res.status(501).json({
                error: "orderReceipt를 찾는 로직에 문제가 생김"
            })
        } else if (payment === -1) {
            res.status(201).json({
                result: "전체 구매내역이 없습니다"
            })
        } else {
            const paymentHistroy: Array<object> = []
            for (let i = 0; i < payment.length; i++) {
                let history = {
                    "orderId": payment[i]["orderId"],
                    "orderIdForCustomer": payment[i]["customerOrderId"] || "",
                    "createdOrderTime": payment[i]["createdAt"] || "",
                    "itemName": payment[i]["itemInfo"]["itemName"],
                    "optionName": payment[i]["itemInfo"]["option"]["title"],
                    "userName": payment[i]["userName"] || "",
                    "userEmail": payment[i]["userEmail"],
                    "userPhone": payment[i]["userPhone"] || "",
                    "payMethod": payment[i]["paymentInfo"]["method"] || "",
                    "status": await mypageController.checkStatus(payment[i]["status"])
                }
                paymentHistroy[i] = history
            }
            res.status(200).json({
                result: paymentHistroy
            })
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 상세 구매 내역
const getDetailOfAdminPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId: number = parseInt(req.params.orderId)
        const payment = await orderReceiptController.orderReciptFindOne(orderId)
        if (payment === null || payment === undefined) {
            res.status(501).json({
                error: "해당 orderId가 없습니다."
            })
        } else {
            const paymentDetail = {
                "orderId": payment.orderId,
                "orderIdForCustomer": payment.customerOrderId,
                "status": payment.status,
                "createdOrderTime": payment.createdAt || "",
                "userName": payment.userName || "",
                "userEmail": payment.userEmail,
                "userPhone": payment.userPhone || "",
                "itemName": payment.itemInfo.itemName,
                "optionName": payment.itemInfo.option.title,
                // 원가
                "price": payment.itemInfo.option.price,
                // 원가 - 할인가 (할인된 가격)
                "discount": payment.itemInfo.option.price - payment.itemInfo.option.discountPrice,
                // 최종결제금액
                "realPrice": payment.itemInfo.option.discountPrice,
                "payMethod": payment.paymentInfo.method || "",
                "bootPayReceiptId": payment.receiptId || "",
                "purchasedTime": payment.paymentInfo.purchasedTime || "",
                "revokedTime": payment.paymentInfo.revokedTime || "",
                "revokedReason": payment.paymentInfo.revokedReason || ""
            }
            res.status(200).json({
                result: paymentDetail
            })
        }

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 환불하기
const refund = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { orderId, reason } = req.body
        const order = await orderReceiptController.orderReciptFindOne(orderId)
        if (order === null || order === undefined) {
            res.status(501).json({
                error: "해당 orderReceipt를 찾지 못했습니다"
            })
        } else {
            const receiptId = order.receiptId
            const price = order.itemInfo.option.discountPrice
            const email = order.userEmail
            const cancelResult = await bootPay.payCancel(orderId, receiptId, price, email, reason)
            if (cancelResult === 0) {
                res.status(200).json({
                    result: " 환불 완료"
                })
            } else {
                res.status(502).json({
                    error: "환불 중 오류"
                })
            }
        }

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}



//기획전 있는지 없는지 확인해야함
//시퀀스 아이디 있는거는 안올라가도록 (find + where 문으로 seq 값 가져오기)
//수정하는 api 하나 새로 추가하는 api 하나 
//새로 저장하는 기획전 > 데이터 받아서 > save > seq ++ (getNextSequence("exhibition"))
//수정하는 기획전 > 데이터 받고 > 기존에있던 데이터들을 받아서 덮어쓰기 > findOneAndUpdate
//아이템 받는거는 우선순위 대로 받아야함    


//어드민 newExhibition post용
const newExhibitionSave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exhibitionId = await getNextSequence("exhibition")
        const newExhibition = new Exhibition({
            exhibitionId,
            title: req.body.title,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            visible: req.body.visible,
            rank: req.body.rank,
            itemId: req.body.itemId,
            itemInfo: req.body.itemInfo
        })
        await newExhibition.save()
        res.status(200).json({
            new_Exhibition: newExhibition,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//어드민 updateExhibition post용
const updateExhibition = async (req: Request, res: Response, next: NextFunction) => {
    try {

        await Exhibition.findOneAndUpdate({ id: req.body.exhibitionId }, { $set: req.body }, { new: true })
        res.status(200).json({
            updatedExhibition: Exhibition,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export default { getAdminPaymentHistory, getDetailOfAdminPaymentHistory, findAdminPaymentHistory, refund, newExhibitionSave, updateExhibition }