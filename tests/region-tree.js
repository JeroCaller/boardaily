import * as chnAddr from './change-address.js';

export class RegionTree {
    /**
     * 
     * @param {object[]} records - csv-parse/sync 라이브러리를 이용하여 파싱한 csv 객체 배열.
     */
    constructor(records) {
        this._records = records;

        this._firstSecondAdj = {};
        this._secondThirdAdj = {};
        this._initAdjLists();
        this._sortAdjLists();
    }

    _initAdjLists() {
        for (let dataObj of this._records) {
            if (!(dataObj['1단계'] in this._firstSecondAdj)) {
                this._firstSecondAdj[dataObj['1단계']] = [];
            }
            if (!dataObj['2단계']) continue;
            if (!this._firstSecondAdj[dataObj['1단계']].includes(dataObj['2단계'])) {
                this._firstSecondAdj[dataObj['1단계']].push(dataObj['2단계']);
            }

            let fullAddress = [dataObj['1단계'], dataObj['2단계']].join(' ');
            if (!(fullAddress in this._secondThirdAdj)) {
                this._secondThirdAdj[fullAddress] = [];
            }
            if (!dataObj['3단계']) continue;
            if (!this._secondThirdAdj[fullAddress].includes(dataObj['3단계'])) {
                this._secondThirdAdj[fullAddress].push(dataObj['3단계']);
            }
        }
    }

    /**
     * 인접 리스트를 구성하는 객체 리터럴 내 각 프로퍼티의 값에 해당하는 
     * 배열들을 모두 오름차순으로 정렬한다. 
     */
    _sortAdjLists() {
        for (let adj of [this._firstSecondAdj, this._secondThirdAdj]) {
            for (let key in adj) {
                adj[key].sort();
            }
        }
    }

    searchSecondAddress(firstAddress) {
        firstAddress = chnAddr.changeAddress(firstAddress);
        return this._firstSecondAdj[firstAddress];
    }

    searchThirdAddress(firstSecondAddress) {
        firstSecondAddress = chnAddr.changeAddress(firstSecondAddress, true);
        return this._secondThirdAdj[firstSecondAddress];
    }
}
