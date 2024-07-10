import { records } from "../read-data.js";
import fs from 'fs';

fs.writeFileSync('./result-folder/csv-data.json', JSON.stringify(records, null, 2));
console.log(records);
