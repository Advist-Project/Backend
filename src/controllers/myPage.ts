import { NextFunction, Request, Response } from "express"
import orderReceipt from "../models/orderReceipt"
import orderReceiptController from "./orderReceipt"
import _ from "lodash"

// userId로 table찾기 
// status = 1 또는 2 => 프론트에서 결제 완료 api호출 했으면 2만
// status = 3 => 변심에 대한 환불 + 기타)
// 날짜 순으로 내림차순
const findPaymentHistory = async (userId: number) => {
    try {
        const paymentHistroy = await orderReceipt.find({ userId: userId })
            .where("status").in([1, 2, 3])
            .sort({ "paymentInfo.purchasedTime": -1 })

        // 구매 내역이 없는 경우
        if (_.isEmpty(paymentHistroy)) return -1
        else return paymentHistroy
    }
    catch (error) {
        console.log(error.message)
        return 0
    }
}
const checkStatus = async (status: any) => {
    try {

        if (status === 3)
            return "환불 완료"
        else if (status === 2 || status === 1)
            return "결제 완료"
        else if (status === 0)
            return "검증 실패 후 취소완료"
        else
            return "결제프로세스 중단"
    }
    catch (error) {
        return "status번호가 잘못됨"
    }
}

// 구매내역
const getMyPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.userId)
        const payment = await findPaymentHistory(userId)

        if (payment === 0) {
            res.status(501).json({
                error: "userId와 status로 해당 table을 못찾음"
            })
        } else if (payment === -1) {
            res.status(201).json({
                result: "구매내역이 없습니다."
            })
        } else {
            const paymentHistroy: Array<object> = []
            for (let i = 0; i < payment.length; i++) {

                let history = {
                    "orderId": payment[i]["orderId"],
                    "purchasedTime": payment[i]["paymentInfo"]["purchasedTime"],
                    "img": payment[i]["itemInfo"]["itemImg"],
                    "itemName": payment[i]["itemInfo"]["itemName"],
                    "price": payment[i]["itemInfo"]["option"]["discountPrice"],
                    "status": await checkStatus(payment[i]["status"])
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
const getDetailOfMyPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId: number = parseInt(req.params.orderId)
        const payment = await orderReceiptController.orderReciptFindOne(orderId)
        if (payment === null || payment === undefined) {
            res.status(501).json({
                error: "해당 orderId가 없습니다."
            })
        } else {
            const paymentDetail = {
                "orderIdForCustomer": payment.customerOrderId,
                "payMethod": payment.paymentInfo.method,
                "purchasedTime": payment.paymentInfo.purchasedTime,
                "optionName": payment.itemInfo.option.title,
                // 원가
                "price": payment.itemInfo.option.price,
                // 원가 - 할인가 (할인된 가격)
                "discount": payment.itemInfo.option.price - payment.itemInfo.option.discountPrice
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
export default { getMyPaymentHistory, getDetailOfMyPaymentHistory, findPaymentHistory, checkStatus }