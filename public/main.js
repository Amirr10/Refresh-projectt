let button = document.querySelector('.btn')
let downloadBtn = document.querySelector('.sec-btn')

// const socket = io('https://refresh-app1.herokuapp.com/')
const socket = io('http://localhost:5000/')


// https://refresh-app1.herokuapp.com/ 

//welcome socket
socket.on('welcome-msg', data => {
    console.log(data)
})


//send request to http://localhost:5000/promiseAll
button.addEventListener('click', (e) => {
    fetch('http://localhost:5000/promiseAll')
        .then(res => {
            console.log('response')
            // download()
        })
            download()

    // fetch('https://refresh-app1.herokuapp.com/test2/')
    // https://refresh-app1.herokuapp.com/promiseAll/
})


//submit http://localhost:5000/download
socket.on('new-msg', data => {
    console.log("new-msg socket")

    // call /download route
    // setTimeout(() => {
    //     downloadBtn.style.visibility = 'visible'
    //     downloadBtn.addEventListener('click', (e) => {
    //         console.log('clicked')
    //     })
    // }, 2000);

})


function download(){
    setInterval(() => {
        console.log('10sec')
    }, 10000);

    setTimeout(() => {
        
        downloadBtn.click()
    }, 30000);


    // window.location.href = "http://localhost:5500/public/index.html";
    // socket.disconnect()
}



function callRed(){
    window.location.href = "http://localhost:5000/client";
}