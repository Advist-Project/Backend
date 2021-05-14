import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import orderReceipt from "../models/orderReceipt"
import mypageController from "./myPage"
import orderReceiptController from "./orderReceipt"

const findAdminPaymentHistory = async () => {
    try {
        const paymentHistroy = await orderReceipt.find()
            .sort({ "createdAt": -1 })
        // 구매 내역이 없는 경우
        if (_.isEmpty(paymentHistroy)) return -1
        else return paymentHistroy
    }
    catch (error) {
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
                "orderIdForCustomer": payment.customerOrderId,
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
                "revokedTime": payment.paymentInfo.revokedTime || ""
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
export default { getAdminPaymentHistory, getDetailOfAdminPaymentHistory, findAdminPaymentHistory }