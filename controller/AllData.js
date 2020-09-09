let ShookitService = require('../services/ShookitService')
let RefreshService = require('../services/RefreshService')
let CarmellaService = require('../services/CarmellaService')
let CombineService = require('../services/CombineObjects')
let ExcelService = require('../services/ExcelService')


//return the response to the user and call callProgram to get all the data
//from the services
exports.getAllData = async (req,res) => {

    this.callProgram()

    res.json("Socket")
}


//async function to fetch all data and create an excel file from it
exports.callProgram = async () => {

    let shookitInstance = new ShookitService()
    let refreshInstance = new RefreshService()
    let carmellaInstance = new CarmellaService()

    let combineInstace = new CombineService()
    let excelService = new ExcelService()

    //scrape data of fruits/vegetables/green
    let [shookitVege, refreshVege, carmellaVege] = await Promise.all([shookitInstance.getVegetables(), refreshInstance.getVegetables(), await carmellaInstance.getVegetables()])
    let [shookitFruits, refreshFruits, carmellaFruits] = await Promise.all([shookitInstance.getFruits(), refreshInstance.getFruits(), carmellaInstance.getFruits()])
    let [shookitGreen, refreshGreen] = await Promise.all([shookitInstance.getGreens(), refreshInstance.getGreens()])

    //combine the matching items of each category into an array of arrays
    let combineVegeObject = await combineInstace.combineFruitsOrVegetables(shookitVege, refreshVege, carmellaVege)
    let combineFruitObject = await combineInstace.combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits)
    let combineGreenObject = await combineInstace.combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaVege)

    //create an excel file
    let file = await excelService.createExcelFileWithCombine(combineFruitObject, combineVegeObject, combineGreenObject)
}


///route to download the file
exports.download = (req,res) => {

    console.log('/client')
    res.download('Excel.xlsx')
}


exports.testFunction = async (req,res) => {

    let shookitInstance = new ShookitService()
    let refreshInstance = new RefreshService()
    let carmellaInstance = new CarmellaService()

    // let obj = await shookitInstance.getFruits()
    // let obj = await refreshInstance.getFruits()
    // let obj = await carmellaInstance.getFruits()

    // let obj = await shookitInstance.getVegetables()
    // let obj = await refreshInstance.getVegetables()
    let obj = await carmellaInstance.getVegetables()

    res.json(obj) 

}