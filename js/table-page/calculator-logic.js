/**
 * 문자열로 전달된 수식을 계산하여 이를 반환한다.
 * @param {string} expStr - 문자열 형태의 전체 수식
 * @returns {number} 수식 결과값
 */
export function calculateExpression(expStr) {
    try {
        return (new Function(`return ${expStr};`))();
    } catch (e) {
        if (e instanceof SyntaxError) {
            return '잘못된 수식입니다.';
        } else {
            throw e;
        }
    }
}

/**
 * 수식에서 여는 괄호와 닫은 괄호의 개수 차를 반환.
 * @param {string} expStr - 문자열 형태의 수식
 * @returns {number} - 여는 괄호의 개수에서 닫은 괄호의 개수를 뺀 수.
 */
function countParenthesis(expStr) {
    let parthArr = expStr.match(/[()]/g);
    if (parthArr == null) {
        return 0;
    }

    let openCount = 0;
    let closedCount = 0;
    parthArr.forEach((element) => {
        if (element == "(") {
            openCount += 1;
        } else if (element == ")") {
            closedCount += 1;
        }
    });
    return openCount - closedCount;
}

/**
 * 주어진 수식으로 괄호 중 여는 괄호를 추가해야할지 
 * 닫는 괄호를 추가해야할지 결정하여 두 괄호 중 하나를 반환하는 함수.
 * @param {string} expStr - 입력된 수식
 * @returns {string} '(' 또는 ')'
 */
export function addWhichParenthesis(expStr) {
    const openParth = "(";
    const closedParth = ")";
    let endChar = expStr[expStr.length-1];
    let parthDiff = countParenthesis(expStr);

    function returnOpenOrClosed() {
        if (parthDiff > 0) {
            return closedParth;
        }
        if (parthDiff == 0) {
            /*
                여는 괄호 수 = 닫은 괄호 수 상황에서 
                닫은 괄호 바로 뒤에서 괄호 버튼이 입력된 경우, 
                바로 이전 괄호가 하나의 수식을 감싸고 있다고 가정하고, 
                여기에 이후에 올 괄호 내 수식과 곱한다고 가정.
            */
            return "*" + openParth;
        }
        return '';
    }

    if (endChar && endChar.match(/\d/)) {
        return returnOpenOrClosed();
    }

    switch (endChar) {
        case "+":
        case "-":
        case "/":
        case "*":
        case undefined:
            // 수식 문자열의 길이가 0일 경우.
            return openParth;
        case openParth:
            return openParth;
        case "\\d":
        case '%':
        case closedParth:
            return returnOpenOrClosed();
        default:
            return '';
    }
}

/**
 * 입력된 문자열 내 수식에 괄호가 불완전하게 있는 경우, 이를 자동으로 채워주는 함수. 
 * 여는 괄호의 수가 닫는 괄호의 수보다 많을 때 닫는 괄호의 수를 자동 추가하여 
 * 두 괄호의 수를 맞춘다. 
 * 닫는 괄호 자동 추가로 완성된 수식이 이상한 수식이 되어 계산 실패해도 이 함수는 책임지지 않는다.
 * 이는 애초에 수식 자체에 문제가 있기 떄문.
 * @param {string} expStr - 문자열로 표현된 수식 
 * @returns {string} 괄호를 적절히 처리한 수식
 */
export function autoFillParenthesis(expStr) {
    let diff = countParenthesis(expStr);
    if (diff > 0) {
        for(let i = 0; i < diff; i++) {
            expStr += ")";
        }
    }
    return expStr;
}

/**
 * 수식에 % 기호가 있는 경우 이를 계산한 결과를 다시 수식에 대입하는 함수.
 * @param {string} expStr - 문자열 형태로 나타낸 수식
 * @returns {string} 수정이 완료된 수식 문자열
 * @example - console.log(replacePercent("100+20%")); // "120"
 */
export function replacePercent(expStr) {
    /*
        \d+.?\d* : 정수 또는 실수
    */
    let matchResult = expStr.match(/\d+.?\d*[-+*\/]\d+.?\d*%/g);
    if (!matchResult) {
        return expStr;
    }

    let replacedSrc = expStr;
    let replacedIdx = [];
    const delimiter = "@";
    for (let matchedExp of matchResult) {
        replacedIdx.push(replacedSrc.indexOf(matchedExp));
        replacedSrc = replacedSrc.replace(matchedExp, delimiter);
    }
    let replacedSrcArr = replacedSrc.split('');
    /*
    console.log(replacedSrc);
    console.log(replacedSrcArr);
    console.log(replacedIdx);
    */
    // %가 포함된 수식을 %가 없는 수로 바꾼다. 
    for (let [idx, matchedExp] of matchResult.entries()) {
        let binaryOperator = matchedExp.match(/[^\d%.]/)[0];
        /*
        console.log(matchedExp);
        console.log(binaryOperator);
        */
        let nums = matchedExp.split(binaryOperator);
        for (let i = 0; i < nums.length; i++) {
            nums[i] = parseFloat(nums[i]);
        }
        let calculatedNum = nums[0] * (nums[1] / 100);
        matchResult[idx] = nums[0].toString() + binaryOperator + calculatedNum.toString();
    }
    
    /*
    console.log(matchResult);
    console.log(replacedIdx);
    console.log(replacedSrcArr);
    */
    for (let i = 0; i < replacedSrcArr.length; i++) {
        let targetIndex = replacedSrcArr.indexOf(delimiter);
        if (targetIndex == -1) {
            break;
        }
        replacedSrcArr[targetIndex] = matchResult[i];
    }
    //console.log(replacedSrcArr);

    return replacedSrcArr.join('');
}
