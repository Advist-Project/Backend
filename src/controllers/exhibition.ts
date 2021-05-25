import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import Exhibition from "../models/exhibition"
import Item from "../models/item"
import moment from "./moment"
import itemController from "./item"

const referenceOfExhibition = async (itemIds?: Array<number>) => {
    try {
        if (itemIds == undefined) return -1
        else {
            const infoPromise = itemIds.map(async function (itemId: number): Promise<object | null> {
                const item = await Item.findOne({ itemId: itemId, deleteYN: false })
                // 빈 값을 찾는다
                if (_.isEmpty(item)) {
                    // 안그러면 undefine으로 값이 채워짐.-> map이라서
                    return {}
                } else {
                    const realOptions = await itemController.isOkOptions(item?.options, itemId)
                    const itemInfo = {
                        "itemId": item?.itemId,
                        "title": item?.title,
                        "label": item?.label,
                        "likes": item?.likes,
                        "img": item?.img,
                        "tag": item?.tag,
                        "price": realOptions[0]["price"],
                        "discountPrice": realOptions[0]["discountPrice"]
                    }
                    return itemInfo
                }
            })
            // promise형식을 object 형식으로..
            let infoJson: Array<object | null> = []
            // itemInfo의 개수
            let cnt = 0
            // 추가되는 index
            let index = 0
            while (cnt < infoPromise.length) {
                let info = await infoPromise[cnt]
                // 빈값({})이 아니면
                if (!_.isEmpty(info)) {
                    // index에 info 넣기
                    infoJson[index] = info
                    index++
                    cnt++
                } else {
                    cnt++
                }
            }
            return infoJson
        }
    }
    catch (error) {
        console.log("referenceOfExhibition" + error.message)
        return 0
    }
}

const bestExhibition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exhibition = await Exhibition.findOne({ rank: 1 })
        const itemIdArray = exhibition?.itemId
        const Items: any = await referenceOfExhibition(itemIdArray)
        if (Items === -1) {
            res.status(501).json({
                error: "itemId에 오류가 있습니다."
            })
        } else {
            if (exhibition === null) {
                res.status(502).json({
                    error: "rank(우선순위)가 1등인게 없습니다."
                })
            }
            else
                exhibition.itemInfo = Items
            res.status(200).json({
                exhibition: exhibition
            })
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const exhibitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const now = moment.nowDateTime()
        const exhibition = await Exhibition.find(
            {
                dateStart: { $lte: now },
                dateEnd: { $gte: now }
            }
        )
            .where("visible").equals(true)
            .where("rank").ne(1)
            .sort({ "rank": 1 })
        // iteminfo 붙이는 로직
        for (let i = 0; i < exhibition.length; i++) {
            const itemIdArray = exhibition[i]?.itemId
            const Items: any = await referenceOfExhibition(itemIdArray)
            if (Items === -1) {
                res.status(501).json({
                    error: "itemId에 오류가 있습니다."
                })
            } else if (Items === 0) {
                res.status(502).json({
                    error: "itemId와 itemInfo매칭에 오류가 생김"
                })
            } else {
                exhibition[i].itemInfo = Items
            }
        }
        res.status(200).json({
            exhibition: exhibition
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// 어드민용
const adminExhibitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const now = moment.nowDateTime()
        const exhibition = await Exhibition.find(
            {
                dateStart: { $lte: now },
                dateEnd: { $gte: now }
            }
        )
            .where("visible").equals(true)
            .sort({ "rank": 1 })
        // iteminfo 붙이는 로직
        for (let i = 0; i < exhibition.length; i++) {
            const itemIdArray = exhibition[i]?.itemId
            const Items: any = await referenceOfExhibition(itemIdArray)
            if (Items === -1) {
                res.status(501).json({
                    error: "itemId에 오류가 있습니다."
                })
            } else if (Items === 0) {
                res.status(502).json({
                    error: "itemId와 itemInfo매칭에 오류가 생김"
                })
            } else {
                exhibition[i].itemInfo = Items
            }
        }
        res.status(200).json({
            exhibition: exhibition
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
export default {
    referenceOfExhibition,
    bestExhibition,
    exhibitions,
    adminExhibitions
}