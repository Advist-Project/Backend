import _, { template } from "lodash"
import orderReceipt from "../models/orderReceipt"


// 구매내역 불러오기
const findAdminPaymentHistory = async () => {
    try {
        const paymentHistroy = await orderReceipt.find()
            .sort({ "createdAt": -1 })
        // 구매 내역이 없는 경우
        if (_.isEmpty(paymentHistroy)) return -1
        else return paymentHistroy
    }
    catch (error) {
        console.log("findAdminPaymentHistory" + error.message)
        return 0
    }
}



export default { findAdminPaymentHistory }
