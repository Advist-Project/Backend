import { NextFunction, Request, Response } from "express"
import Item from "../models/item"

const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId)
        const item = await Item.findOne({ itemId: itemId })
        const options = item?.options
        if (options === undefined) {
            res.status(501).json({
                error: "option이 하나도 없습니다."
            })
        } else {
            for (let i = 0; i < options.length; i++)
                // 삭제된 option일 경우
                if (options[i].deleteYN === true) {
                    options[i] = {}
                }
            res.status(200).json({
                item: item
            })
        }

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
export default { getItem }