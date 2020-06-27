const express=require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const pathLib=require('path');
const fs=require('fs');

// 连接池
const db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'website'});

module.exports=function (){
    let router=express.Router();
    // get article_table 数据
    router.get('/', (req, res, next) => {
        db.query("SELECT * FROM article_table", (err, data) => {
            if (err) {
                res.status(500).send('database error').end();
            } else {
                // res.send(JSON.stringify(data)); // 如果不添加 JSON.stringify 则会报错
                res.send(JSON.stringify(data));
            }
        });
    })

    // post article_table 数据
    router.post('/', (req, res, next) => {
        let ID = req.body.ID;
        let author = req.body.author;
        let sex = req.body.sex;
        if (!ID || !author || !sex) {
            res.status(400).send('arg error').end();
        } else {
            //添加
            db.query(`INSERT INTO article_table (ID, author, sex) VALUE('${ID}', '${author}', '${sex}')`, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('database error').end();
                } else {
                    res.status(201).send('post success').end();
                }
            });
        }
    })

    // put article_table 数据
    router.put('/', (req, res, next) => {
        db.query(`UPDATE article_table SET author='${req.body.author}',sex='${req.body.sex}' WHERE ID=${req.body.ID}`, (err, data)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('database error').end();
                }else{
                    res.status(201).send('put success').end();
                }
            }
        );
    })

    // upload image article_table 数据
    router.post('/upload', (req, res, next) => {
        let title=req.body.title;
        let description=req.body.description;
        if(req.files[0]){
            var ext=pathLib.parse(req.files[0].originalname).ext;
            var oldPath=req.files[0].path;
            var newPath=req.files[0].path+ext;
            var newFileName=req.files[0].filename+ext;
        }else{
            var newFileName=null;
        }
        fs.rename(oldPath, newPath, (err)=>{
            if(err){
                res.status(500).send('file opration error').end();
            }else{
                // 已完成图片文件上传，把新上传的图片写入数据库
                db.query(`INSERT INTO banner_table \
        (title, description, src)
        VALUES('${title}', '${description}', '${newFileName}')`, (err, data)=>{
                    if(err){
                        res.status(500).send('database error').end();
                    }else{
                        res.send('成功写入数据库').end();
                    }
                });
            }
        });
    })
    return router;
};