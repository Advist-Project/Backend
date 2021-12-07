
import _ from "lodash"
import orderReceipt from "../models/orderReceipt"

// userId로 table찾기 
// status = 1 또는 2 => 프론트에서 결제 완료 api호출 했으면 2만
// status = 3 => 변심에 대한 환불 + 기타)
// 날짜 순으로 내림차순
const findPaymentHistory = async (userId: number) => {
    try {
        const paymentHistroy = await orderReceipt.find({ userId: userId })
            .where("status").in([1, 2, 3, 4])
            .sort({ "paymentInfo.purchasedTime": -1 })

        // 구매 내역이 없는 경우
        if (_.isEmpty(paymentHistroy)) return -1
        else return paymentHistroy
    }
    catch (error) {
        console.log(error.message)
        return 0
    }
}
const checkStatus = async (status: any) => {
    try {

        if (status === 3)
            return "환불 완료"
        else if (status === 4)
            return "후기 작성 완료"
        else if (status === 2 || status === 1)
            return "결제 완료"
        else if (status === 0)
            return "검증 실패 후 취소완료"
        else
            return "결제프로세스 중단"
    }
    catch (error) {
        return "status번호가 잘못됨"
    }
}


export default {
    findPaymentHistory,
    checkStatus
}