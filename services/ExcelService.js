const excel = require('excel4node');
const workbook = new excel.Workbook();

//create an excel file from the objects that is getting
class ExcelService {

    //setting up excel workbook and filling 
    createExcelFileWithCombine(fruitsObjects, vegeObjects, greensObjects){

    let style = workbook.createStyle({
        font: {
          color: 'black',
          size: 12,
          width:15
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        numberFormat: '##0.00; ##0.00; -'
      });

      let styleHeader = workbook.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            // bgColor: 'b45959',
            fgColor: '#c7c7c7'
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }, border: {
            right: {
                style: 'thin',
                color: '#000000'
            },
            left: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
          }
      });

      let styleDiff = workbook.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#ffa500'
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
        },  border: {
            right: {
                style: 'thin',
                color: '#000000'
            },
            left: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
          }
      });

    
      let options = {
        'sheetView': {
            'rightToLeft': true
        }
      };

    let worksheet = workbook.addWorksheet('Sheet 1', options);
    
    worksheet.row(1).setHeight(30);
    worksheet.column(1).setWidth(22);
    worksheet.column(2).setWidth(12);
    worksheet.column(3).setWidth(12);
    worksheet.column(4).setWidth(22);
    worksheet.column(5).setWidth(12);
    worksheet.column(6).setWidth(12);
    worksheet.column(7).setWidth(22);

    worksheet.column(10).setWidth(22);
    worksheet.column(11).setWidth(22);


    worksheet.cell(1, 1).string('מוצר ריפרש').style(styleHeader)
    worksheet.cell(1, 2).string('מארז/יחידה/קילו').style(styleHeader)
    worksheet.cell(1, 3).string('מחיר ריפרש').style(styleHeader)

    worksheet.cell(1, 4).string('מוצר שוקיט').style(styleHeader)
    worksheet.cell(1, 5).string('מארז/יחידה/קילו').style(styleHeader)
    worksheet.cell(1, 6).string('מחיר שוקיט').style(styleHeader)

    worksheet.cell(1, 7).string('מוצר כרמלה').style(styleHeader)
    worksheet.cell(1, 8).string('מארז/יחידה/קילו').style(styleHeader)
    worksheet.cell(1, 9).string('מחיר כרמלה').style(styleHeader)

    worksheet.cell(1, 10).string('הפרש ריפרש שוקיט').style(styleDiff)
    worksheet.cell(1, 11).string('הפרש ריפרש כרמלה').style(styleDiff)

    worksheet.cell(1, 12).string('אחוז משוקיט').style(styleDiff)
    worksheet.cell(1, 13).string('אחוז מכרמלה').style(styleDiff)


    let length = 0

    //build excel files by each category fruits/vegetables/greens
    length = this.setExcelRowColByCategory(worksheet, fruitsObjects, length) //(worksheet, categoryObjects, beginingLength)
    length = this.setExcelRowColByCategory(worksheet, vegeObjects, length+1)
    length = this.setExcelRowColByCategory(worksheet, greensObjects, length+1)


    //calaulate difference between refresh price to shookit/carmella
    let totalLength = fruitsObjects.length + vegeObjects.length + greensObjects.length + 2

    for (let i = 2; i < totalLength; i++) {
        let calcShookit = `C${i} - F${i}`
        let calcCarmella = `C${i} - I${i}`

        let calcPercShookit = `C${i} / F${i} * 100`
        let calcPercCarmella = `C${i} / I${i} * 100`

        worksheet.cell(i,10).formula(calcShookit).style(style);
        worksheet.cell(i,11).formula(calcCarmella).style(style);

        worksheet.cell(i,12).formula(calcPercShookit).style(style);
        worksheet.cell(i,13).formula(calcPercCarmella).style(style);
    }

    console.log('done')
}


setExcelRowColByCategory(worksheet, categoryObjects, startIndex){

    
    let style = workbook.createStyle({
        font: {
            color: 'black',
            size: 12,
            width: 15
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center'
        },
        numberFormat: '##0.00; ##0.00; -'
    });


    let totalLength = startIndex //total length of rows

    //display fruits in rows
    for (let i = 0; i < categoryObjects.length; i++) {
        const element = categoryObjects[i];
        for (let j = 0; j < element.length; j++) {

            //check if the 3 companys have the same item or just 2 of them
            if(element.length === 1){
                worksheet.cell(startIndex + i + 2, 1).string(element[j].name).style(style)
                worksheet.cell(startIndex + i + 2, 2).string(element[j].type).style(style)
                worksheet.cell(startIndex + i + 2, 3).string(element[j].price).style(style)

                worksheet.cell(startIndex + i + 2, 4).string('-').style(style)
                worksheet.cell(startIndex + i + 2, 5).string('-').style(style)
                worksheet.cell(startIndex + i + 2, 6).string('-').style(style)

                worksheet.cell(startIndex + i + 2, 7).string('-').style(style)
                worksheet.cell(startIndex + i + 2, 8).string('-').style(style)
                worksheet.cell(startIndex + i + 2, 9).string('-').style(style)
            } else if (element.length === 2) {
                // let num = parseInt
                if (j === 0) {
                    worksheet.cell(startIndex + i + 2, 1).string(element[j].name).style(style)
                    worksheet.cell(startIndex + i + 2, 2).string(element[j].type).style(style)
                    worksheet.cell(startIndex + i + 2, 3).string(element[j].price).style(style)
                } else if (j === 1 && element[j].company === 'shookit') {
                    worksheet.cell(startIndex + i + 2, 4).string(element[j].name).style(style)
                    worksheet.cell(startIndex + i + 2, 5).string(element[j].type).style(style)
                    worksheet.cell(startIndex + i + 2, 6).string(element[j].price).style(style)

                    worksheet.cell(startIndex + i + 2, 7).string('-').style(style)
                    worksheet.cell(startIndex + i + 2, 8).string('-').style(style)
                    worksheet.cell(startIndex + i + 2, 9).string('-').style(style)

                } else if (j === 1 && element[j].company === 'carmella') {

                    worksheet.cell(startIndex + i + 2, 4).string('-').style(style)
                    worksheet.cell(startIndex + i + 2, 5).string('-').style(style)
                    worksheet.cell(startIndex + i + 2, 6).string('-').style(style)

                    worksheet.cell(startIndex + i + 2, 7).string(element[j].name).style(style)
                    worksheet.cell(startIndex + i + 2, 8).string(element[j].type).style(style)
                    worksheet.cell(startIndex + i + 2, 9).string(element[j].price).style(style)
                }
            } else if (element.length === 3) {
                if (j === 0) {
                    worksheet.cell(startIndex + i + 2, 1).string(element[j].name).style(style)
                    worksheet.cell(startIndex + i + 2, 2).string(element[j].type).style(style)
                    worksheet.cell(startIndex + i + 2, 3).string(element[j].price).style(style)
                }
                else if (j === 1 && element[j].company === 'shookit') {
                    worksheet.cell(startIndex + i + 2, 4).string(element[j].name).style(style)
                    worksheet.cell(startIndex + i + 2, 5).string(element[j].type).style(style)
                    worksheet.cell(startIndex + i + 2, 6).string(element[j].price).style(style)
                } else if (j === 2 && element[j].company === 'carmella') {
                    worksheet.cell(startIndex + i + 2, 7).string(element[j].name).style(style)
                    worksheet.cell(startIndex + i + 2, 8).string(element[j].type).style(style)
                    worksheet.cell(startIndex + i + 2, 9).string(element[j].price).style(style)
                }
            }
        }

        totalLength++
    }

    workbook.write('Excel.xlsx');
    return totalLength

}

}

module.exports = ExcelService;