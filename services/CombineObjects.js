
class CombineService {

    //combine refresh and shookit objects to one row
    async combineFruitsOrVegetables(shookitFruits, refreshFruits, carmellaFruits){

    let combineObj = []
    let flag = false
    let set = new Set()

    //run over one array of fruits
    for (let index = 0; index < refreshFruits.length; index++){
        let refreshObj = refreshFruits[index];
        // let nameRefresh = refreshObj.name.split(' ')

        //compare refresh fruit with shookit fruit
        let arr = this.compareTwoLists(refreshObj, shookitFruits)

        //compare refresh fruit with carmella fruit
        let thirdObj = await this.compareThirdLists(refreshObj, carmellaFruits)

        
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


    
    //compare between refresh object with shookit object and combine the objects
    //if they match into an array 
    compareTwoLists(productRefresh, shookitList){

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
            } else if(nameShookit[0] === nameRefresh[0] && nameRefresh.length === 1 || nameShookit[0] === nameRefresh[0] && nameShookit.length === 1) {
                    combineArr = [productRefresh, shookitObj]
                    break;
            }  
    
        }
    
        if(combineArr.length > 0){
            return combineArr
        } else {
            return null
        }
    }


    //compare between refresh object with carmella object and add the object
    //if they match into the array of refresh and shookit 
    compareThirdLists(productRefresh, carmellaList){

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
            } else {
                continue //TEST
            }
        } else if(nameCarmella[0] === nameRefresh[0] && nameRefresh.length === 1){
                carmellaObj = carmellaItem
                break
        } 


     }
    return carmellaObj
    }

}

module.exports = CombineService;