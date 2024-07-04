import * as ttool from '../my-test-tool.js';
import { toQueryString } from '../../api-tools/query-str.js';

function testToQueryString(arg, expected, silence) {
    return ttool.testFrame(arg, toQueryString, expected, silence);
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

    let testArr = [
        [testToQueryString, [{"name": "jane"}, "?name=jane"]],
        [testToQueryString, [{}, "?"]],
        [testToQueryString, [{"name": "jane", "age": 12}, "?name=jane&age=12"]],
        [testToQueryString, [
            {
                "name": "john",
                "age": "32",
                "job": "web-developer"
            },
            "?name=john&age=32&job=web-developer"
        ]],
    ];

    let appliedTests = [];
    for (let record of testArr) {
        appliedTests.push(applySilence(record[0])(...record[1]));
    }
    ttool.countTests(...appliedTests);
}

main();