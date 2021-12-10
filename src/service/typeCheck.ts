import Exhibition from "../interfaces/exhibition"

function isExhibitionInfo(x: any): x is Exhibition["itemInfo"] {
    return typeof x === "object" && typeof x !== undefined
}
function isNull(x: any): x is null { //tsconfig에서 strictNullCheck 옵션을 true로 했을 경우에는 undefined와 null을 따로 체크해야함
    return typeof x === "undefined"
}


export default {
    isExhibitionInfo,
    isNull
}
