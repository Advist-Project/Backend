import { NextFunction, Request, Response } from "express"
import getNextSequence from "./counter"
import orderReceiptController from "./orderReceipt"
import userInfoController from "./userInfo"
import review from "../models/review"
import moment from "./moment"

// 후기 작성
const makeReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { orderId, score, good, bad, content } = req.body
        // orderReceipt하나 찾기
        const order = await orderReceiptController.orderReciptFindOne(orderId)
        if (order === undefined || order === null) {
            res.status(501).json({
                message: "해당 orderId가 없는 id입니다."
            })
        } else {
            const user = await userInfoController.userFindOne(order.userId)
            if (user === undefined || user === null) {
                res.status(502).json({
                    message: "해당 orderId에 있는 userId는 없는 id입니다."
                })
            } else {
                const reviewId = await getNextSequence("review")
                const createdAt = moment.nowDateTime()
                const newReiview = new review({
                    reviewId,
                    userId: order?.userId,
                    userEmail: user["email"], //로그인 시 받는 이메일
                    userName: user["username"], //로그인 시 받는 이름
                    orderInfo: {
                        orderId,
                        itemId: order?.itemInfo.itemId,
                        itemOwner: order?.itemInfo.itemOwner, //코치
                        itemName: order?.itemInfo.itemName,
                        optionId: order?.itemInfo.option.optionId,
                        optionName: order?.itemInfo.option.title,
                    },
                    score: score,
                    good: good, //엄지척
                    bad: bad,
                    content: content,
                    deletYN: false,
                    createdAt
                })
                console.log(newReiview)
                await newReiview.save()
                await orderReceiptController.orderReciptFindUpdate(orderId, { status: 4 })
                res.status(200).json({
                    result: "후기 저장 완료 & status = 4로 변경완료"
                })
            }
        }

    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export default
    {
        makeReview
    }
