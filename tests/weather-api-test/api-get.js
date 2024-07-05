import * as apiTools from '../../api-tools/query-str.js';
import dotenv from 'dotenv';
import fs from 'fs';

function constructRequestUrl() {
    const apiKey = dotenv.config({path: '../../.env'}).parsed.WEATHER_API_KEY;
    let apiUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
    let today = new Date();
    let queryStr = apiTools.toQueryString({
        serviceKey: apiKey,
        numOfRows: 60,
        pageNo: 1,
        dataType: "JSON",
        base_date: apiTools.getDateYYYYMMDD(today),
        base_time: apiTools.setBaseTime(today),
        nx: 60,
        ny: 127
    });
    apiUrl += queryStr;
    return apiUrl;
}

function getResponseTest() {
    const resFileName = 'response.json';

    fetch(constructRequestUrl(), {
        method: "GET"
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            console.log(typeof result);
            fs.writeFile(
                `./${resFileName}`, 
                JSON.stringify(result, null, 2), 
                () => console.log(`${resFileName} 파일 저장 완료`)
            );
        });
}

getResponseTest();
