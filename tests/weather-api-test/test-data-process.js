import fs from 'fs';
import { WeatherData } from '../data-process.js';

function testWeatherData() {
    let apiData = JSON.parse(fs.readFileSync('./response.json', 'utf-8'));
    let wData = new WeatherData(apiData);

    //console.log(wData.getTemperatures());
    //console.log(wData.getPrecipitations());
    //console.log(wData.getHumidities());
    //console.log(wData.getPtys());
    //console.log(wData.getSkies());
    console.log(wData.getAllData());
}

testWeatherData();
