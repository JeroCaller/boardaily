import { RequestWeatherAPI } from "./req-res.js";
import { WeatherData } from "../data-process.js";
import fs from 'fs';
import assert from 'node:assert/strict';

class TestTools {
    static responseResultDir = './res-folder/';
    static weatherDataDir = './weather-data/';
    static reqApi = new RequestWeatherAPI(null, '../../.env', null);

    /**
     * 날씨 api 요청 후 받은 응답을 파일로 저장하면서 그 값을 반환하는 함수.
     * @param {string} regionAddress 
     * @param {string} saveFileName 
     * @returns 
     */
    static async getAndSaveWeatherData(regionAddress, saveFileName) {
        TestTools.reqApi.regionAddress = regionAddress;
        TestTools.reqApi.resFilePath = TestTools.responseResultDir + saveFileName;
        let rawData = await TestTools.reqApi.requestAndSaveApiData();
        let wdataObj = new WeatherData(rawData);
        let wdataResult = wdataObj.getAllData();
        fs.writeFileSync(
            TestTools.weatherDataDir + saveFileName, 
            JSON.stringify(wdataResult, null, 2)
        );
        return wdataResult;
    }

    /**
     * 날씨 api 요청 후 받은 응답을 반환하는 함수. 응답을 따로 파일에 저장하진 않음.
     * @param {string} regionAddress 
     * @returns 
     */
    static async getAndNotSaveWeatherData(regionAddress) {
        TestTools.reqApi.regionAddress = regionAddress;
        let rawData = await TestTools.reqApi.getResponse();
        let wdataObj = new WeatherData(rawData);
        return wdataObj.getAllData();
    }
}

async function printTestSimpleAddress() {
    // 실행을 원하는 코드만 주석 해제하여 실행.

    //await TestTools.getAndSaveWeatherData('서울', 'seoul.json');
    //await TestTools.getAndSaveWeatherData('부산', 'busan.json');
    await TestTools.getAndSaveWeatherData('경상남도', 'gyeongsangnamdo.json');
}

async function assertTests(regionAddress, expected) {
    let actualResult = await TestTools.getAndNotSaveWeatherData(regionAddress);
    for (let cate of ["T1H", "RN1", "SKY", "REH", "PTY"]) {
        assert(cate in actualResult);
    }
    let sampleData = actualResult['T1H'][0];
    assert.deepStrictEqual({nx: sampleData.nx, ny: sampleData.ny}, expected);
}

//printTestSimpleAddress();
assertTests('서울', {nx: 60, ny: 127});
