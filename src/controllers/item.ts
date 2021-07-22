import { NextFunction, Request, Response } from "express"
import Moment from "./moment"
import Item from "../models/item"
import userInfo from "./userInfo"

const itemHeartFindUpdate = async (id: number, param: any) => {
    try {
        return await Item.findOneAndUpdate(
            { itemId: id },
            { $inc: param },
            { new: true })
    }
    catch (error) {
        console.log("itemFindUpdate" + error.message)
    }
}

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
            "coachInfo": item?.coachInfo,
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

//하트 누르기 
const chooseHeart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId)
        const itemId: any = req.query.itemId
        // likes에 ++하기
        const likeNumber = await itemHeartFindUpdate(itemId, { likes: 1 })
        console.log("like " + likeNumber?.likes)
        // likeItemIds를 가져오기 위해 userInfo가져오기
        const info: any = await userInfo.userFindOne(userId)
        if (info === null || info === undefined) {
            res.status(501).json({
                error: "해당 userId에 맞는 user가 없습니다."
            })
        } else {
            const likeItemIds: Array<number> = info.likeItemIds
            // likeItemIds 배열 뒤에 itemId붙이기
            likeItemIds.push(itemId)
            await userInfo.userFindUpdate(userId, { likeItemIds: likeItemIds })
            res.status(200).json({
                result: likeNumber?.likes
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


//하트 제거 하기
const cancelHeart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId)
        const itemId: any = req.query.itemId
        // likes에 --하기
        const likeNumber = await itemHeartFindUpdate(itemId, { likes: -1 })
        console.log("like " + likeNumber?.likes)
        // likeItemIds를 가져오기 위해 userInfo가져오기
        const info: any = await userInfo.userFindOne(userId)
        if (info === null || info === undefined) {
            res.status(501).json({
                error: "해당 userId에 맞는 user가 없습니다."
            })
        } else {
            const likeItemIds: Array<number> = info.likeItemIds
            // likeItemIds 배열에서 itemId와 같은 값을 제외하고 배열 필터링 하기
            const filtered = likeItemIds.filter((element) => element != itemId)
            await userInfo.userFindUpdate(userId, { likeItemIds: filtered })
            res.status(200).json({
                result: likeNumber?.likes
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 어드민에서 상품을 고를때 id와 제목만.
const allItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await Item.find().select('-_id itemId title')
        res.status(200).json({
            item: item
        })

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

//어드민에서 상품 정보를 다 받아 올 때
const allItemInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemInfo = await Item.find()
        res.status(200).json({
            itemInfo: itemInfo
        })

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


//어드민에서 옵션 false라도 받아오도록 변경
const isOkOptionsAdmin = async (options: any, itemId: number) => {
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

            } realOptions[index] = options[i]
            index++
        }
        return realOptions
    }
    catch (error) {
        console.log("isOkOptions :" + error.message)
        return -1
    }
}

//어드민용 getItem
const getItemAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId)
        const item = await Item.findOne({ itemId: itemId })
        const realItem = {
            "itemId": item?.itemId,
            "title": item?.title,
            "owner": item?.owner,
            "label": item?.label,
            "likes": item?.likes,
            "coachInfo": item?.coachInfo,
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
            const realOption = await isOkOptionsAdmin(options, itemId)
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
export default {
    itemHeartFindUpdate,
    getItem,
    getItemAdmin,
    isOkOptions,
    chooseHeart,
    cancelHeart,
    allItem,
    allItemInfo,
    isOkOptionsAdmin
}