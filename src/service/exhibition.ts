import _ from "lodash"
import Item from "../models/item"
import Exhibition from "../models/exhibition"
import itemService from "./item"
import moment from "../service/moment"
import ExhibitionInterface from "../interfaces/exhibition"
import itemController from "./item"

const findFirstExhibition = Exhibition.findOne({ rank: 1 });

const findPeriodExhibition = async (type: String) => {
    try {
        const now = moment.nowDateTime()
        //어드민
        if (type === 'admin') {
            return await Exhibition.find(
                {
                    dateStart: { $lte: now },
                    dateEnd: { $gte: now }
                }
            )
                .sort({ "rank": 1 })

        }
        //메인
        return await Exhibition.find(
            {
                dateStart: { $lte: now },
                dateEnd: { $gte: now }
            }
        )
            .where("visible").equals(true)
            .where("rank").ne(1)
            .sort({ "rank": 1 })

    } catch (error) {
        console.log("findPeriodExhibition" + error.message)
    }
}

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
                    const realOptions = await itemService.isOkOptions(item?.options, itemId)
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

const referenceOfExhibitionAdmin = async (itemIds?: Array<number>) => {
    try {
        if (itemIds == undefined) return -1
        else {
            const infoPromise = itemIds.map(async function (itemId: number): Promise<object | null> {
                const item = await Item.findOne({ itemId: itemId })
                // 빈 값을 찾는다
                if (_.isEmpty(item)) {
                    // 안그러면 undefine으로 값이 채워짐.-> map이라서
                    return {}
                } else {
                    const realOptions = await itemController.isOkOptionsAdmin(item?.options, itemId)
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




export default {
    findFirstExhibition,
    findPeriodExhibition,
    referenceOfExhibition,
    referenceOfExhibitionAdmin
}