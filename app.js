const express = require('express');
const excel = require('excel4node');
const app = express()
    , server = require('http').createServer(app);
    // , io = require('socket.io').listen(server);

const workbook = new excel.Workbook();
const puppeteer = require('puppeteer');
const cors = require('cors')

const fs = require('fs');
// const io = require('socket.io')('3000')

app.use(express.static('public'))
app.use(cors())


const allData = require('./controller/AllData')
app.get('/promiseAll', allData.getAllData);
app.get('/check', allData.testFunction);


app.get('/download', (req,res) => {

    console.log('/client')
    res.download('Excel.xlsx')
})

//WORK !!
// app.get('/promiseAll', async (req,res) => {

//     callProgram()
  
//     res.json('Good')
// })


//async function to fetch all data and create an excel file from it
async function callProgram(){
    
        //get all data of fruits, vegetables and greens
        let [shookitVege, refreshVege, carmellaVege] = await Promise.all([vegtablesShookit(), vegtablesRefresh(), await vegetablesCarmella()])
        let [shookitFruits, refreshFruits, carmellaFruits] = await Promise.all([fruitsShookit(), fruitsRefresh(), fruitsCarmella()])
        let [shookitGreen, refreshGreen] = await Promise.all([greensShookit(), greensRefresh()])
    

        //match all the fruits/vegetables/greens that equal and put them into the same object
         let combineVegeObject = await combineFruitsOrVegetables(shookitVege, refreshVege, carmellaVege)
         let combineFruitObject = await combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits)
         let combineGreenObject = await combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaVege)

         await printPromise(combineVegeObject,'comvege')
         await printPromise(combineFruitObject,'comvfruit')
         await printPromise(combineGreenObject,'comgreen')

         //create an excel file from all the combined objects
         let file = await createExcelFileWithCombine(combineFruitObject, combineVegeObject, combineGreenObject)

         file = null
         shookitVege = null
         refreshVege = null
         carmellaVege = null
         shookitFruits = null
         refreshFruits = null 
         carmellaFruits = null
         shookitGreen = null
         refreshGreen = null
        //web: node --optimize_for_size --max_old_space_size=500 server.js
        // console.log(process.memoryUsage())
}


function printPromise(shookitFruits,name){
    console.log(shookitFruits.length, name)
}






//combine refresh and shookit objects to one row
async function combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits){

    let combineObj = []
    let flag = false
    let set = new Set()

    //run over one array of fruits
    for (let index = 0; index < refreshFruits.length; index++){
        let refreshObj = refreshFruits[index];
        // let nameRefresh = refreshObj.name.split(' ')

        //compare refresh fruit with shookit fruit
        let arr = compareTwoLists(refreshObj, shookitFruits)

        //compare refresh fruit with carmella fruit
        let thirdObj = await compareThirdLists(refreshObj, carmellaFruits)

        
        let newArray
        //check if refresh and shookit or carmella or 3 of them
        // have the same product
        if(arr !== null  && Object.keys(thirdObj).length > 0) { 
             newArray = [...arr, thirdObj]
            combineObj.push(newArray)
        } else if(Object.keys(thirdObj).length === 0 && arr !== null){
            newArray = [...arr]
            combineObj.push(newArray)
        } else if(arr === null && Object.keys(thirdObj).length > 0){
            newArray = [refreshObj, thirdObj]
            combineObj.push(newArray)
        } else {
            newArray = [refreshObj]
            combineObj.push(newArray)
        }
        
    }

    console.log('combineFruitsOrVegetables done')
    return combineObj
}




function compareTwoLists(productRefresh, shookitList) {
    let combineArr = []

    //parse product refresh and shookitList
    let nameRefresh = productRefresh.name.split(' ')
    // console.log(shookitList[0])

    for (let i = 0; i < shookitList.length; i++) {
        let shookitObj = shookitList[i] 
        let nameShookit = shookitObj.name.split(' ')
        // console.log(nameRefresh)

        if (nameShookit[0] === nameRefresh[0] && nameRefresh.length > 1 && nameShookit.length > 1) {
            if (nameShookit[1] === nameRefresh[1] && nameRefresh.length > 2 && nameShookit.length > 2) {
                if(nameShookit[2] === nameRefresh[2]){
                    combineArr = [productRefresh, shookitObj]
                    break
                } 
            } else if (nameShookit[1] === nameRefresh[1] && nameRefresh.length >= 2 && nameShookit.length >= 2) {
                    combineArr = [productRefresh, shookitObj]
                    break
                } 
        } else if(nameShookit[0] === nameRefresh[0] && nameRefresh.length === 1) {
                combineArr = [productRefresh, shookitObj]
                break;
        }  

    }

    if(combineArr.length > 0){
        return combineArr
    } else {
        return null
    }
    // console.log(combineArr,'arr')
}




//TEST Functions
async function cancelOneModal(){

    let shookit = `https://www.shookit.com/product-category/%d7%a4%d7%99%d7%a8%d7%95%d7%aa/`

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(shookit)

    //pick one + button
    let allAdd = await page.$eval('.add', el => el.click())

    let wait = await page.waitFor(3000)
    let close = await page.$eval('#first-time-modal', el => {
        let modal = el.querySelector('.modal-close')
        modal.click()
        console.log(modal)
    })
    
}


//select all units , one by one Working
async function selectAll(){
    
    let shookit = `https://www.shookit.com/product-category/%d7%a4%d7%99%d7%a8%d7%95%d7%aa/`

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(shookit)

    // let elements = await page.$$eval('.add', el => el.textContent)
    let element = await page.$('.add')
    element.click()

    await page.waitFor(3000)

    let modal = await page.$eval('#first-time-modal', async el => {
        let btn = el.querySelector('.modal-close')
        btn.click()
    })

    await page.waitFor(6000)

    await page.evaluate(async () => {

        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
         }

        let elements = document.querySelectorAll('.add');
        let arrFruits = Array.from(elements).splice(0,27)

        for (let index = 2 ; index < arrFruits.length; index++) {
            await delay(2000);
            await arrFruits[index].click()
            console.log(index)
        }
    });
 
}


server.listen(process.env.PORT || 5000, () => console.log("Connected"))
