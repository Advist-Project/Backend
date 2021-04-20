import { NextFunction, Request, Response } from "express"
import Item from "../models/item"

const getItem = (req: Request, res: Response, next: NextFunction) => {
    const itemId = parseInt(req.params.itemId)
    Item.findOne({ itemId: itemId })
        .then(result => {
            res.status(200).json({
                item: result
            })
        }).catch(error => {
            res.status(500).json({
                error: error.message
            })
        })
}
const getItemToOrderReceipt = (id: number) => {
    return Item.findOne({ itemId: id })
        .then(result => {
            return result
        }).catch(error => {
            console.log("error1" + error.message)
            return error.message
        })
}
export default { getItem, getItemToOrderReceipt }