import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import orderReceiptService from "../service/orderReceipt"
import itemService from "../service/item"
import exhibitionService from "../service/exhibition"
import myPageService from "../service/myPage"
import userInfoService from "../service/userInfo"

// 구매내역
const getMyPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.userId)
        const payment = await myPageService.findPaymentHistory(userId)

        if (payment === 0) {
            res.status(501).json({
                error: "userId와 status로 해당 table을 못찾음"
            })
        } else if (payment === -1) {
            res.status(201).json({
                result: "구매내역이 없습니다."
            })
        } else {
            const orders: Array<number> = []
            const paymentHistroy: Array<object> = []
            let index = 0
            for (let i = 0; i < payment.length; i++) {
                // 완전히 구매한 내역만 (환불한거 제외)
                if (payment[i]["status"] === 2 || payment[i]["status"] === 1 || payment[i]["status"] === 4) {
                    orders[index] = payment[i]["orderId"]
                    index++
                }
                let history = {
                    "orderId": payment[i]["orderId"],
                    "purchasedTime": payment[i]["paymentInfo"]["purchasedTime"],
                    "img": payment[i]["itemInfo"]["itemImg"],
                    "itemName": payment[i]["itemInfo"]["itemName"],
                    "price": payment[i]["itemInfo"]["option"]["discountPrice"],
                    "status": await myPageService.checkStatus(payment[i]["status"])
                }
                paymentHistroy[i] = history
            }
            // user테이블에 구매내역 update
            await userInfoService.userFindUpdate(userId, { orderIds: orders })

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
        const payment = await orderReceiptService.orderReciptFindOne(orderId)
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

// 찜한 내역 모두 보여 주기
const likesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.userId)
        const info: any = await userInfoService.userFindOne(userId)
        // likeItemIds배열 저장
        const likes = info.likeItemIds
        // 찜한 내역이 없는 경우
        if (_.isEmpty(likes)) {
            res.status(201).json({
                result: "찜한 내역이 없습니다."
            })
        } else {
            // 찜한 itemId와 item들을 mapping시키기
            const likeItem: any = await exhibitionService.referenceOfExhibition(likes)
            if (likeItem === -1) {
                res.status(501).json({
                    error: "itemId에 오류가 있습니다."
                })
            } else {
                res.status(200).json({
                    result: likeItem
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


// 찜한 내역 모두 삭제
const deleteAllLikesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: number = parseInt(req.params.userId)
        const info: any = await userInfoService.userFindOne(userId)
        // likeItemIds배열 저장
        const likes = info.likeItemIds
        // item 테이블에 각 itemId들에 likes를 -1하기
        for (let itemId = 0; itemId < likes.length; itemId++) {
            await itemService.itemHeartFindUpdate(likes[itemId], { likes: -1 })
        }
        // user 테이블에 likeItemIds를 빈 배열로 update
        await userInfoService.userFindUpdate(userId, { likeItemIds: [] })
        res.status(200).json({
            result: "찜한 내역 모두 삭제 완료"
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


export default {
    getMyPaymentHistory,
    getDetailOfMyPaymentHistory,
    likesList,
    deleteAllLikesList
}