import { NextFunction, Request, Response } from "express"
import Exhibition from "../models/exhibition"
import Item from "../models/item"
import moment from "./moment"

const referenceOfExhibition = async (itemIds?: Array<number>) => {
    try {
        if (itemIds == undefined) return -1
        else {
            const infoPromise = itemIds.map(async function (itemId: number): Promise<object | null> {
                try {
                    const item = await Item.findOne({ itemId: itemId, deleteYN: false })
                    const itemInfo = {
                        "itemId": item?.itemId,
                        "title": item?.title,
                        "label": item?.label,
                        "likes": item?.likes,
                        "img": item?.img,
                        "tag": item?.tag,
                        "price": item?.options[0].price,
                        "discountPrice": item?.options[0].discountPrice
                    }
                    return itemInfo
                }
                catch (error) {
                    return error.message
                }
            })
            // promise형식을 object 형식으로..
            let infoJson: Array<object | null> = []
            for (let i = 0; i < infoPromise.length; i++) {
                infoJson[i] = await infoPromise[i]
            }
            return infoJson
        }

    }
    catch (error) {
        return error.message
    }
}

const bestExhibition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exhibition = await Exhibition.findOne({ rank: 1 })
        const itemIdArray = exhibition?.itemId
        const Items = await referenceOfExhibition(itemIdArray)
        if (exhibition === null) {
            res.status(501).json({
                error: "rank(우선순위)가 1등인게 없습니다."
            })
        }
        else
            exhibition.itemInfo = Items
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
            const Items = await referenceOfExhibition(itemIdArray)
            exhibition[i].itemInfo = Items
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
export default { bestExhibition, exhibitions }