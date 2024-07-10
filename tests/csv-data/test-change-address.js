import { changeAddress } from "../change-address.js";
import assert from 'node:assert/strict';

function testChangeAddressSimple() {
    assert.strictEqual(changeAddress('서울'), '서울특별시');
    assert.strictEqual(changeAddress('부산'), '부산광역시');
    assert.strictEqual(changeAddress('대구'), '대구광역시');
    assert.strictEqual(changeAddress('인천'), '인천광역시');
    assert.strictEqual(changeAddress('광주'), '광주광역시');
    assert.strictEqual(changeAddress('대전'), '대전광역시');
    assert.strictEqual(changeAddress('울산'), '울산광역시');
    assert.strictEqual(changeAddress('경기'), '경기도');
    assert.strictEqual(changeAddress('제주'), '제주특별자치도');
    assert.strictEqual(changeAddress('강원'), '강원특별자치도');
}

function testChangeAddressSimpleNoChange() {
    assert.strictEqual(changeAddress('서울특별시'), '서울특별시');
    assert.strictEqual(changeAddress('부산광역시'), '부산광역시');
    assert.strictEqual(changeAddress('대구광역시'), '대구광역시');
    assert.strictEqual(changeAddress('인천광역시'), '인천광역시');
    assert.strictEqual(changeAddress('광주광역시'), '광주광역시');
    assert.strictEqual(changeAddress('대전광역시'), '대전광역시');
    assert.strictEqual(changeAddress('울산광역시'), '울산광역시');
    assert.strictEqual(changeAddress('경기도'), '경기도');
    assert.strictEqual(changeAddress('제주특별자치도'), '제주특별자치도');
    assert.strictEqual(changeAddress('강원특별자치도'), '강원특별자치도');
    assert.strictEqual(changeAddress('경상남도'), '경상남도');
}

function testChangeAddressStageTwo() {
    assert.strictEqual(changeAddress('서울 종로구'), '서울특별시 종로구');
    assert.strictEqual(changeAddress('부산 중구'), '부산광역시 중구');
    assert.strictEqual(changeAddress('대구 서구'), '대구광역시 서구');
    assert.strictEqual(changeAddress('인천 미추홀구'), '인천광역시 미추홀구');
    assert.strictEqual(changeAddress('광주 동구'), '광주광역시 동구');
    assert.strictEqual(changeAddress('대전 중구'), '대전광역시 중구');
    assert.strictEqual(changeAddress('울산 울주군'), '울산광역시 울주군');
    assert.strictEqual(changeAddress('경기 광주시'), '경기도 광주시');
    assert.strictEqual(changeAddress('제주 서귀포시'), '제주특별자치도 서귀포시');
    assert.strictEqual(changeAddress('강원 춘천시'), '강원특별자치도 춘천시');
}

function testChangeAddressStageThree() {
    assert.strictEqual(changeAddress('서울 종로구 사직동'), '서울특별시 종로구 사직동');
    assert.strictEqual(changeAddress('부산 중구 중앙동'), '부산광역시 중구 중앙동');
    assert.strictEqual(changeAddress('대구 서구 내당4동'), '대구광역시 서구 내당4동');
    assert.strictEqual(changeAddress('인천 미추홀구 숭의1.3동'), '인천광역시 미추홀구 숭의1.3동');
    assert.strictEqual(changeAddress('광주 동구 서남동'), '광주광역시 동구 서남동');
    assert.strictEqual(changeAddress('대전 중구 유천1동'), '대전광역시 중구 유천1동');
    assert.strictEqual(changeAddress('울산 울주군 온산읍'), '울산광역시 울주군 온산읍');
    assert.strictEqual(changeAddress('세종 세종특별자치시 조치원읍'), '세종특별자치시 세종특별자치시 조치원읍');
    assert.strictEqual(changeAddress('경기 광주시 광남2동'), '경기도 광주시 광남2동');
    assert.strictEqual(changeAddress('제주 서귀포시 대정읍/마라도포함'), '제주특별자치도 서귀포시 대정읍/마라도포함');
    assert.strictEqual(changeAddress('강원 춘천시 동면'), '강원특별자치도 춘천시 동면');
}

function testChangeAddressSejong() {
    assert.strictEqual(changeAddress('세종', true), '세종특별자치시 세종특별자치시');
    assert.strictEqual(changeAddress('세종 세종', true), '세종특별자치시 세종특별자치시');
    assert.strictEqual(changeAddress('세종특별자치시', true), '세종특별자치시 세종특별자치시');
    assert.strictEqual(changeAddress('세종특별자치시 조치원읍', true), '세종특별자치시 세종특별자치시 조치원읍');
    assert.strictEqual(changeAddress('세종 조치원읍', true), '세종특별자치시 세종특별자치시 조치원읍');
    assert.strictEqual(changeAddress('세종 세종특별자치시', true), '세종특별자치시 세종특별자치시');
}

testChangeAddressSimple();
testChangeAddressSimpleNoChange();
testChangeAddressStageTwo();
testChangeAddressStageThree();
testChangeAddressSejong();
