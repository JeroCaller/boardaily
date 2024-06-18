// 테스트용
export function printLocalStorage() {
    console.log('로컬 스토리지 현재 내역');
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(`${key} : ${localStorage.getItem(key)}`);
    }
    console.log('로컬 스토리지 현재 내역 끝');
}

/**
 * 주어진 input[type="text"] 요소에 밑줄을 긋거나 취소한다. 
 * @param {boolean} isUnderline - 밑줄 추가 여부. true 시 밑줄이 추가되고, false 시 밑줄을 삭제한다. 
 * @param {HTMLElement} inputText - 밑줄 스타일 지정하고자 하는 input[type="text"] 요소
 * @returns {HTMLElement} - inputText - 작업이 완료된 text 타입의 input 요소
 */
export function underlineInputText(isUnderline, inputText) {
    if (isUnderline) {
        inputText.style.textDecoration = 'line-through';
        inputText.style.color = 'grey';
    } else {
        inputText.style.textDecoration = 'none';
        inputText.style.color = 'black';
    }
    return inputText;
}
