const socket = io('http://localhost:3000/')
let button = document.querySelector('.btn')
let downloadBtn = document.querySelector('.sec-btn')

//welcome socket
socket.on('welcome-msg', data => {
    console.log(data)
})


//send request to http://localhost:5000/promiseAll
button.addEventListener('click', () => {
    fetch('http://localhost:5000/promiseAll')
})


//submit http://localhost:5000/download
socket.on('new-msg', data => {
    console.log(data)
    console.log("This")

    //call /download route
    downloadBtn.click()
})




function callRed(){
    window.location.href = "http://localhost:5000/client";
}