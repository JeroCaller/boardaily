/**
 * 특정 지역 주소를 입력받으면 해당 지역에 대한 날씨 정보를 얻어오는 기능.
 */

import * as qStr from '../query-str.js';
import { BinaryTreeForWeather } from '../binary-tree.js';
import { records } from '../read-data.js';
import dotenv from 'dotenv';
import fs from 'fs';

export class RequestWeatherAPI {
    constructor(regionAddress, envPath, resFilePath) {
        this._regionAddress = regionAddress;
        this._envPath = envPath;
        this._resFilePath = resFilePath;

        this._binaryTree = new BinaryTreeForWeather(records);
    }

    get regionAddress() {return this._regionAddress}
    set regionAddress(value) {this._regionAddress = value}

    get resFilePath() {return this._resFilePath}
    set resFilePath(value) {this._resFilePath = value}

    _isSetResFilePath() {
        if (!this._resFilePath) {
            throw new Error('응답 데이터를 저장할 파일 경로를 먼저 지정하세요. resFilePath에 지정하면 됩니다.');
        }
    }

    _constructRequestUrl() {
        const apiKey = dotenv.config({path: this._envPath}).parsed.WEATHER_API_KEY;
        let apiUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';

        const searchResult = this._binaryTree.search(this._regionAddress);
        if (!searchResult) {
            throw new Error('주소 검색 실패. 올바른 주소를 입력하세요.');
        }

        let today = new Date();
        let queryStr = qStr.toQueryString({
            serviceKey: apiKey,
            numOfRows: 60,
            pageNo: 1,
            dataType: "JSON",
            base_date: qStr.getDateYYYYMMDD(today),
            base_time: qStr.setBaseTime(today),
            nx: searchResult.nx,
            ny: searchResult.ny
        });
        return apiUrl + queryStr;
    }

    /**
     * 날씨 api에 get 요청을 보낸 후, 받은 응답을 특정 파일 경로에 저장하면서 
     * 동시에 이를 반환.
     */
    async requestAndSaveApiData() {
        this._isSetResFilePath();
        
        return await fetch(this._constructRequestUrl(), {method: "GET"})
            .then(res => res.json())
            .then(result => {
                fs.writeFileSync(
                    this._resFilePath,
                    JSON.stringify(result, null, 2),
                );
                return result;
            });
    }

    /**
     * 날씨 api에 get 요청을 보내고 받은 응답을 반환한다. 
     * 해당 메서드는 응답을 자동으로 어딘가에 저장하지 않고, 오로지 
     * 그 응답을 반환만 한다. 
     * 만약 응답을 파일로도 저장하고 싶다면 requestAndSaveApiData() 메서드 이용.
     */
    async getResponse() {
        return await fetch(this._constructRequestUrl(), {method: "GET"})
            .then(res => res.json());
    }
}
