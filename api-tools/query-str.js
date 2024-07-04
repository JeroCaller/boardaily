/**
 * 여러 key=value 쌍 변수들에 대해, 
 * url에 담을 query string을 구성한다. 
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
