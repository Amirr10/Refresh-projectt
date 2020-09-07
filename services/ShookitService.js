const puppeteer = require('puppeteer');

module.exports =  class ShookitService {

    async getFruits(){

        let shookit = `https://www.shookit.com/product-category/%d7%a4%d7%99%d7%a8%d7%95%d7%aa/`

        try {

            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto(shookit, { waitUntil: 'load', timeout: 0 })


            // get name of product
            let productTitle = await page.$$eval('.product-title', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))

            //get product price
            let productPrice = await page.$$eval('.product-pricing-container', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))

            // console.log(productTitle, productTitle.length)

            let obj = { company: "shookit", fruits: [] }

            //create key value pairs of p.name and p.price

            for (let index = 0; index < productTitle.length; index++) {

                let regex = /([\u0590-\u05fe][(?!"")][\u0590-\u05fe]|[\u0590-\u05fe])+/
                let regex2 = /\d+\.\d/g

                //get unit type
                let regex3 = /ק\"ג|מארז|יחידה/

                let unit = productPrice[index].split(' ')
                let unitOrWeight = unit[unit.length - 1].replace(")", "")
                // console.log(unitOrWeight, index)

                let weight = productPrice[index].match(regex)
                // let unitOrWeight = productPrice[index].match(regex3)
                let price = productPrice[index].match(regex2)

                if (price === null) {
                    price = 'empty'
                } else if (price.length === 2) {
                    price = price[1]
                } else {
                    price = price
                }



                let name = productTitle[index]
                let parseName = name.split(' ')

                //check for apple types
                if (parseName[0] === "תפוח") {
                    name = `${parseName[0]} ${parseName[3]}`
                    if (name === 'תפוח סמית׳')
                        name = `תפוח סמית`
                }
                if (`${parseName[0]} ${parseName[1]}` === "תמר מג'הול") {
                    name = `מארז תמר מג'הול 500 גרם`
                }
                if (`${parseName[0]}` === "קיווי") {
                    if (parseName.length === 1) {
                        name = `קיווי ירוק`
                    } else {
                        name = `קיווי צהוב`
                    }

                }
                if (`${parseName[0]} ${parseName[1]} ${parseName[2]}` === "ענב שחור טלי") {
                    name = `ענבים שחורים`
                }
                // נב שחור טלי
                // תמר מג'הול

                let temp = {}
                temp.name = name
                temp.price = price
                temp.type = unitOrWeight
                temp.category = 'Fruit'
                temp.company = 'shookit'


                obj.fruits.push(temp)
            }

            let objects = {
                name: 'Shookit'
            }


            let sortObj = obj.fruits.sort((a, b) => a.name.localeCompare(b.name))
            // sortObj.forEach(el => console.log(el))

            console.log(sortObj.length, 'fruitsShookit done')

            //  browser.close()
            return sortObj

        } catch (error) {
            console.log(error)
        }

    }




    async getVegetables(){
        
    let refresh = `https://www.shookit.com/product-category/%d7%99%d7%a8%d7%a7%d7%95%d7%aa/`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh, {waitUntil: 'load', timeout: 0})


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


        let name = productTitle[index]
        let arrName = productTitle[index].split(' ')
        // console.log(name)

        //change names of vegetables
        if(`${arrName[0]}` === 'מלפפון'){
            if(`${arrName[1]}` === `בייבי`){
                name = `מלפפון בייבי`
            } else {
                name = `מלפפון מובחר`
            }
        }

        if(name === 'תפוח אדמה בתפזורת'){
            name = `תפוח אדמה לבן`
        }
        if(name === 'תירס'){
            name = `תירס (מארז)`
        }
        if(name === 'פטריות שמפיניון'){
            name = `שמפניון (מארז)`
        }
        if(name === 'סלק'){
            name = `סלק אדום`
        }
        if(name === 'עגבנייה - אשכולות'){
            name = `עגבניה מובחרת`
        }
        if(name === `פלפל צ'ילי חריף`){
            name = `פלפל צ'ילי`
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



    async getGreens(){
        
    let refresh = `https://www.shookit.com/product-category/%d7%99%d7%a8%d7%95%d7%a7%d7%99%d7%9d/`

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(refresh, {waitUntil: 'load', timeout: 0})


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


        let splitPrice = productPrice[index].split(' ')
        let newPrice = splitPrice[0].replace("(₪","")

        let name = productTitle[index]
        // console.log(name)

        //change names of greens
        if(name === 'שורש כורכום מארז 120 גרם'){
            name = `כורכום טרי`
        }
        // עלי סלרי
        if(name === 'עלי סלרי'){
            name = `סלרי עלים`
        }
        if(name === 'כרישה'){
            name = `לוף/כרישה (מארז)`
        }
        if(name === 'ג׳ינג׳ר'){
            name = `ג'ינג'ר`
        }
        if(name === 'חסה אייסברג'){
            name = `חסה עגולה אייסברג`
        }
        if(name === 'מנגולד'){
            name = `סלק עלים /`
        }
        
        
        let temp = {}
        temp.name = name
        temp.price = newPrice
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
}