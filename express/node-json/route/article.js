const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const pathLib = require('path');
const fs = require('fs');
let file = pathLib.join(__dirname, '../data/home_page.json');

// 连接池
// const db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'website'});

module.exports = function () {
    let router = express.Router();
    // get home_page 数据
    router.get('/', (req, res, next) => {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.status(500).send('文件读取失败');
            } else {
                res.status(200).send(data);
            }
        });
    })

    // post home_page 数据
    router.post('/', (req, res, next) => {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.status(501).send('数据添加失败');
            } else {
                let arr = JSON.parse(data);
                // 将 parmas 添加到现有的数据文件中,重新写入json文件
                arr.data.push(req.body);
                for (let i = 0; i < arr.data.length; i++) {
                    arr.data[i].ID = i;
                }
                let str = JSON.stringify(arr); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
                fs.writeFile(file, str, function (write_err) {
                    if (write_err) {
                        res.status(501).send('数据添加失败');
                    } else {
                        res.send("新增成功");
                    }
                });
            }
        });
    })

    // put home_page 数据
    router.put('/', (req, res, next) => {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.status(501).send('数据添加失败');
            } else {
                let arr = JSON.parse(data);
                for (let i = 0; i < arr.data.length; i++) {
                    if (req.body.ID == arr.data[i].ID) {
                        for (let key in req.body) {
                            if (arr.data[i][key]) {
                                arr.data[i][key] = req.body[key];
                            }
                        }
                    }
                }
                let str = JSON.stringify(arr);
                fs.writeFile(file, str, function (write_err) {
                    if (write_err) {
                        res.status(502).send('数据添加失败');
                    } else {
                        res.send("删除成功");
                    }
                });
            }
        });
    })

    // delete home_page 数据
    router.delete('/', (req, res, next) => {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                res.status(501).send('数据添加失败');
            } else {
                let arr = JSON.parse(data);
                for (let i = 0; i < arr.data.length; i++) {
                    if (req.body.ID == arr.data[i].ID) {
                        arr.data.splice(i, 1);
                        break;
                    }
                }
                let str = JSON.stringify(arr);
                fs.writeFile(file, str, function (write_err) {
                    if (write_err) {
                        res.status(502).send('数据添加失败');
                    } else {
                        res.send("删除成功");
                    }
                });
            }
        });
    })

    // upload image home_page 数据
    router.post('/upload', (req, res, next) => {
        let title = req.body.title;
        let description = req.body.description;
        // console.log(req.files); 文件信息,数组
        if (req.files[0]) {
            var ext = pathLib.parse(req.files[0].originalname).ext; // .png
            var oldPath = req.files[0].path; // www\upload\ec4a4706b25234636f4279fa6f57f443
            var newPath = req.files[0].path + ext;  // www\upload\ec4a4706b25234636f4279fa6f57f443.png
            var newFileName = req.files[0].filename + ext; // ec4a4706b25234636f4279fa6f57f443.png
        } else {
            var newFileName = null;
        }
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.status(500).send('file opration error').end();
            } else {
                // 已完成图片文件上传，把新上传的图片写入数据文件
                fs.readFile(file, 'utf-8', function (err, data) {
                    if (err) {
                        res.status(501).send('图片上传失败');
                    } else {
                        let arr = JSON.parse(data);
                        // 将 parmas 添加到现有的数据文件中,重新写入json文件
                        arr.data.push({"name": "red", "src": "../www/upload/" + newFileName});
                        for (let i = 0; i < arr.data.length; i++) {
                            arr.data[i].ID = i;
                        }
                        let str = JSON.stringify(arr); //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
                        fs.writeFile(file, str, function (write_err) {
                            if (write_err) {
                                res.status(501).send('数据添加失败');
                            } else {
                                res.status(200).send({"name": "red", "src": "../www/upload/" + newFileName});
                            }
                        });
                    }
                });
            }
        });
    })
    return router;
};