export {testFrame, countTests};

/**
 * 
 * @param {*} arg - 테스트 함수의 인자
 * @param {*} funcName - 테스트 함수명
 * @param {*} expected - 테스트 예상 결과값
 * @param {boolean} silence - 테스트 결과 메시지 생략 여부. true시 해당 메시지 출력되지 않음.
 * @returns 
 */
function testFrame(arg, funcName, expected, silence) {
    let result;
    let pfInBool;
    let pfMsg;

    if (silence == undefined || null) {
        silence = false;
    }

    try {
        result = funcName(arg);
        pfInBool = result == expected;
    } catch (e) {
        if (expected == e.name) {
            // 이미 예상된 에러인가? 맞다면 테스트 통과로 간주.
            result = e.name;
            pfInBool = true;
        } else {
            console.log(`${funcName.name} 테스트에서 예기치 못한 에러가 발생했습니다.`);
            console.log(e);
            console.log(`=============== 에러 메시지 끝 =================`);
        }
    }

    if (!silence) {
        pfMsg = pfInBool ? 'Pass' : "Failed";
        console.log(`${funcName.name} 테스트 결과`);
        console.log(`input : ${arg}  |  output : ${result}  |  expected : ${expected}  |  result : ${pfMsg}`);
        console.log(`=================================================================`);
    }
    return pfInBool;
}

/**
 * 테스트들의 결과들을 토대로 통과한 테스트 수와 전체 테스트 수 정보를 출력한다. 
 * @param  {...any} testFuncsCalled - 테스트 함수 호출문.
 */
function countTests(...testFuncsCalled) {
    let passedCount = 0;
    for (let i = 0; i < testFuncsCalled.length; i++) {
        if (testFuncsCalled[i]) {
            passedCount += 1;
        }
    }

    console.log(`통과한 테스트 수 / 전체 테스트 수 : ${passedCount}/${testFuncsCalled.length}`);

    let diff = testFuncsCalled.length - passedCount
    if (diff > 0) {
        console.log(`실패한 테스트 수: ${diff}`);
    }
}