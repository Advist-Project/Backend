import { Document } from 'mongoose'

export default interface OrderReceipt extends Document {
    orderId?: number,
    userId?: number,
    userEmail?: string,
    userName?: string,
    userPhone?: string,
    receiptId?: string,
    customerOrderId?: number,
    itemInfo?: {
        itemId?: number,
        itemImg?: string,
        itemName?: string,
        itemOwner?: string,
        option?: {
            optionId?: number,
            title?: string,
            type?: string,
            desc?: string,
            file?: string,
            price?: number,
            deleteYN?: boolean,
            discountPrice?: number
        }
    },
    paymentInfo?: {
        method?: string,
        cardName?: string,
        cardNumber?: string,
        purchasedTime?: string,
        revokedTime?: string
    }
    //-1, 0, 1, 2
    status?: number
}