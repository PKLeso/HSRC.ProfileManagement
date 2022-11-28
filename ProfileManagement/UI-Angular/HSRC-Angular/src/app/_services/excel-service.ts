// import { Injectable } from '@angular/core';
// import { Workbook } from 'exceljs';
// import * as fs from 'file-saver';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

// @Injectable({
//     providedIn: 'root'
// })
// export class ExcelService {

//     constructor() { }

//     public exportAsExcelFile(
//         reportHeading: string,
//         reportSubheading: string,
//         headersArray: any[],
//         json: any[],
//         footerData: any,
//         excelFileName: string,
//         sheetName: string
//     ){
//         const header = headersArray;
//         const data = json;

//         const workbook = new Workbook();
//         workbook.creator = 'Admin Dashbord';
//         workbook.lastModifiedBy = 'Admin';
//         workbook.created = new Date();
//         workbook.modified = new Date();
//         const worksheet = workbook.addWorksheet(sheetName);

//         worksheet.addRow([]);
//         worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
//         worksheet.getCell('A1').value = reportHeading;
//         worksheet.getCell('A1').alignment = { horizontal: 'center' };
//         worksheet.getCell('A1').font = { size: 15, bold: true };

//         if(reportHeading !== '') {
//             worksheet.addRow([]);
//             worksheet.mergeCells('A2' + this.numToAlpha(header.length - 1) + '2');
//             worksheet.getCell('A2').value = reportHeading;
//             worksheet.getCell('A2').alignment = { horizontal: 'center' };
//             worksheet.getCell('A2').font = { size: 12, bold: false };
//         }

//         worksheet.addRow([]);

//         const headerRow = worksheet.addRow(header);

//         headerRow.eachCell((cell, index) => {
//             cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'FFFFFF00' },
//                 bgColor: { argb: 'FF0000FF' }
//             };
//             cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin'} };
//             cell.font = { size: 12, bold: true };

//             worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
//         });

//         let columnsArray: any[];
//         for(const key in json) {
//             if(json.hasOwnProperty(key)) {
//                 columnsArray = Object.keys(json[key]);
//             }
//         }

//         data.forEach((element: any) => {
//             const eachRow = [];
//             columnsArray.forEach((column) => {
//                 eachRow.push(element[column]);
//             });

//             if(element.isDeleted === 'Y') {
//                 const deletedRow = worksheet.addRow(eachRow);
//                 deletedRow.eachCell((cell) => {
//                     cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
//                 });
//             }
//             else {
//                 worksheet.addRow(eachRow);
//             }
//         });

//         if(footerData != null) {
            
//         }

//         workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
//             const blob = new Blob([data], { type: EXCEL_TYPE });
//             fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
//         });

//     }

//     private numToAlpha(num: number) {
//         let alpha = '';

//         for (num >= 0; num = parseInt((num / 26).toString(), 10 ) - 1;) {
//             alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
//         }

//         return alpha;
//     }
// }