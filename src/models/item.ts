import mongoose, { Schema } from "mongoose"
import Item from "../interfaces/item"

const itemSchema: Schema = new Schema({
    itemId: { type: Number, required: true },
    title: { type: String, required: true },
    owner: { type: String, required: true },
    label: { type: String, required: true },
    // 함수 필요
    likes: { type: Number, required: true, default: 0 },
    coachImg: { type: String, required: false }, //코치 설명 이미지,
    coachInfo: {
        desc: { type: String, required: false },
        career: { type: String, required: false }
    },
    commentImg: { type: String, required: false }, //후기 이미지,
    // detail page에 있는 양식 or 예시의 image와 설명(title)
    template:
        [{
            title: { type: String, required: true }, //양식의 제목,
            // 조직문화 진단 설문 작성 예시
            img: { type: String, required: false }, //양식의 이미지,
        }]//, ....
    ,
    img: { type: String, required: false }, //상품이미지 URL,
    tag: [
        { type: String, required: true }//, ...상품 태그, 설명
    ],
    deleteYN: { type: Boolean, required: true }, //삭제여부,
    // 임베디드 형식
    //option 1번 기준(카드형)
    options:
        [{
            optionId: { type: Number, required: true },
            title: { type: String, required: true }, //옵션명,
            type: { type: String, required: true }, //옵션타입(workbook, coaching, both 중 1)
            desc: { type: String, required: true }, //설명,
            file: { type: String, required: false }, //파일(워크북이 있을 때),
            price: { type: Number, required: true }, //상품 원가격,
            deleteYN: { type: Boolean, required: true }, //삭제여부
            discountPrice: { type: Number, required: true }, //할인된 가격을 계산한 값
            dateStart: { type: String, required: true }, //할인 시작날짜,
            dateEnd: { type: String, required: true }, //할인 마감날짜,
        }]

})

export default mongoose.model<Item>("Item", itemSchema)