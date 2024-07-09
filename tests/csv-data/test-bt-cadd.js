/**
 * binary tree와 change address 기능 통합 테스트.
 */

import { BinaryTreeForWeather } from "./binary-tree.js";
import { records } from "./read-data.js";
import assert from 'node:assert/strict';

let bt = new BinaryTreeForWeather(records);

function testSimple() {
    assert.deepStrictEqual(bt.search('서울'), {
        '행정구역코드': '1100000000', '주소': '서울특별시', nx: '60', ny: '127'
    });
    assert.deepStrictEqual(bt.search('부산'), {
        '행정구역코드': '2600000000', '주소': '부산광역시', nx: '98', ny: '76'
    });
    assert.deepStrictEqual(bt.search('세종'), {
        '행정구역코드': '3611000000', '주소': '세종특별자치시 세종특별자치시', nx: '66', ny: '103'
    });
}

testSimple();
