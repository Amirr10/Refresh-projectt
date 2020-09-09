const express = require('express');
const excel = require('excel4node');
const app = express()
    , server = require('http').createServer(app);

const workbook = new excel.Workbook();
const puppeteer = require('puppeteer');
const cors = require('cors')
const fs = require('fs');

app.use(express.static('public'))
app.use(cors())


const allData = require('./controller/AllData')
app.get('/promiseAll', allData.getAllData);
app.get('/check', allData.testFunction);
app.get('/download', allData.download);


server.listen(process.env.PORT || 5000, () => console.log("Connected"))
