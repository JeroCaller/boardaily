/**
 * 주어진 주소 문자열을 검색 가능한 문자열로 변환한다. 
 * @example 
 * >> console.log(changeAddress('서울'));
 * >> '서울특별시'
 * @param {string} targetAddress 
 * @param {boolean} autoAdd - 1, 2단계 주소명이 서로 같은 경우, 1단계 주소만 넣어도 
 * 2단계 주소를 자동으로 넣을지 결정. true시 실행됨. false 또는 생략 시 실행되지 않음.
 * @example
 * >> console.log(changeAddress('세종', true))  // '세종특별자치시 세종특별자치시'
 * >> console.log(changeAddress('세종')) // '세종특별자치시'
 * @returns {string} 변환된 주소 문자열
 */
export function changeAddress(targetAddress, autoAdd) {
    targetAddress = targetAddress.trim();

    // {원문: [축약]}
    const addressTable = {
        /*
        '서울': '서울특별시',
        '부산': '부산광역시',
        '대구': '대구광역시',
        '인천': '인천광역시',
        '광주': '광주광역시',
        '대전': '대전광역시',
        '울산': '울산광역시',
        '세종': '세종특별자치시',
        '경기': '경기도',
        '제주': '제주특별자치도',
        '강원':  '강원특별자치도', */
        '서울특별시': ['서울', '서울시'],
        '부산광역시': ['부산', '부산시'],
        '대구광역시': ['대구', '대구시'],
        '인천광역시': ['인천', '인천시'],
        '광주광역시': ['광주', '광주시'],
        '대전광역시': ['대전', '대전시'],
        '울산광역시': ['울산', '울산시'],
        '세종특별자치시': ['세종', '세종시'],
        '경기도': ['경기'],
        '제주특별자치도': ['제주', '제주도'],
        '강원특별자치도': ['강원', '강원도']
    };

    let result = '';

    // 세종 지역 주소 처리 로직
    let sejong = targetAddress.match(/세종/g);
    if (sejong) {
        switch (sejong.length) {
            case 1:
                if (autoAdd) {
                    result = '세종특별자치시 ';
                }
            case 2:
                result += targetAddress.replace(/세종(?=\s|$)/g, '세종특별자치시');
        }
        return result;
    }

    // 세종시 외 지역 주소 처리 로직
    let firstAddress = targetAddress.split(' ')[0];
    for (let fullAddress in addressTable) {
        if (firstAddress == fullAddress) {
            result = targetAddress;
            break;
        }
        addressTable[fullAddress].forEach(shortAddress => {
            if (firstAddress == shortAddress) {
                result = targetAddress.replace(new RegExp(`${shortAddress}`), fullAddress);
                return;
            }
        })
    }

    if (!result) return targetAddress;
    return result;
}

/**
 * 1, 2, 3 단계로 나뉜 주소를 합친 전체 주소를 반환.
 * @example - {'1단계': '서울특별시', '2단계':'동대문구', '3단계':'회기동'} 
 * => '서울특별시 동대문구 회기동'
 * @param {*} record 
 * @returns {string} 전체 주소.
 */
export function getFullAddress(record) {
    return [record['1단계'], record['2단계'], record['3단계']].join(' ').trim();
}
