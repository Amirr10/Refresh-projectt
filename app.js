const express = require('express');
const excel = require('excel4node');
const app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

const workbook = new excel.Workbook();
const puppeteer = require('puppeteer');
const cors = require('cors')

const fs = require('fs');
// const io = require('socket.io')('3000')

app.use(express.static('public'))
app.use(cors())

io.on('connection', socket => {
    socket.emit('welcome-msg', 'Hello Socket')
})


app.get('/socket', (req,res) => {

    callSocket()

    res.json('nice')
})

function callSocket(){
    io.on('connection', socket => {
        socket.emit('new-msg', 'message from callSocket')
    })
}


app.get('/client', (req,res) => {

    console.log('/client')

    res.download('Excel.xlsx')
})


let fruitListRefresh = [
"אבטיח שלם",
"אגס",
"אוכמניות",
"אננס",
"אפרסק",
"בננה",
"דובדבן",
"חצי אבטיח",
"ליים",
"מארז תמר מג'הול - 400 גרם",
"מלון כתום",
"מלון ספרדי מתוק",
"מנגו",
"משמש בלדי",
"נקטרינה",
"ענבים אדומים",
"ענבים ירוקים",
"ענבים שחורים",
"קיווי ירוק",
"קיווי צהוב",
"קלמנטינה",
"רבע אבטיח",
"שזיף אדום",
"שזיף צהוב",
"שסק",
"תות",
"תמר מג'הול אורגני (מארז 1 ק\"ג)",
"תפוז למיץ",
"תפוח חרמון",
"תפוח סמית",
"תפוח פינק ליידי",
]

let vegeListRefresh = [
    'אבוקדו',
    'בטטה',
    'בצל',
    'בצל סגול',
    'גזר',
    'דואט פטריות',
    'חציל',
    'כרוב לבן',
    'כרוב סגול',
    'לימון',
    'מיקס פטריות',
    'מלפפון מובחר',
    'מלפפון מיני',
    'סלק',
    'עגבניה',
    'עגבניות מיובשות',
    'פטריות מגה פורטבלו',
    'פטריות פורטובלו',
    'פלפל אדום',
    'פלפל ירוק',
    'פלפל ירוק חריף',
    'פלפל צ\'ילי',
    'פלפל צהוב',
    'פלפלונים מתוקים טינקרבל',
    'צנונית',
    'קולורבי',
    'קישוא',
    'ראש שום',
    'שום ארוז',
    'שום קלוף',
    'שומר',
    'שמפניון',
    'שעועית ירוקה',
    'שרי אדום',
    'שרי טריפל',
    'שרי צהוב',
    'שרי שוקו',
    'תירס',
    'תפוח אדמה אדום',
    'תפוח אדמה לבן'
]





app.get('/check', async (req,res) => {

    let obj = await fruitsRefresh()

    res.json(obj)
    
})



app.get('/promise', async (req,res) => {

    try {
        let [shookitFruits, refreshFruits, carmellaFruits, 
            shookitVege, refreshVege, carmellaVege,
            shookitGreen, refreshGreen] 
           = await Promise.all([fruitsShookit(),  fruitsRefresh(), fruitsCarmella(),
                            vegtablesRefresh(), vegtablesRefresh(), vegetablesCarmella(),
                            greensShookit(), greensRefresh()]);
   
     let [allFruits, allVeges, allGreens] = await Promise.all(
               [combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits),
                combineFruitsOrVegetables(shookitVege, refreshVege, carmellaVege),
                combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaVege)]);
   
   
     let file = await createExcelFileWithCombine(allFruits, allVeges, allGreens)
   

    //   res.download('Excel.xlsx')
    //  res.send()
    await io.on('connection', socket => {
        socket.emit('new-msg', 'message from callSocket')
    })

    } catch (error) {
        console.log(error)
    }
    
})


app.get('/promiseAll', async (req,res) => {

    // let fruits = await callProgram()
    let fruits = callProgram()
  
    res.json('Good')
    // res.download('Excel.xlsx')
})



async function callProgram(){

    let [shookitFruits, refreshFruits, carmellaFruits,
         shookitVege, refreshVege, carmellaVege,
         shookitGreen, refreshGreen]
        = await Promise.all([fruitsShookit(), await fruitsRefresh(), fruitsCarmella(),
                            vegtablesShookit(), await vegtablesRefresh(), vegetablesCarmella(),
                            greensShookit(), await greensRefresh()]);  
    
    // let [allFruits, allVeges, allGreens] = await Promise.all(
    //     [combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits),
    //      combineFruitsOrVegetables(shookitVege, refreshVege, carmellaVege),
    //      combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaVege)]);

         let combineVegeObject = await combineFruitsOrVegetables(shookitVege, refreshVege, carmellaVege)
         let combineFruitObject = await combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits)
         let combineGreenObject = await combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaVege)

         await printPromise(combineVegeObject,'comvege')
         await printPromise(combineFruitObject,'comvfruit')
         await printPromise(combineGreenObject,'comgreen')

         let file = await createExcelFileWithCombine(combineFruitObject, combineVegeObject, combineGreenObject)

          await io.on('connection', socket => {
            socket.emit('new-msg', 'message from callProgram')
        })
        // let file = await createExcelFileWithCombine(allFruits, allVeges, allGreens)
}


app.get('/download', (req,res) => {

    console.log('/client')

    res.download('Excel.xlsx')
})



function printPromise(shookitFruits,name){
    console.log(shookitFruits.length, name)
}


async function checkEqualItems(listRefresh){

    let objArr = []
    let combineObj = []
    const carmellaList = await vegetablesCarmella()
    const vegeList = await vegtablesShookit()
    const refreshObjects = await vegtablesRefresh()
    
    let set = new Set()

    listRefresh.forEach((item,j) => {
        let bool = false
        let name = item.split(' ')


        for (let i = 0; i < vegeList.length; i++) {
            let vegeName = vegeList[i].name.split(' ')

            //if length of the name is only one and its equal to one on the list
            if (name[0] === vegeName[0] && vegeName.length > 1 && name.length > 1) {
                if (name[1] === vegeName[1] && vegeName.length > 2 && name.length > 2) {
                    if(name[2] === vegeName[2]){
                        set.add(`${name[0]} ${name[1]} ${name[2]}`)//
                        let obj = [refreshObjects[j], vegeList[i]]//
                        objArr.push(obj)//
                        break;
                    }
                } else if (name[1] === vegeName[1] ){
                    set.add(`${name[0]} ${name[1]}`)
                    let obj = [refreshObjects[j], vegeList[i]]//
                    objArr.push(obj)//
                    break;
                }
            } else if (name[0] === vegeName[0] && name.length === 1) {
                set.add(`${name[0]}`)
                let obj = [refreshObjects[j], vegeList[i]]//
                objArr.push(obj)//
                break;
            }


        //     let thirdObj = compareThirdLists(refreshObjects[i], carmellaList)

        //     if(obj !== null  && Object.keys(thirdObj).length > 0) { 
        //         let newArray = [...obj, thirdObj]
        //        combineObj.push(newArray)
        //    }
        }
    })

    return objArr
}
// checkEqualItems(vegeListRefresh)


async function testProg(){

    let shookitFruits = await fruitsShookit()
    let refreshFruits = await fruitsRefresh()
    let carmellaFruits = await fruitsCarmella()

    let shookitVegtables = await vegtablesShookit()
    let refreshVegtables = await vegtablesRefresh()
    let carmellaVegtables = await vegetablesCarmella()
    
    let shookitGreen = await greensShookit()
    let refreshGreen = await greensRefresh()
    let carmellaGreen = await vegetablesCarmella()
  
    let combineVegeObject = await combineFruitsOrVegetables(shookitVegtables, refreshVegtables, carmellaVegtables)
    let combineFruitObject = await combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits)
    let combineGreenObject = await combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaGreen)


    let file = await createExcelFileWithCombine(combineFruitObject, combineVegeObject, combineGreenObject)
    console.log("Done create excel")

        // await io.on('connection', socket => {
        //     socket.emit('new-msg', 'message from callProgram')
        // })
}


//get fruits from shookit
app.get("/test2", async (req,res) => {

    // let shookitFruits = await fruitsShookit()
    // let refreshFruits = await fruitsRefresh()
    // let carmellaFruits = await fruitsCarmella()

    // let shookitVegtables = await vegtablesShookit()
    // let refreshVegtables = await vegtablesRefresh()
    // let carmellaVegtables = await vegetablesCarmella()
    
    // let shookitGreen = await greensShookit()
    // let refreshGreen = await greensRefresh()
    // let carmellaGreen = await vegetablesCarmella()
  
    // let combineVegeObject = await combineFruitsOrVegetables(shookitVegtables, refreshVegtables, carmellaVegtables)
    // let combineFruitObject = await combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits)
    // let combineGreenObject = await combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaGreen)


    // let file = await createExcelFileWithCombine(combineFruitObject, combineVegeObject, combineGreenObject)

    let func = testProg()

    res.json('json');
    // res.download('Excel.xlsx')
})


async function combo(){

    let shookitFruits = await fruitsShookit()
    let refreshFruits = await fruitsRefresh()
    let carmellaFruits = await fruitsCarmella()

    // let shookitVegtables = await vegtablesShookit()
    // let refreshVegtables = await vegtablesRefresh()
    // let carmellaVegtables = await vegetablesCarmella()

    // let shookitGreen = await greensShookit()
    // let refreshGreen = await greensRefresh()
    // let carmellaGreen = await vegetablesCarmella()

    // let combineVegeObject = await combineFruitsOrVegetables(shookitVegtables, refreshVegtables, carmellaVegtables)
    let combineFruitObject = await combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits)
    
    // let combineGreenObject = await combineFruitsOrVegetables(shookitGreen, refreshGreen, carmellaGreen)
    let combineGreenObject = []
    let combineVegeObject = []



    let file = await createExcelFileWithCombine(combineFruitObject, combineVegeObject, combineGreenObject)
    // await printPromise(carmellaVegtables,'carm')

    io.on('connection', socket => {
        socket.emit('new-msg', 'message from callSocket')
    })

}
// combo()

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
        }
        
    }

    console.log('combineFruitsOrVegetables done')
    // console.log()

    return combineObj
}


async function fruitsShookit(){

    let shookit = `https://www.shookit.com/product-category/%d7%a4%d7%99%d7%a8%d7%95%d7%aa/`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(shookit)


    // get name of product
    const productTitle = await page.$$eval('.product-title' , innerText => innerText.splice(0,27).map((inr,i) => 
        inr.innerText
    ))

    //get product price
    const productPrice = await page.$$eval('.product-pricing-container' , innerText => innerText.splice(0,27).map((inr,i) => 
        inr.innerText
    ))

    let obj = { company: "shookit", fruits: [] }

    //create key value pairs of p.name and p.price

    for (let index = 0; index < productTitle.length; index++) {

        let regex = /([\u0590-\u05fe][(?!"")][\u0590-\u05fe]|[\u0590-\u05fe])+/
        let regex2 = /\d+\.\d/g

        //get unit type
        let regex3 = /ק\"ג|מארז|יחידה/

        let weight = productPrice[index].match(regex)
        let unitOrWeight = productPrice[index].match(regex3)
        let price = productPrice[index].match(regex2)

        if(price === null){
            price = 'empty'
        } else if(price.length === 2){
            price = price[1]
        } else {
            price = price
        }


        let element = `${weight} - ${price}`;

        let name = productTitle[index]
        let parseName = name.split(' ')

        //check for apple types
        if(parseName[0] === "תפוח"){
            name = `${parseName[0]} ${parseName[3]}`
            if(name === 'תפוח סמית׳')
                name = `תפוח סמית`
        }


        let temp = {}
        temp.name = name
        temp.price = price
        temp.type = unitOrWeight[0]
        temp.category = 'Fruit'
        temp.company = 'shookit'


        obj.fruits.push(temp)
    }

    let objects = {
        name: 'Shookit'
    }

    let sortObj = obj.fruits.sort((a,b) => a.name.localeCompare(b.name))
    // sortObj.forEach(el => console.log(el))
    
    console.log(sortObj.length,'fruitsShookit done')

    browser.close()
    return sortObj
}
// fruitsShookit()



async function fruitsRefresh(){

    let refresh = `https://www.refresh-market.co.il/category/%D7%A4%D7%99%D7%A8%D7%95%D7%AA`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh)


    // get name of product
    const productTitle = await page.$$eval('.item-name' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.son_saleprice' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))


    let obj = { company: "Refresh", fruits: [] }

    for (let index = 0; index < productTitle.length; index++) {

        let name = productTitle[index]
        let price = productPrice[index]

        if(name === 'אבטיח שלם'){
            let num = price * 10
            price = `${num}`
        }


        if(price === undefined){
            price = '0'
        }


        let temp = {}
        temp.name = name
        temp.price = price
        temp.type = "ק\"ג"
        temp.category = 'Fruit'
        temp.company = 'refresh'


        obj.fruits.push(temp)
    }

    let sortObj = obj.fruits.sort((a,b) => a.name.localeCompare(b.name))
        // sortObj.forEach(el => console.log(el))

    console.log(sortObj.length,'fruitsRefresh done')

    browser.close()
    return sortObj   
     
}
// fruitsRefresh()



async function fruitsCarmella(){

    let carmella = `https://www.carmella.co.il/product-category/%d7%a4%d7%99%d7%a8%d7%95%d7%aa-%d7%a8%d7%90%d7%a9%d7%99/`

    try {

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});  // {headless:false}
    
    const page = await browser.newPage();
    await page.goto(carmella, {waitUntil: 'domcontentloaded'})
    await page.setViewport({
        width: 1300,
        height: 800
    });

    await scrollDownCarmella()

    async function scrollDownCarmella(){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let totalHeight = 0;
                let distance = 450;
                let counter = 0;

                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        counter++;
        
                        if(totalHeight >= scrollHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 700);      
            });

        });
    }

    // get name of product
    const productTitle = await page.$$eval('.no_mobile' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.pr_price' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    //get product by weight or unit
    const unitOrWeight = await page.$$eval('.pr_price_kilo' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))


    const noMobile = await page.$$eval('.no_mobile' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))


    let obj = { company: "Carmella", fruits: [] }
    let prices = []

    //begin creating new object of carmella fruit
    productPrice.forEach((price,i) => {

        //set price without ₪
        let newPrice = price.replace(" ₪", "")
        prices.push(newPrice)

        //get unit or weight
        let regex3 = /ק״ג|מארז|יח׳/
        if(unitOrWeight[i] !== undefined){
            unitOrWeight[i] = unitOrWeight[i].match(regex3)
        } 

        //manual fruit fixing
        if(productTitle[i] === 'אננס קריבי'){
            productTitle[i] = 'אננס'
        }
        if(productTitle[i] === `שזיף 'בלאק דיימונד'`){
            productTitle[i] = 'שזיף אדום'
        }
        // if(productTitle[i]){
        //     productTitle[i] = 'ענבים שחורים'
        // }

        

        //check for apples types
            let newName = productTitle[i].split(' ')
            if(newName[0] === 'תפוח'){
                if(`${newName[0]} ${newName[2]}` === 'תפוח פינק'){
                    productTitle[i] = `${newName[0]} ${newName[2]}`
                }
                if(`${newName[0]} ${newName[3]}` === `תפוח סמית'`){
                    productTitle[i] = `תפוח סמית`
                }
            }
        


        let temp = {}

        if (price !== undefined) {
            temp.name = productTitle[i]
            temp.price = prices[i]
            temp.type = unitOrWeight[i]
            temp.category = 'Fruit'
            temp.company = 'carmella'

            obj.fruits.push(temp)
        }

    })

       
        // //check for apples types
        //     let newName = name[index].split(' ')
        //     if(newName[0] === 'תפוח'){
        //         if(`${newName[0]} ${newName[2]}` === 'תפוח פינק'){
        //             name[index] = `${newName[0]} ${newName[2]}`
        //         }
        //         if(`${newName[0]} ${newName[3]}` === `תפוח סמית'`){
        //             name[index] = `${newName[0]} ${newName[3]}`
        //         }
        //     }
        // }


    let sortObj = obj.fruits.sort((a,b) => a.name.localeCompare(b.name))
    console.log(sortObj.length,'fruitsCarmella done')

    browser.close()
    return sortObj  

    } catch (error) {
        console.log('error occure', error)
    }


}



async function vegtablesShookit(){

    let refresh = `https://www.shookit.com/product-category/%d7%99%d7%a8%d7%a7%d7%95%d7%aa/`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh)


    // get name of product
    const productTitle = await page.$$eval('.product-title' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.product-pricing-text' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))


    let obj = { company: "Shookit", vegetables: [] }

    for (let index = 0; index < productTitle.length; index++) {

        let regex2 = /\d+\.\d/g
        let regex3 = /ק\"ג|מארז|יחידה/

        let price = productPrice[index].match(regex2)
        let unitOrWeight = productPrice[index].match(regex3)



        if(price === null){
            price = 'empty'
        } else if(price.length === 2){
            price = price[1]
        } else {
            price = price
        }

        let name = productTitle[index]

        //change names of vegetables
        if(name === 'מלפפון'){
            name = `מלפפון מובחר`
        }
        if(name === 'סלק'){
            name = `סלק אדום`
        }
        if(name === 'עגבנייה - אשכולות'){
            name = `עגבניה מובחרת`
        }
        


        let temp = {}
        temp.name = name
        temp.price = price
        temp.type = unitOrWeight
        temp.category = 'Vegetables'
        temp.company = 'shookit'


        obj.vegetables.push(temp)
    }

    // let sortObj = obj.vegetables.sort((a,b) => a.name.localeCompare(b.name))
    // let sortPrint = sortObj.forEach(el => console.log(el))
    browser.close()

    console.log(obj.vegetables.length, 'vegtablesShookit done')
    return obj.vegetables   
}



async function vegtablesRefresh(){

    let refresh = `https://www.refresh-market.co.il/category/%D7%99%D7%A8%D7%A7%D7%95%D7%AA`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh)


    // get name of product
    const productTitle = await page.$$eval('.item-name' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.son_saleprice' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))


    let obj = { company: "Refresh", vegetables: [] }

    for (let index = 0; index < productTitle.length; index++) {

        let name = productTitle[index]
        let price = productPrice[index]

        let temp = {}
        temp.name = name
        temp.price = price
        temp.type = "ק\"ג"
        temp.category = 'Vegetables'
        temp.company = 'refresh'


        obj.vegetables.push(temp)
    }

    let sortObj = obj.vegetables.sort((a,b) => a.name.localeCompare(b.name))
    // sortObj.forEach(el => console.log(`'${el.name}',`))

    browser.close()

    console.log(sortObj.length,'vegtablesRefresh done')
    return sortObj 
}
// vegtablesRefresh()




async function vegetablesCarmella(){

    let carmella = `https://www.carmella.co.il/product-category/%d7%99%d7%a8%d7%a7%d7%95%d7%aa/`


    try {
        
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

    const page = await browser.newPage();
    await page.goto(carmella, {waitUntil: 'domcontentloaded'})
    await page.setViewport({
        width: 1600,
        height: 1000
    });

    await scrollDownCarmella()

    async function scrollDownCarmella(){
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let totalHeight = 0;
                let distance = 450;
                let counter = 0;

                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        counter++;
        
                        if(totalHeight >= scrollHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 320);      
            });

        });
    }


    // get name of product
    const productTitle = await page.$$eval('.no_mobile' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.pr_price' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    const unitOrWeight = await page.$$eval('.pr_price_kilo' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))
    


let obj = { company: "Carmella", vegetables: [] }
let prices = []

//begin creating new object of carmella fruit
productPrice.forEach((price,i) => {

    //set price without ₪
    let newPrice = price.replace(" ₪", "")
    prices.push(newPrice)

    //get unit or weight
    let regex3 = /ק״ג|מארז|יח׳/
    if(unitOrWeight[i] !== undefined){
        unitOrWeight[i] = unitOrWeight[i].match(regex3)
    } 

    let name = productTitle[i].split(' ')

    //fix name of vegetable
    if(productTitle[i] === 'כרוב אדום'){
        productTitle[i] = `כרוב סגול`
    }
    if(productTitle[i] === 'עגבניה אשכולות מובחרת'){
        productTitle[i] = `עגבניה מובחרת`
    }


    let temp = {}

    if (price !== undefined) {
        temp.name = productTitle[i]
        temp.price = prices[i]
        temp.type = unitOrWeight[i]
        temp.category = 'Vegetables'
        temp.company = 'carmella'

        obj.vegetables.push(temp)
    }

  })


        



    let sortObj = obj.vegetables.sort((a,b) => a.name.localeCompare(b.name))
    // sortObj.forEach(el => console.log(el))
    console.log(obj.vegetables.length,'vegetablesCarmella done')

    browser.close()
    return obj.vegetables  

    } catch (error) {
        console.log("Error Occurred", error)
    } // end of try catch


}
// vegetablesCarmella()




async function greensRefresh(){

    let refresh = `https://www.refresh-market.co.il/category/%D7%99%D7%A8%D7%95%D7%A7%D7%99%D7%9D`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh)


    // get name of product
    const productTitle = await page.$$eval('.item-name' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.son_saleprice' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))


    let obj = { company: "Refresh", greens: [] }

    for (let index = 0; index < productTitle.length; index++) {

        let name = productTitle[index].split(' ')
        let price = productPrice[index]


        //cut the last word in a name
        let newName
        if(name.length === 2){
             newName = `${name[0]}`
        } else if(name.length === 3){
             newName = `${name[0]} ${name[1]}`
        } else if(name.length === 4){
            newName = `${name[0]} ${name[1]} ${name[2]}`
        } else {
            newName = ''
        }



        let temp = {}
        temp.name = newName
        temp.price = price
        temp.type = "מארז"
        temp.category = 'Greens'
        temp.company = 'refresh'


        obj.greens.push(temp)
    }

    let sortObj = obj.greens.sort((a,b) => a.name.localeCompare(b.name))
    // sortObj.forEach(el => console.log(`'${el.name}',`))

    browser.close()

    console.log(sortObj.length, 'greensRefresh done')
    return sortObj 
}




async function greensShookit(){

    let refresh = `https://www.shookit.com/product-category/%d7%99%d7%a8%d7%95%d7%a7%d7%99%d7%9d/`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh)


    // get name of product
    const productTitle = await page.$$eval('.product-title' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    // get product price
    const productPrice = await page.$$eval('.product-pricing-text' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    const unitOrWeight = await page.$$eval('.product-pricing-text' , innerText => innerText.map((inr,i) => 
        inr.innerText
    ))

    


    let obj = { company: "Shookit", greens: [] }

    for (let index = 0; index < productTitle.length; index++) {

        let regex2 = /\d+\.\d/g
        let regex3 = /ק\"ג|מארז|יחידה/

        let price = productPrice[index].match(regex2)
        let unitOrWeight = productPrice[index].match(/[\u0590-\u05fe?!""]+/)


        if(price === null){
            price = 'empty'
        } else if(price.length === 2){
            price = price[1]
        } else {
            price = price
        }

        let name = productTitle[index]

        //change names of greens
        if(name === 'שורש כורכום מארז 120 גרם'){
            name = `כורכום טרי`
        }
        if(name === 'ג׳ינג׳ר'){
            name = `ג'ינג'ר`
        }

        
        
    
        let temp = {}
        temp.name = name
        temp.price = price
        temp.type = unitOrWeight
        temp.category = 'Greens'
        temp.company = 'shookit'


        obj.greens.push(temp)
    }

    // let sortObj = obj.vegetables.sort((a,b) => a.name.localeCompare(b.name))
    // let sortPrint = sortObj.forEach(el => console.log(el))
    browser.close()

    console.log(obj.greens.length,'greensShookit done')
    return obj.greens   
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
            } else if (nameShookit[1] === nameRefresh[1]) {
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



function compareThirdLists(productRefresh, carmellaList) {
    let carmellaObj = {}

    //parse product refresh and secList
    let nameRefresh = productRefresh.name.split(' ')

    for (let i = 0; i < carmellaList.length; i++) {
        let carmellaItem = carmellaList[i] 
        let nameCarmella = carmellaItem.name.split(' ')


        if (nameCarmella[0] === nameRefresh[0] && nameCarmella.length > 1 && nameRefresh.length > 1) {
            if (nameCarmella[1] === nameRefresh[1] && nameCarmella.length > 2 && nameRefresh.length > 2) {
                if (nameCarmella[2] === nameRefresh[2]) {
                    carmellaObj = carmellaItem
                    break
                }
            } else if (nameCarmella[1] === nameRefresh[1]) {
                carmellaObj = carmellaItem
                break
            } 
        } else if(nameCarmella[0] === nameRefresh[0] && nameRefresh.length === 1){
                carmellaObj = carmellaItem
                break
        }


    }

    // console.log(carmellaObj,'carObj')
    return carmellaObj
}




function createExcelFileWithCombine(fruitsObjects, vegeObjects, greensObjects){

        
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
        }
      });
    
    let worksheet = workbook.addWorksheet('Sheet 1');
    
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


    //display fruits in rows
    for (let i = 0; i < fruitsObjects.length; i++) {
        const element = fruitsObjects[i];
        for (let j = 0; j < element.length; j++) {

            //check if the 3 companys have the same item or just 2 of them
            if(element.length === 2){
                // let num = parseInt
                if(j === 0){
                    worksheet.cell(i + 2, 1).string(element[j].name).style(style)
                    worksheet.cell(i + 2, 2).string(element[j].type).style(style)
                    worksheet.cell(i + 2, 3).string(element[j].price).style(style)
                } else if(j === 1 && element[j].company === 'shookit'){
                    worksheet.cell(i + 2, 4).string(element[j].name).style(style)
                    worksheet.cell(i + 2, 5).string(element[j].type).style(style)
                    worksheet.cell(i + 2, 6).string(element[j].price).style(style)

                    worksheet.cell(i + 2, 7).string('-').style(style)
                    worksheet.cell(i + 2, 8).string('-').style(style)
                    worksheet.cell(i + 2, 9).string('-').style(style)

                } else if(j === 1 && element[j].company === 'carmella') {

                    worksheet.cell(i + 2, 4).string('-').style(style)
                    worksheet.cell(i + 2, 5).string('-').style(style)
                    worksheet.cell(i + 2, 6).string('-').style(style)

                    worksheet.cell(i + 2, 7).string(element[j].name).style(style)
                    worksheet.cell(i + 2, 8).string(element[j].type).style(style)
                    worksheet.cell(i + 2, 9).string(element[j].price).style(style)
                }
            } else if (element.length === 3) {
                if (j === 0) {
                    worksheet.cell(i + 2, 1).string(element[j].name).style(style)
                    worksheet.cell(i + 2, 2).string(element[j].type).style(style)
                    worksheet.cell(i + 2, 3).string(element[j].price).style(style)
                } 
                else if (j === 1 && element[j].company === 'shookit') {
                    worksheet.cell(i + 2, 4).string(element[j].name).style(style)
                    worksheet.cell(i + 2, 5).string(element[j].type).style(style)
                    worksheet.cell(i + 2, 6).string(element[j].price).style(style)
                } else if (j === 2 && element[j].company === 'carmella'){
                    worksheet.cell(i + 2, 7).string(element[j].name).style(style)
                    worksheet.cell(i + 2, 8).string(element[j].type).style(style)
                    worksheet.cell(i + 2, 9).string(element[j].price).style(style)
                }
        }
    }
}


    //display vegetables in rows
    let fruitLength = fruitsObjects.length + 2
    for (let i = 0; i < vegeObjects.length; i++) {
        const element = vegeObjects[i];
        for (let j = 0; j < element.length; j++) {

            //check if the 3 companys have the same item or just 2 of them
            if(element.length === 2){
                if(j === 0){
                    worksheet.cell(fruitLength + i, 1).string(element[j].name).style(style)
                    worksheet.cell(fruitLength + i, 2).string(element[j].type).style(style)
                    worksheet.cell(fruitLength + i, 3).string(element[j].price).style(style)
                } else if(j === 1 && element[j].company === 'shookit'){
                    worksheet.cell(fruitLength + i, 4).string(element[j].name).style(style)
                    worksheet.cell(fruitLength + i, 5).string(element[j].type).style(style)
                    worksheet.cell(fruitLength + i, 6).string(element[j].price).style(style)

                    worksheet.cell(fruitLength + i, 7).string('-').style(style)
                    worksheet.cell(fruitLength + i, 8).string('-').style(style)
                    worksheet.cell(fruitLength + i, 9).string('-').style(style)///////
                } else if(j === 1 && element[j].company === 'carmella') {

                    worksheet.cell(fruitLength + i, 4).string('-').style(style)
                    worksheet.cell(fruitLength + i, 5).string('-').style(style)
                    worksheet.cell(fruitLength + i, 6).string('-').style(style)

                    worksheet.cell(fruitLength + i, 7).string(element[j].name).style(style)
                    worksheet.cell(fruitLength + i, 8).string(element[j].type).style(style)
                    worksheet.cell(fruitLength + i, 9).string(element[j].price).style(style)
                }
            } else if (element.length === 3) {
                if (j === 0) {
                    worksheet.cell(fruitLength + i, 1).string(element[j].name).style(style)
                    worksheet.cell(fruitLength + i, 2).string(element[j].type).style(style)
                    worksheet.cell(fruitLength + i, 3).string(element[j].price).style(style)
                } 
                else if (j === 1 && element[j].company === 'shookit') {
                    worksheet.cell(fruitLength + i, 4).string(element[j].name).style(style)
                    worksheet.cell(fruitLength + i, 5).string(element[j].type).style(style)
                    worksheet.cell(fruitLength + i, 6).string(element[j].price).style(style)
                } else if (j === 2 && element[j].company === 'carmella'){
                    worksheet.cell(fruitLength + i, 7).string(element[j].name).style(style)
                    worksheet.cell(fruitLength + i, 8).string(element[j].type).style(style)
                    worksheet.cell(fruitLength + i, 9).string(element[j].price).style(style)
                }
          }
        }
    }



    //display greens in rows
    let fruitAndVegeLength = fruitsObjects.length + vegeObjects.length + 2
    for (let i = 0; i < greensObjects.length; i++) {
        const element = greensObjects[i];
        for (let j = 0; j < element.length; j++) {

            //check if the 3 companys have the same item or just 2 of them
            if(element.length === 2){
                if(j === 0){
                    worksheet.cell(fruitAndVegeLength + i, 1).string(element[j].name).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 2).string(element[j].type).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 3).string(element[j].price).style(style)
                } else if(j === 1 && element[j].company === 'shookit'){
                    worksheet.cell(fruitAndVegeLength + i, 4).string(element[j].name).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 5).string(element[j].type).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 6).string(element[j].price).style(style)

                    worksheet.cell(fruitAndVegeLength + i, 7).string('-').style(style)
                    worksheet.cell(fruitAndVegeLength + i, 8).string('-').style(style)
                    worksheet.cell(fruitAndVegeLength + i, 9).string('-').style(style)
                } else if(j === 1 && element[j].company === 'carmella') {

                    worksheet.cell(fruitAndVegeLength + i, 4).string('-').style(style)
                    worksheet.cell(fruitAndVegeLength + i, 5).string('-').style(style)
                    worksheet.cell(fruitAndVegeLength + i, 6).string('-').style(style)

                    worksheet.cell(fruitAndVegeLength + i, 7).string(element[j].name).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 8).string(element[j].type).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 9).string(element[j].price).style(style)
                }
            } else if (element.length === 3) {
                if (j === 0) {
                    worksheet.cell(fruitAndVegeLength + i, 1).string(element[j].name).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 2).string(element[j].type).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 3).string(element[j].price).style(style)
                } 
                else if (j === 1 && element[j].company === 'shookit') {
                    worksheet.cell(fruitAndVegeLength + i, 4).string(element[j].name).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 5).string(element[j].type).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 6).string(element[j].price).style(style)
                } else if (j === 2 && element[j].company === 'carmella'){
                    worksheet.cell(fruitAndVegeLength + i, 7).string(element[j].name).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 8).string(element[j].type).style(style)
                    worksheet.cell(fruitAndVegeLength + i, 9).string(element[j].price).style(style)
                }
          }
        }
    }



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
    workbook.write('Excel.xlsx');

    // io.on('connection', socket => {
    //     socket.emit('new-msg', 'message from callProgram')
    // })
}






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
    
    // cancelOneModal()
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
// selectAll()





server.listen(process.env.PORT || 5000, () => console.log("Connected"))



//tests
let reg = /[\u0590-\u05fe][(?!"")][\u0590-\u05fe]/g
let reg2 = /[0-9]+.[0-9]/g
let reg3 = /[\u0590-\u05fe?!""]+/g
let reg4 = /ק\"ג|מארז|יחידה/
let reg5 = /\d\d\.\d/g

let str = `(₪34.9 / ק"ג ק"ג) `
let str2 = 'יחידה - 44.9'
let str3 = 'מארז - 29.9'
let str4 = "39.9 , 34.9"


let str5 = "תפוח עץ - מוזהב"
let reg6 = /[^- עץ]+/g
let result6 = str5.match(reg6)
console.log(result6)



let result = str.match(reg3)
let result2 = str2.match(reg3)
let result3 = str3.match(reg3)

let result4 = str.match(reg4)
let result5 = str4.match(reg5)





console.log(result)
console.log(result2)
console.log(result3)
console.log(result4)
console.log(result5)

