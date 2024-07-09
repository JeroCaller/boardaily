import fs from 'fs';
import { parse } from 'csv-parse/sync'

let dataText = fs.readFileSync('../전국지역위치정보.csv', 'utf-8');
export const records = parse(dataText, {columns: true});
