import { Document } from 'mongoose'


export default interface Exhibition extends Document {
    exhibitionId: number, // 기본키값,
    title?: string, //기획전 이름,
    //함수 필요
    dateStart?: string, //기획전 시작날짜,
    dateEnd?: string, //기획전 마감날짜,
    // 삭제 의미인지 아님 기획적으로 다른 의미 있는지?
    visible?: boolean, //공개여부,=delete는 아님.
    rank?: number, //랭크, 노출우선순위,
    // 레퍼런스
    itemId?: [
        number//,
        //1, 2, 3
        //모든 정보 필요
    ],
    itemInfo?: [object]
}