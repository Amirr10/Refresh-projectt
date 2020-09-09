const puppeteer = require('puppeteer');

class CarmellaService {

    async getFruits(){

        let carmella = `https://www.carmella.co.il/product-category/%d7%a4%d7%99%d7%a8%d7%95%d7%aa-%d7%a8%d7%90%d7%a9%d7%99/`

        try {

            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });  // {headless:false}

            const page = await browser.newPage();
            await page.goto(carmella, { waitUntil: 'load', timeout: 0 })
            await page.setViewport({
                width: 1300,
                height: 800
            });

            await scrollDownCarmella()

            async function scrollDownCarmella() {
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

                            if (totalHeight >= scrollHeight) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, 700);
                    });

                });
            }

            // get name of product
            const productTitle = await page.$$eval('.no_mobile', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))

            // get product price
            const productPrice = await page.$$eval('.pr_price', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))

            //get product by weight or unit
            const unitOrWeight = await page.$$eval('.pr_price_kilo', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))

            const noMobile = await page.$$eval('.no_mobile', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))


            let obj = { company: "Carmella", fruits: [] }
            let prices = []




            //begin creating new object of carmella fruit
            productPrice.forEach((price, i) => {
                // let testName = productTitle[i].split(/\s+/)
                let name = productTitle[i].split(' ')
                // console.log(name)

                //set price without ₪
                let newPrice = price.replace(" ₪", "")
                prices.push(newPrice)

                //get unit or weight
                let regex3 = /ק״ג|מארז|יח׳/
                if (unitOrWeight[i] !== undefined) {
                    unitOrWeight[i] = unitOrWeight[i].match(regex3)
                }


                //manual fruit fixing

                if (productTitle[i] === "אגס ספדונה") {
                    productTitle[i] = `אגס`
                }
                if (productTitle[i] === 'אננס קריבי') {
                    productTitle[i] = 'אננס'
                }
                if (productTitle[i] === `שזיף 'בלאק דיימונד'`) {
                    productTitle[i] = 'שזיף אדום'
                }
                if (productTitle[i] === `לימון בודהה ירוק`) {
                    productTitle[i] = '-'
                }

                // let newName = productTitle[i].split(' ')
                let newName = productTitle[i].split(/\s+/)
                // console.log(newName)

                if (newName[0] === 'תפוח') {
                    let gala = newName[2].replace(/\'+/g, "").trim()

                    if (gala === 'גאלה') {
                        productTitle[i] = `תפוח גאלה`
                    } else if (`${newName[2]}` !== `גראנד`) {
                        productTitle[i] = `${newName[0]} ${newName[2].replace("/", "")}`
                    } else {
                        productTitle[i] = `תפוח סמית`
                    }
                }
                if (newName[0] === 'אבטיח') {
                    if (newName.length === 1) {
                        productTitle[i] = `אבטיח שלם`
                        let num = prices[i] * 10
                        prices[i] = `${num}`
                    } else if (`${newName[0]} ${newName[1]}` === `חצי אבטיח`) {
                        productTitle[i] = `חצי אבטיח`
                    }
                }
                if (newName[0] === 'קיווי') {
                    if (`${newName[0]} ${newName[1]}` === 'קיווי ניוזילנדי') {
                        productTitle[i] = `קיווי ירוק`
                    }
                }
                if (newName[0] === 'אוכמניות') {
                    productTitle[i] = `אוכמניות (מארז)`
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


            let sortObj = obj.fruits.sort((a, b) => a.name.localeCompare(b.name))
            console.log(sortObj.length, 'fruitsCarmella done')

            browser.close()
            return sortObj

        } catch (error) {
            console.log('error occure', error)
        }

    }



    async getVegetables(){

        let carmella = `https://www.carmella.co.il/product-category/%d7%99%d7%a8%d7%a7%d7%95%d7%aa/`

        try {
            
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    
        const page = await browser.newPage();
        await page.goto(carmella, {waitUntil: 'load', timeout: 0})
        await page.setViewport({
            width: 1600,
            height: 1000
        });
    
        await scrollDownCarmella()
    
        async function scrollDownCarmella(){
    
            try {
    
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
                        }, 330);      
                });
    
            });
        } catch (error) {
             console.log('error', error)   
        }
    
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
    
        // console.log(productTitle)
        // console.dir(productTitle, {'maxArrayLength': null})
    
        
    
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
        // console.log(name)
    
        //fix name of vegetable/greens
        if(`${name[0]} ${name[1]} ${name[2]}` === `מנגולד / עלי`){
            productTitle[i] = `סלק עלים / מנגולד (מארז`
        }
        if(`${name[0]}` === `טימין/`){
            productTitle[i] = `קורנית/טימין (מארז)`
        }    
        if(`${name[0]}` === `כרישה/`){
            productTitle[i] = `לוף/כרישה`
        }
        if(`${name[0]}` === `תרד\n(מארז)\n400`){
            if(name.length === 1){
                productTitle[i] = `עלי תרד`
            }
        }
        if(`${name[0]}` === `רוקולה/ארוגולה`){
            productTitle[i] = `רוקולה`
        }
        if(`${name[0]}` === `ג'ינג'ר/`){
            productTitle[i] = `ג'ינג'ר`
        }
        if(`${name[0]} ${name[1]}` === `אבוקדו 'גליל'`){
            productTitle[i] = `אבוקדו בשל`
        }
        if(`${name[0]} ${name[1]}` === `עלי סלרי/כרפס`){
            productTitle[i] = `סלרי עלים`
        }
        if(`${name[0]} ${name[1]}` === `אנדיב/ עולש` && name.length === 2){
                productTitle[i] = `אנדיב (מארז)`
        }
        if (`${name[1]}` === 'שרי') {
            if (`${name[2]}` === 'תמר') {
                productTitle[i] = `שרי אדום (מארז)`
                let num = prices[i] * 0.4
                prices[i] = `${num}`
            }
             else if (`${name[2]}` === 'צהוב'){
                productTitle[i] = `שרי צהוב`
                let num = prices[i] * 0.4
                prices[i] = `${num}`
            }
        }
        if(productTitle[i] === 'כרוב אדום'){
            productTitle[i] = `כרוב סגול`
        }
        if(`${name[0]}` === 'עגבניה'){
            if(`${name[0]} ${name[1]} ${name[2]}` === 'עגבניה אשכולות מובחרת'){
                productTitle[i] = `עגבניה מובחרת`
            } else if(`${name[0]} ${name[1]}` === `עגבניה \'מגי\'\n(מארז)\n1.3`) {
                productTitle[i] = `עגבניה מגי (מארז)`
            }
        }
        if(`${name[0]} ${name[1]}` === 'פטריות שמפניון'){
            if(`${name[0]} ${name[1]} ${name[2]}` === 'פטריות שמפניון חומות'){
                productTitle[i] = ``
            } else {
                productTitle[i] = `שמפניון (מארז)`
            }
        }
        if(`${name[0]} ${name[1]}` === 'צמד שמפניון'){
            productTitle[i] = `דואט פטריות (מארז)`
        }
        if(`${name[0]} ${name[1]}` === 'נבטים סינים'){
            productTitle[i] = `נבטים סיניים`
        }
        if(`${name[0]} ${name[1]}` === 'פטריות מיקס\n(מארז)\n400'){
            productTitle[i] = `מיקס פטריות (מארז)`
            let num = prices[i] / 2
            prices[i] = `${num}`
        }
        if(`${name[0]} ${name[1]}` === 'תירס "סוויטי"'){
            productTitle[i] = `תירס (מארז) "סיוון"`
        }
        if(`${name[0]} ${name[1]}` === `שום ארוז\n(מארז`){
            // productTitle[i] = `ראש שום`
            productTitle[i] = `שום ארוז`
            // let num = prices[i] / 4
            // unitOrWeight[i] = `ק"ג`
            // prices[i] = `${num}`
        }
        if(`${name[0]} ${name[1]} ${name[2]}` === 'סלק אדום ואקום'){
            productTitle[i] = `סלק בוואקום (מארז)`
        }
        if(`${name[0]} ${name[1]}` === 'שום ארוז'){
            productTitle[i] = `שום ארוז`////
       }
        if(`${name[0]} ${name[1]}` === 'גזר תפזורת'){
            productTitle[i] = `גזר`
        }
        if(`${name[0]} ${name[1]}` === 'מלפפון בייבי'){
            productTitle[i] = `מלפפון מיני`
        }
        if(`${name[0]} ${name[1]}` === 'חציל חממה'){
            productTitle[i] = `חציל`
        }
        if(`${name[0]} ${name[1]}` === 'חסה עגולה/'){
            productTitle[i] = `חסה עגולה`
        }
        if(`${name[0]} ${name[1]}` === 'שורש סלרי'){
            productTitle[i] = `סלרי ראש`
        }
        if(`${name[0]} ${name[1]}` === 'שום קלוף'){
            productTitle[i] = `שום קלוף (מארז) 1 ק"ג`
        }
        // if(`${name[0]} ${name[1]} ${name[2]}` === 'עגבניות שרי תמר'){
        //     productTitle[i] = `סלק בוואקום (מארז)`
        // }
        if(`${name[0]} ${name[1]} ${name[2]}` === 'פלפל חריף ירוק'){
            productTitle[i] = `פלפל ירוק חריף`
        }
        if(`${name[0]} ${name[1]} ${name[2]}` === `פלפל צ'ילי אדום`){
            productTitle[i] = `פלפל צ'ילי (מארז)`
        }
        if(`${name[0]} ${name[1]} ${name[2]}` === `פלפל טינקרבל מתוק`){
            productTitle[i] = `פלפלונים מתוקים - טינקרבל `
        }
        if(`${name[0]} ${name[1]}` === `שורש כורכום`){
                productTitle[i] = `כורכום טרי`
        }
        if(`${name[0]} ${name[1]}` === `חסה לבבות`){
            productTitle[i] = `לבבות חסה`
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
}

module.exports = CarmellaService;