import { Document } from 'mongoose'

export default interface Item extends Document {
    itemId?: number, //기본키값,상품ID,
    title?: string, //상품 이름,
    owner?: string, //상품 제작자,
    label?: string, //라벨 이름(NEW, BEST, null),
    // 함수 필요
    likes?: number, //좋아요,
    desc?: string, //상품설명,
    coachImg?: string, //코치 설명 이미지,
    commentImg?: string, //후기 이미지,  
    // detail page에 있는 양식 or 예시의 image와 설명(title)
    template:
    [{
        title: string, //양식의 제목,
        // 조직문화 진단 설문 작성 예시
        img?: string, //양식의 이미지,
    }]//, ....
    ,
    img?: string, //상품이미지 URL,
    tag: [
        string//, ...상품 태그, 설명
    ]
    deleteYN?: boolean, //삭제여부,
    // 임베디드 형식
    //option 1번 기준(카드형)
    options:
    [{
        optionId?: number,
        title?: string, //옵션명,
        type?: string, //옵션타입(workbook, coaching, both 중 1)
        desc?: string, //설명,
        file?: string, //파일(워크북이 있을 때),
        price?: number, //상품 원가격,
        deleteYN?: boolean, //삭제여부
        discountPrice?: number, //할인된 가격을 계산한 값
        dateStart?: Date, //할인 시작날짜,
        dateEnd?: Date, //할인 마감날짜,
    }]

}