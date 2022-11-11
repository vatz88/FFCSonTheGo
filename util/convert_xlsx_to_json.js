var fs = require('fs');
var XLSX = require('xlsx');

var wb = XLSX.readFile(__dirname + '/report_vellore.xlsx');
var ws = wb.Sheets[wb.SheetNames[0]];

fs.writeFile(
    __dirname + '/output_vellore.json',
    JSON.stringify(XLSX.utils.sheet_to_json(ws)),
    () => console.log('Updated output_vellore.json'),
);

var wb_chennai = XLSX.readFile(__dirname + '/report_chennai.xlsx');
var ws_chennai = wb_chennai.Sheets[wb_chennai.SheetNames[0]];

fs.writeFile(
    __dirname + '/output_chennai.json',
    JSON.stringify(XLSX.utils.sheet_to_json(ws_chennai)),
    () => console.log('Updated output_chennai.json'),
);
