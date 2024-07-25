/**
 * 여러 key=value 쌍 변수들에 대해, 
 * url에 담을 query string을 구성한다. 
 * '?'부터 시작한다.
 * @param {obj} keyValue 
 */
export function toQueryString(keyValue) {
    let resultStr = '?';

    for(let key in keyValue) {
        resultStr += key + '=' + keyValue[key] + '&';
    }

    if (resultStr.length > 1) {
        // 맨 마지막에 붙은 "&" 기호를 삭제한다. 
        resultStr = resultStr.slice(0, -1);
    }
    
    return resultStr;
}

/**
 * 
 * @param {Date} dateObj 
 * @returns {string} - YYYYMMDD 형태의 문자열
 */
export function getDateYYYYMMDD(dateObj) {
    let dateArr = [];
    dateArr.push(dateObj.getFullYear().toString());
    dateArr.push(
        (dateObj.getMonth() + 1).toString().padStart(2, 0)
    );
    dateArr.push(
        dateObj.getDate().toString().padStart(2, 0)
    );
    return dateArr.join('');
}

/**
 * 주어진 Date 객체의 시간, 분을 HHMM 형태의 문자열로 반환.
 * @param {Date} dateObj 
 * @returns {string} - HHMM 형태의 문자열.
 */
export function getTimeHHMM(dateObj) {
    let timeArr = [
        dateObj.getHours().toString().padStart(2, 0),
        dateObj.getMinutes().toString().padStart(2, 0),
    ];
    return timeArr.join('');
}

/**
 * api 요구 명세에 맞게끔 현재 시각을 특정 형태의 최신 시각 형태로 
 * 바꿔주는 함수. 
 * 현재 시각에서 45분을 넘긴 경우, 현재 시각 그대로 반환. 
 * 만약 현재 시각이 45분 이전인 경우, 한 시간 전의 시각으로 반환.
 * @example - 현재 시각이 "05:47"인 경우, "0547" 그대로 반환. 
 * 현재 시각이 "05:20"인 경우, "04:30"으로 반환됨.
 * @param {Date} dateObj 
 * @returns {string} - HHMM 형태의 문자열.
 */
export function setBaseTime(dateObj) {
    let copiedDate = new Date();
    copiedDate.setHours(dateObj.getHours(), dateObj.getMinutes());

    let timeArr = [0, 0];

    if (copiedDate.getMinutes() < 45) {
        copiedDate.setHours(copiedDate.getHours() - 1, 30);
    }
    timeArr[0] = copiedDate.getHours().toString().padStart(2, 0);
    timeArr[1] = copiedDate.getMinutes().toString().padStart(2, 0);

    return timeArr.join('');
}
