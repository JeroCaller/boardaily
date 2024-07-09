/**
 * binary tree와 change address 기능 통합 테스트.
 */

import { BinaryTreeForWeather } from "../binary-tree.js";
import { records } from "../read-data.js";
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
    assert.deepStrictEqual(bt.search('제주'), {
        '행정구역코드': '5000000000', '주소': '제주특별자치도', nx: '52', ny: '38'
    });
    assert.deepStrictEqual(bt.search('경기'), {
        '행정구역코드': '4100000000', '주소': '경기도', nx: '60', ny: '120'
    });
    assert.deepStrictEqual(bt.search('경상남도'), {
        '행정구역코드': '4800000000', '주소': '경상남도', nx: '91', ny: '77'
    });
}

function testStageTwo() {
    assert.deepStrictEqual(bt.search('서울 종로구'), {
        '행정구역코드': '1111000000', '주소': '서울특별시 종로구', nx: '60', ny: '127'
    });
    assert.deepStrictEqual(bt.search('부산 중구'), {
        '행정구역코드': '2611000000', '주소': '부산광역시 중구', nx: '97', ny: '74'
    });
    assert.deepStrictEqual(bt.search('세종 조치원읍'), {
        '행정구역코드': '3611025000', '주소': '세종특별자치시 세종특별자치시 조치원읍', nx: '66', ny: '106'
    });
    assert.deepStrictEqual(bt.search('제주 서귀포시'), {
        '행정구역코드': '5013000000', '주소': '제주특별자치도 서귀포시', nx: '52', ny: '33'
    });
    assert.deepStrictEqual(bt.search('경기 광주시'), {
        '행정구역코드': '4161000000', '주소': '경기도 광주시', nx: '65', ny: '123'
    });
    assert.deepStrictEqual(bt.search('경상남도 창원시의창구'), {
        '행정구역코드': '4812100000', '주소': '경상남도 창원시의창구', nx: '90', ny: '77'
    });
}

function testStageThree() {
    assert.deepStrictEqual(bt.search('서울 종로구 사직동'), {
        '행정구역코드': '1111053000', '주소': '서울특별시 종로구 사직동', nx: '60', ny: '127'
    });
    assert.deepStrictEqual(bt.search('부산 중구 중앙동'), {
        '행정구역코드': '2611051000', '주소': '부산광역시 중구 중앙동', nx: '97', ny: '74'
    });
    assert.deepStrictEqual(bt.search('세종 세종특별자치시 조치원읍'), {
        '행정구역코드': '3611025000', '주소': '세종특별자치시 세종특별자치시 조치원읍', nx: '66', ny: '106'
    });
    assert.deepStrictEqual(bt.search('제주 서귀포시 대정읍/마라도포함'), {
        '행정구역코드': '5013025000', '주소': '제주특별자치도 서귀포시 대정읍/마라도포함', nx: '48', ny: '32'
    });
    assert.deepStrictEqual(bt.search('경기 광주시 광남2동'), {
        '행정구역코드': '4161057000', '주소': '경기도 광주시 광남2동', nx: '64', ny: '123'
    });
    assert.deepStrictEqual(bt.search('경상남도 창원시의창구 동읍'), {
        '행정구역코드': '4812125000', '주소': '경상남도 창원시의창구 동읍', nx: '91', ny: '78'
    });
}

testSimple();
testStageTwo();
testStageThree();
