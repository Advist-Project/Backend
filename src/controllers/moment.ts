import moment from "moment"
import "moment-timezone"

// 지금 년도, 날짜, 시간
const nowDateTime = (): string => {
    return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
}

// 지금 날짜가 기간 안에 있는지 
const effectiveDate = (start: string, end: string): boolean => {
    const now: string = nowDateTime()
    // start <= now <= end
    if (moment(now).isSameOrAfter(start) && moment(now).isSameOrBefore(end)) {
        return true
    }

    else {
        return false
    }

}

export default { nowDateTime, effectiveDate }