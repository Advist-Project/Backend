import mongoose, { Schema } from "mongoose"
import Exhibition from "../interfaces/exhibition"
const exhibitionSchema: Schema = new Schema({
    exhibitionId: { type: Number, required: true }, // 기본키값,
    title: { type: String, required: true }, //기획전 이름,
    //함수 필요
    dateStart: { type: String, required: false }, //기획전 시작날짜,
    dateEnd: { type: String, required: false }, //기획전 마감날짜,
    // 삭제 의미인지 아님 기획적으로 다른 의미 있는지?
    visible: { type: Boolean, required: true }, //공개여부,=delete는 아님.
    rank: { type: Number, required: false }, //랭크, 노출우선순위,
    // 레퍼런스
    itemId: [
        { type: Number, required: false }//,...
        //1, 2, 3
        //모든 정보 필요
    ],
    itemInfo: [
        { type: Object, required: false }
    ]
})
export default mongoose.model<Exhibition>("Exhibition", exhibitionSchema)
