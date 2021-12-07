import Moment from "../service/moment"
import Item from "../models/item"

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

export default {
    itemHeartFindUpdate,
    isOkOptions,
    isOkOptionsAdmin
}