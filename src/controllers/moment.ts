import moment from "moment"
import "moment-timezone"

// 지금 년도, 날짜, 시간
const nowDateTime = (): string => {
    return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
}

// 지금 날짜가 기간 안에 있는지 -> 지금 안쓰임..(일단 안지울게요.)
const effectiveDate = (start: string, end: string): boolean => {
    const now: string = nowDateTime()
    // start <= now <= end
    if (moment(now).isSameOrAfter(start) && moment(now).isSameOrBefore(end)) {
        console.log("effectiveDate : " + true)
        return true
    }

    else {
        console.log("effectiveDate : " + false)
        return false
    }

}

export default { nowDateTime, effectiveDate }