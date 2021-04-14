import {Document} from 'mongoose'

export default interface OrderReceipt extends Document{
    orderId? :number, 
    userId? : string,
    userEmail? : string,
    receiptId? : string,
    itemInfo? : {
        itemId? : number,
        itemImg? : string, 
        itemName? : string,
        itemOwner? : string,
        option? : {
            optionId? : number,
            title? : string,
            type? : string,
            desc? : string, 
            file? : string, 
            price? : number,
            deleteYN? : boolean,
            discountPrice? : number
        }
    },
    deleteYN? : boolean
}