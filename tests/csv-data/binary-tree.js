import * as addTool from './change-address.js';

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
        this._regionCode = this._record['행정구역코드'];
        this._address = addTool.getFullAddress(this._record);
        this._nx = this._record['격자 X'];
        this._ny = this._record['격자 Y'];
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

class SelfBalance {
    /**
     * 이진 트리가 왼쪽으로 기울어졌을 경우. 
     * 이를 고쳐 좌우 균형을 맞춘다.
     * @param {Node} node 
     * @returns {Node}
     */
    static fixWhenLeftLeaning(node) {
        if (node.getBF() >= 2) {
            // left - left
            if (node.leftChild.getBF() >= 0) {
                node = this._rotateRight(node);
            }
            else {
                // left - right
                node = this._rotateLeftRight(node);
            }
        }
        return node;
    }

    /**
     * 이진 트리가 오른쪽으로 기울어졌을 경우, 
     * 이를 고쳐 좌우 균형을 맞춘다.
     * @param {Node} node
     * @returns {Node} 
     */
    static fixWhenRightLeaning(node) {
        if (node.getBF() <= -2) {
            if (node.rightChild.getBF() <= 0) {
                // right - right
                node = this._rotateLeft(node);
            } else {
                // right - left 
                node = this._rotateRightLeft(node);
            }
        }
        return node;
    }

    /**
     * left - left일 경우 균형을 맞춘다.
     * @param {Node} node 
     * @returns {Node} 균형 재조정 후의 새 루트 노드
     */
    static _rotateRight(node) {
        let newRoot = node.leftChild;
        node.leftChild = newRoot.rightChild;
        newRoot.rightChild = node;

        node.calculateNodeHeight();
        return newRoot;
    }

    /**
     * left - right일 경우 균형을 맞춘다.
     * @param {Node} node
     * @returns {Node} 균형 재조정 후의 새 루트 노드
     */
    static _rotateLeftRight(node) {
        let newRoot = node.leftChild.rightChild;
        let newLeft = node.leftChild;
        newLeft.rightChild = newRoot.leftChild;
        node.leftChild = newRoot.rightChild;
        newRoot.leftChild = newLeft;
        newRoot.rightChild = node;

        node.calculateNodeHeight();
        newLeft.calculateNodeHeight();
        return newRoot;
    }

    /**
     * right - right일 경우 균형을 맞춘다.
     * @param {Node} node 
     * @returns {Node} 균형 재조정 후의 새 루트 노드
     */
    static _rotateLeft(node) {
        let newRoot = node.rightChild;
        node.rightChild = newRoot.leftChild;
        newRoot.leftChild = node;

        node.calculateNodeHeight();
        return newRoot;
    }

    /**
     * right - left일 경우 균형을 맞춘다.
     * @param {*} node 
     * @returns {Node} 균형 재조정 후의 새 루트 노드
     */
    static _rotateRightLeft(node) {
        let newRoot = node.rightChild.leftChild;
        let newRight = node.rightChild;
        node.rightChild = newRoot.leftChild;
        newRight.leftChild = newRoot.rightChild;
        newRoot.leftChild = node;
        newRoot.rightChild = newRight;

        node.calculateNodeHeight();
        newRight.calculateNodeHeight();
        return newRoot;
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

        this._insertAllInnerData();
    }

    get length() {return this._nodeNum}
    
    _constructHashTable() {
        let hashTable = {};

        this.records.forEach(obj => {
            let address = addTool.getFullAddress(obj);
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
            node.calculateNodeHeight();
            node = SelfBalance.fixWhenLeftLeaning(node);
        } else if (value >= node.value) {
            node.rightChild = this._insert(node.rightChild, record);
            node.calculateNodeHeight();
            node = SelfBalance.fixWhenRightLeaning(node);
        }
        node.calculateNodeHeight();
        return node;
    }

    _insertAllInnerData() {
        this.records.forEach(obj => {
            this.insert(obj);
        });
    }
    
    /**
     * 전체 주소를 기입하면 그에 해당하는 데이터를 반환. 
     * 해당 주소값이 존재하지 않으면 null을 반환.
     * @param {string} targetAddress - 1, 2, 3단계가 합쳐진 전체 주소. 
     */
    search(targetAddress) {
        targetAddress = addTool.changeAddress(targetAddress);
        let targetNode = this._search(this._root, targetAddress);
        return targetNode ? targetNode.getData() : null;
    }

    /**
     * 
     * @param {Node} node 
     * @param {string} targetAddress
     * @returns {Node}
     */
    _search(node, targetAddress) {
        if (!node) return null;

        let targetValue = this.addressCodeTable[targetAddress];
        if (node.value == targetValue) return node;
        if (node.value > targetValue) {
            node = this._search(node.leftChild, targetAddress);
        } else {
            node = this._search(node.rightChild, targetAddress);
        }
        return node;
    }
}
