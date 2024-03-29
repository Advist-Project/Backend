import { NextFunction, Request, Response } from "express"
import _, { template } from "lodash"
import bootPay from "./bootPay"
import myPageService from "../service/myPage"
import orderReceiptService from "../service/orderReceipt"
import getNextSequence from "../service/counter"
import adminService from "../service/admin"
import Exhibition from "../models/exhibition"
import Item from "../models/item"
import User from "../models/user"

const getUserInfos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.find().select('-_id userId googleId naverId kakaoId username email phone career company jobDepartment createdAt')
        res.status(200).json({
            result: user
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 구매내역
const getAdminPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await adminService.findAdminPaymentHistory()
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
                    "status": await myPageService.checkStatus(payment[i]["status"])
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
        const payment = await orderReceiptService.orderReciptFindOne(orderId)
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
        const order = await orderReceiptService.orderReciptFindOne(orderId)
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
            itemId: req.body.itemId
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
        const params = {
            title: req.body.title,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            visible: req.body.visible,
            rank: req.body.rank,
            itemId: req.body.itemId
        }
        await Exhibition.findOneAndUpdate({ exhibitionId: req.body.exhibitionId }, { $set: params }, { new: true })
        res.status(200).json({
            updatedExhibition: "업데이트 완료",
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
//어드민 updateProductDetail post용
const updateProductDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params = {
            coachImg: req.body.postData.coachImg,
            coachInfo: req.body.postData.coachInfo,
            commentImg: req.body.postData.commentImg,
            deleteYN: req.body.postData.deleteYN,
            img: req.body.postData.img,
            itemId: req.body.postData.itemId,
            label: req.body.postData.label,
            likes: req.body.postData.likes,
            options: req.body.postData.options,
            owner: req.body.postData.owner,
            tag: req.body.postData.tag,
            template: req.body.postData.template,
            title: req.body.postData.title
        }
        console.log(params)
        await Item.findOneAndUpdate({ itemId: req.body.postData.itemId }, { $set: params }, { new: true })
        res.status(200).json({
            updateProductDetail: "업데이트 완료",
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//어드민 newProductDetail post용
const newProductDetailSave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body.postData)
        const itemId = await getNextSequence("item")
        const newProductDetail = new Item({
            itemId,
            coachImg: req.body.postData.coachImg,
            coachInfo: req.body.postData.coachInfo,
            commentImg: req.body.postData.commentImg,
            deleteYN: req.body.postData.deleteYN,
            img: req.body.postData.img,
            label: req.body.postData.label,
            likes: req.body.postData.likes,
            options: req.body.postData.options,
            owner: req.body.postData.owner,
            tag: req.body.postData.tag,
            template: req.body.postData.template,
            title: req.body.postData.title
        })
        await newProductDetail.save()
        res.status(200).json({
            new_Exhibition: newProductDetail,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export default { getUserInfos, getAdminPaymentHistory, getDetailOfAdminPaymentHistory, refund, newExhibitionSave, updateExhibition, updateProductDetail, newProductDetailSave }
