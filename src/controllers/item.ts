import { NextFunction, Request, Response } from "express"
import Moment from "./moment"
import Item from "../models/item"

// option들 중에 조건에 맞는 options 리턴
//option deleteYN : false -> 삭제 되지 않음
//할인 기간 중 -> 할인 가격 
//할인 기간 아니면 -> 원래 가격 
const isOkOptions = async (options: any, itemId: number) => {
    try {
        const realOptions: Array<object> = []
        let index = 0
        for (let i = 0; i < options.length; i++) {
            let isEffectiveDate = Moment.effectiveDate(options[i].dateStart, options[i].dateEnd)
            // 할인기간이 끝났거나, 아직 안됬을 경우 && 이미 할인가격을 안바꾼 경우
            const price = options[i].price
            const discountPrice = options[i].discountPrice

            if (price != discountPrice && !isEffectiveDate) {

                // 할인 가격을 원가격으로 바꿔놓기
                options[i].discountPrice = price

                // db에도 update하기 -> return 값 필요 없을때 updateOne
                await Item.updateOne(
                    {
                        itemId: itemId,
                        // optionId = 1부터 시작
                        "options.optionId": i + 1
                    },
                    {
                        $set: { "options.$.discountPrice": price }
                    }
                )

            }

            // 삭제되지 않은 것만 realOption에 넣기
            if (options[i].deleteYN === false) {
                realOptions[index] = options[i]
                index++
            }
        }
        return realOptions
    }
    catch (error) {
        console.log("isOkOptions :" + error.message)
        return -1
    }
}

const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId)
        const item = await Item.findOne({ itemId: itemId })
        const realItem = {
            "itemId": item?.itemId,
            "title": item?.title,
            "owner": item?.owner,
            "label": item?.label,
            "likes": item?.likes,
            "coachImg": item?.coachImg,
            "commentImg": item?.commentImg,
            "img": item?.img,
            "tag": item?.tag,
            "template": item?.template,
            "deleteYN": item?.deleteYN,
            "options": [{}]
        }
        const options = item?.options
        if (options === undefined) {
            res.status(501).json({
                error: "item에 option이 하나도 없습니다."
            })
        } else {
            const realOption = await isOkOptions(options, itemId)
            if (realOption === -1) {
                res.status(503).json({
                    error: "options또는 itemId가 잘못되었습니다."
                })
            }
            else if (realOption === undefined) {
                res.status(502).json({
                    error: "조건에 맞는 option이 하나도 없습니다."
                })
            } else {
                realItem.options = realOption
                res.status(200).json({
                    item: realItem
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
export default { getItem, isOkOptions }