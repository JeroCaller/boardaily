import * as calcLogic from '../js/table-page/calculator-logic.js';
import * as testTools from './my-test-tool.js';

function testCalcExp(expStr, expected, silence) {
    return testTools.testFrame(expStr, calcLogic.calculateExpression, expected, silence);
}

function testAutoFillParenthesis(expStr, expected, silence) {
    return testTools.testFrame(expStr, calcLogic.autoFillParenthesis, expected, silence);
}

function testAddWhichParenthesis(expStr, expected, silence) {
    return testTools.testFrame(expStr, calcLogic.addWhichParenthesis, expected, silence);
}

function testReplacePercent(expStr, expected, silence) {
    return testTools.testFrame(expStr, calcLogic.replacePercent, expected, silence);
}

/**
 * @param {boolean | undefined} allSilence - 각 테스트 결과 메시지 생략 여부. true 시 생략됨.
 */
function main(allSilence) {

    function applySilence(funcName) {
        function wrap(...args) {
            return funcName(...args, allSilence);
        };
        return wrap;
    }

    let syntaxErrorMsg = "잘못된 수식입니다.";

    let testArr = [
        [testCalcExp, ["1+2*6/2", 7]],
        [testCalcExp, ["(1+2)*(6/2)", 9]],
        [testCalcExp, ["-3+5", 2]],
        [testCalcExp, ["-+", syntaxErrorMsg]],
        [testCalcExp, ["50%", syntaxErrorMsg]],
        [testAutoFillParenthesis, ["(((8)))", "(((8)))"]],
        [testAutoFillParenthesis, ["(((1+2))", "(((1+2)))"]],
        [testAutoFillParenthesis, ["(((1+3", "(((1+3)))"]],
        [testAddWhichParenthesis, ["", "("]],
        [testAddWhichParenthesis, ["+", "("]],
        [testAddWhichParenthesis, ["-", "("]],
        [testAddWhichParenthesis, ["/", "("]],
        [testAddWhichParenthesis, ["*", "("]],
        [testAddWhichParenthesis, ["(", "("]],
        [testAddWhichParenthesis, [")", ""]],
        [testAddWhichParenthesis, ["0", "*("]],
        [testAddWhichParenthesis, ["3+", "("]],
        [testAddWhichParenthesis, ["(3+(20/(9+2))", ")"]],
        [testAddWhichParenthesis, ["(3+(20/(9+2))*2", ")"]],
        [testAddWhichParenthesis, ["(3+(20/(9+2)))*2", "*("]],
        [testAddWhichParenthesis, ["(3", ")"]],
        [testAddWhichParenthesis, ["(3+5", ")"]],
        [testReplacePercent, ["100+20", "100+20"]],
        [testReplacePercent, ["100%", "100%"]],
        [testReplacePercent, ["100+20%", "100+20"]],
        [testReplacePercent, ["200+20%", "200+40"]],
        [testReplacePercent, ["200+30%+300+10%", "200+60+300+30"]],
        [testReplacePercent, ["(30+30%)+(20+40%)", "(30+9)+(20+8)"]],
        [testReplacePercent, ["30+30%+10", "30+9+10"]],
        [testReplacePercent, ["50+(50%+2)", "50+(50%+2)"]],
    ];
    let appliedTests = [];
    for (let record of testArr) {
        appliedTests.push(applySilence(record[0])(...record[1]));
    }
    testTools.countTests(...appliedTests);
}

main(true);
