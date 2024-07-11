import { RegionTree } from "../region-tree.js";
import { records } from "../read-data.js";


class TestCases {
    constructor() {
        this.regionTree = new RegionTree(records);
    }

    printTestFirstAddress() {
        // 원하는 코드만 주석 해제하여 실행.
        //console.log(this.regionTree.searchSecondAddress('서울'));
        //console.log(this.regionTree.searchSecondAddress('세종'));
        //console.log(this.regionTree.searchSecondAddress('부산'));
        //console.log(this.regionTree.searchSecondAddress('대구'));
        //console.log(this.regionTree.searchSecondAddress('인천'));
        //console.log(this.regionTree.searchSecondAddress('광주'));
        //console.log(this.regionTree.searchSecondAddress('대전'));
        //console.log(this.regionTree.searchSecondAddress('울산'));
        //console.log(this.regionTree.searchSecondAddress('경기'));
        //console.log(this.regionTree.searchSecondAddress('충청북도'));
        //console.log(this.regionTree.searchSecondAddress('충청남도'));
        //console.log(this.regionTree.searchSecondAddress('전라북도'));
        //console.log(this.regionTree.searchSecondAddress('전라남도'));
        //console.log(this.regionTree.searchSecondAddress('경상북도'));
        //console.log(this.regionTree.searchSecondAddress('경상남도'));
        //console.log(this.regionTree.searchSecondAddress('제주'));
        //console.log(this.regionTree.searchSecondAddress('이어도'));
        console.log(this.regionTree.searchSecondAddress('강원도'));
    }

    printTestSecondAddress() {
        // 원하는 코드만 주석 해제하여 실행.
        //console.log(this.regionTree.searchThirdAddress('서울 종로구'));
        //console.log(this.regionTree.searchThirdAddress('서울 광진구'));
        //console.log(this.regionTree.searchThirdAddress('부산 서구'));
        //console.log(this.regionTree.searchThirdAddress('대구 서구'));
        //console.log(this.regionTree.searchThirdAddress('인천 동구'));
        //console.log(this.regionTree.searchThirdAddress('광주 동구'));
        //console.log(this.regionTree.searchThirdAddress('대전 중구'));
        //console.log(this.regionTree.searchThirdAddress('울산 중구'));
        //console.log(this.regionTree.searchThirdAddress('세종'));
        //console.log(this.regionTree.searchThirdAddress('경기 광주시'));
        //console.log(this.regionTree.searchThirdAddress('충청북도 청주시상당구'));
        //console.log(this.regionTree.searchThirdAddress('충청남도 천안시동남구'));
        //console.log(this.regionTree.searchThirdAddress('전라북도 군산시'));
        //console.log(this.regionTree.searchThirdAddress('전라남도 목포시'));
        //console.log(this.regionTree.searchThirdAddress('경상북도 포항시남구'));
        //console.log(this.regionTree.searchThirdAddress('경상남도 창원시마산회원구'));
        //console.log(this.regionTree.searchThirdAddress('제주 제주시'));
        //console.log(this.regionTree.searchThirdAddress('이어도'));
        console.log(this.regionTree.searchThirdAddress('강원 춘천시'));
    }
}

let tests = new TestCases();

// 원하는 코드만 주석 해제하여 실행.
//tests.printTestFirstAddress();
tests.printTestSecondAddress();
