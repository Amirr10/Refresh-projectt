const puppeteer = require('puppeteer');

class RefreshService {

    async getFruits(){

        let refresh = `https://www.refresh-market.co.il/category/%D7%A4%D7%99%D7%A8%D7%95%D7%AA`

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(refresh, { waitUntil: 'load', timeout: 0 })


        // get name of product
        const productTitle = await page.$$eval('.item-name', innerText => innerText.map((inr, i) =>
            inr.innerText
        ))

        // get product price
        const productPrice = await page.$$eval('.son_saleprice', innerText => innerText.map((inr, i) =>
            inr.innerText
        ))


        let obj = { company: "Refresh", fruits: [] }

        for (let index = 0; index < productTitle.length; index++) {

            let name = productTitle[index]
            let price = productPrice[index]

            // console.log(name)

            if (name === 'אבטיח שלם') {
                let num = price * 10
                price = `${num}`
            }
            if (price === undefined) {
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

        let sortObj = obj.fruits.sort((a, b) => a.name.localeCompare(b.name))
        // sortObj.forEach(el => console.log(el))

        console.log(sortObj.length, 'fruitsRefresh done')

        browser.close()
        return sortObj  
    }


    async getVegetables(){
    
        let refresh = `https://www.refresh-market.co.il/category/%D7%99%D7%A8%D7%A7%D7%95%D7%AA`

        try {

            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }); //{args: ['--no-sandbox', '--disable-setuid-sandbox']}
            const page = await browser.newPage();
            await page.goto(refresh, { waitUntil: 'load', timeout: 0 })


            async function autoScroll(page) {
                await page.evaluate(async () => {
                    await new Promise((resolve, reject) => {
                        var totalHeight = 0;
                        var distance = 300;
                        var timer = setInterval(() => {
                            var scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            totalHeight += distance;

                            if (totalHeight >= scrollHeight) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, 100);
                    });
                });
            }

            await autoScroll(page);


            // get name of product
            const productTitle = await page.$$eval('.item-name', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))

            // get product price
            const productPrice = await page.$$eval('.son_saleprice', innerText => innerText.map((inr, i) =>
                inr.innerText
            ))


            let obj = { company: "Refresh", vegetables: [] }

            for (let index = 0; index < productTitle.length; index++) {

                let name = productTitle[index]
                let price = productPrice[index]

                // console.log(name.split(' '))

                let unitOrWeight = name.split(' ')
                if (unitOrWeight[unitOrWeight.length - 1] === `(מארז)`) {
                    unitOrWeight = `מארז`
                } else {
                    unitOrWeight = `ק\"ג`
                }

                let temp = {}
                temp.name = name
                temp.price = price
                temp.type = unitOrWeight
                temp.category = 'Vegetables'
                temp.company = 'refresh'

                obj.vegetables.push(temp)
            }


            let sortObj = obj.vegetables.sort((a, b) => a.name.localeCompare(b.name))
            // sortObj.forEach(el => console.log(`'${el.name}',`))

            console.log(sortObj.length, 'vegtablesRefresh done')
            browser.close()
            return sortObj

        } catch (error) {
            console.log(error)
        }

    }


    async getGreens(){
        
        let refresh = `https://www.refresh-market.co.il/category/%D7%99%D7%A8%D7%95%D7%A7%D7%99%D7%9D`

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(refresh, { waitUntil: 'load', timeout: 0 })


        // get name of product
        const productTitle = await page.$$eval('.item-name', innerText => innerText.map((inr, i) =>
            inr.innerText
        ))

        // get product price
        const productPrice = await page.$$eval('.son_saleprice', innerText => innerText.map((inr, i) =>
            inr.innerText
        ))


        let obj = { company: "Refresh", greens: [] }

        for (let index = 0; index < productTitle.length; index++) {

            let name = productTitle[index].split(' ')
            let price = productPrice[index]
            // console.log(name, index)

            let unitOrWeight = name
            if (unitOrWeight[unitOrWeight.length - 1] === `(מארז)`) {
                unitOrWeight = `מארז`
            } else {
                unitOrWeight = `יחידה`
            }


            //cut the last word in a name
            let newName
            if (name.length === 2) {
                newName = `${name[0]}`
            } else if (name.length === 3) {
                newName = `${name[0]} ${name[1]}`
            } else if (name.length === 4) {
                newName = `${name[0]} ${name[1]} ${name[2]}`
            } else if (name.length === 5) {
                newName = `${name[0]} ${name[1]} ${name[2]} ${name[3]}`
            } else {
                newName = ''
            }


            let temp = {}
            temp.name = newName
            temp.price = price
            temp.type = unitOrWeight
            temp.category = 'Greens'
            temp.company = 'refresh'

            obj.greens.push(temp)
        }

        let sortObj = obj.greens.sort((a, b) => a.name.localeCompare(b.name))
        // sortObj.forEach(el => console.log(`'${el.name}',`))

        browser.close()

        console.log(sortObj.length, 'greensRefresh done')
        return sortObj 
    }
}


module.exports = RefreshService;