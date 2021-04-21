import { NextFunction, Request, Response } from "express"
import Item from "../models/item"

const getItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = parseInt(req.params.itemId)
        const item = await Item.findOne({ itemId: itemId })
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
export default { getItem }