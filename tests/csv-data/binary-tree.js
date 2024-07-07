import { records } from "./read-data.js";

/**
 * 1, 2, 3 단계로 나뉜 주소를 합친 전체 주소를 반환.
 * @example - {'1단계': '서울특별시', '2단계':'동대문구', '3단계':'회기동'} 
 * => '서울특별시 동대문구 회기동'
 * @param {*} record 
 * @returns {string} 전체 주소.
 */
function getFullAddress(record) {
    return [record['1단계'], record['2단계'], record['3단계']].join(' ').trim();
}

class Node {
    constructor(oneRecord) {
        this._record = oneRecord;
        this._regionCode;
        this._address;
        this._nx;
        this._ny;
        this._parseData();

        this._nodeHeight = 1;
        this.leftChild = null;
        this.rightChild = null;
    }

    get nodeHeight() {return this._nodeHeight}
    get value() {return this._regionCode}

    calculateNodeHeight() {
        let leftHeight = this.leftChild ? this.leftChild.nodeHeight : 0;
        let rightHeight = this.rightChild ? this.rightChild.nodeHeight : 0;
        this._nodeHeight = Math.max(leftHeight, rightHeight) + 1;
    }

    /**
     * 이 노드의 Balance Factor(BF)를 반환.
     */
    getBF() {
        let leftHeight = this.leftChild ? this.leftChild.nodeHeight : 0;
        let rightHeight = this.rightChild ? this.rightChild.nodeHeight : 0;
        return leftHeight - rightHeight;
    }

    _parseData() {
        this._regionCode = this.record['행정구역코드'];
        this._address = getFullAddress(this.record);
        this._nx = this.record['격자 X'];
        this._ny = this.record['격자 Y'];
    }

    getData() {
        return {
            '행정구역코드': this._regionCode,
            '주소': this._address,
            nx: this._nx,
            ny: this._ny
        };
    }
}

export class BinaryTreeForWeather {
    /**
     * 
     * @param {object[]} records - csv-parse/sync 라이브러리를 이용하여 파싱한 csv 객체 배열.
     */
    constructor(records) {
        this.records = records;
        this.addressCodeTable = this._constructHashTable();  // {'주소': '행정구역코드'}

        this._root = null;
        this._nodeNum = 0; // 이진 트리 내 총 노드 개수. 
    }

    get length() {return this._nodeNum}
    
    _constructHashTable() {
        let hashTable = {};

        this.records.forEach(obj => {
            let address = getFullAddress(obj);
            hashTable[address] = parseInt(obj['행정구역코드']);
        });

        return hashTable;
    }

    insert(newRecord) {
        this._root = this._insert(this._root, newRecord);
        this._nodeNum += 1;
    }

    /**
     * 
     * @param {Node} node 
     * @param {object} record 
     * @returns {Node}
     */
    _insert(node, record) {
        if (!node) return new Node(record);

        let value = parseInt(record['행정구역코드']);
        if (value <= node.value) {
            node.leftChild = this._insert(node.leftChild, record);
        } else if (value >= node.value) {
            node.rightChild = this._insert(node.rightChild, record);
        }
        node.calculateNodeHeight();
        return node;
    }

    _insertAllInnerData() {
        this.records.forEach(obj => {
            this.insert(obj);
        });
    }
}

function testBinaryTree() {
    let bt = new BinaryTreeForWeather(records);
    console.log(bt.addressCodeTable);
}

testBinaryTree();
