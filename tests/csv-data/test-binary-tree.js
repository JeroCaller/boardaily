import { BinaryTreeForWeather } from "./binary-tree.js";
import { records } from "./read-data.js";

function testBinaryTree() {
    let bt = new BinaryTreeForWeather(records);
    // console.log(bt.addressCodeTable);
    console.log(bt.search('경상남도 산청군 생초면'));
    console.log(bt.search('경상남도 산청군'));
    console.log(bt.search('서울특별시'));
    console.log(bt.search('서울'));
    console.log(bt.search('세종특별자치시 조치원읍'))
    console.log(bt.length);
}

testBinaryTree();
