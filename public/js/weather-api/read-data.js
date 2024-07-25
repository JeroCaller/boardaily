// import fs from 'fs';
import {parse} from '/node_modules/csv-parse/lib/sync.js';

/* 
let dataText = fs.readFileSync('./전국지역위치정보.csv', 'utf-8');
export const records = parse(dataText, {columns: true});
console.log(records); */

export const records = (async () => {
    let dataText = await fetch('/content-data/전국지역위치정보.csv').then(res => res.text());
    return parse(dataText, {columns: true});
})();