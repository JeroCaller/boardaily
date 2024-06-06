import * as calcLogic from '../js/table-page/calculator-logic.js';
import * as testTools from './my-test-tool.js';

function testCalcExp(expStr, expected, silence) {
    return testTools.testFrame(expStr, calcLogic.calculateExpression, expected, silence);
}

function testAutoFillParenthesis(expStr, expected, silence) {
    return testTools.testFrame(expStr, calcLogic.autoFillParenthesis, expected, silence);
}

function testAddWhichParenthesis(expSTr, expected, silence) {
    return testTools.testFrame(expSTr, calcLogic.addWhichParenthesis, expected, silence);
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

    testTools.countTests(
        applySilence(testCalcExp)("1+2*6/2", 7),
        applySilence(testCalcExp)("(1+2)*(6/2)", 9),
        applySilence(testCalcExp)("-3+5", 2),
        applySilence(testCalcExp)("-+", syntaxErrorMsg),
        applySilence(testCalcExp)("50%", syntaxErrorMsg),
        applySilence(testAutoFillParenthesis)("(((8)))", "(((8)))"),
        applySilence(testAutoFillParenthesis)("(((1+2))", "(((1+2)))"),
        applySilence(testAutoFillParenthesis)("(((1+3", "(((1+3)))"),
        applySilence(testAddWhichParenthesis)("", "("),
        applySilence(testAddWhichParenthesis)("+", "("),
        applySilence(testAddWhichParenthesis)("-", "("),
        applySilence(testAddWhichParenthesis)("/", "("),
        applySilence(testAddWhichParenthesis)("*", "("),
        applySilence(testAddWhichParenthesis)("(", "("),
        applySilence(testAddWhichParenthesis)(")", ""),
        applySilence(testAddWhichParenthesis)("0", "*("),
        applySilence(testAddWhichParenthesis)("3+", "("),
        applySilence(testAddWhichParenthesis)("(3+(20/(9+2))", ")"),
        applySilence(testAddWhichParenthesis)("(3+(20/(9+2))*2", ")"),
        applySilence(testAddWhichParenthesis)("(3+(20/(9+2)))*2", "*("),
    );
}

main(true);
