const express = require('express');
const static = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const pathLib=require('path');
const fs=require('fs');
const expressRoute=require('express-route');
url =require('url');

// 连接池
const db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'website'});
var server = express();

//allow custom header and CORS  Access-Control-Allow-Origin ：允许的域  Access-Control-Allow-Headers   允许的header类型
server.all('*',function (req, res, next) {
    // 排除 favicon.ico 的请求
    var pathname = url.parse(req.url).pathname;
    if (pathname === '/favicon.ico') return;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
server.listen(8080);

// post 数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/upload'}).any());

// 路由 route
server.use('/article', require('./route/article.js')());

// default：static
server.use(static('./'));