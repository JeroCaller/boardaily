/**
 * 요일 번호를 입력하면 해당 요일을 문자열로 반환.
 * @param {number} weekNum - Date().getDay()로 얻은 요일 번호
 * @returns 
 */
export function getWeekName(weekNum) {
    switch (weekNum) {
        case 0:
            return "일";
        case 1:
            return "월";
        case 2:
            return "화";
        case 3:
            return "수";
        case 4:
            return "목";
        case 5:
            return "금";
        case 6:
            return "토";
    }
}