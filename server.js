const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs')
const bodyParser = require('body-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });
const moment = require('moment');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path')
const MysqlControl = require('./mysql').MysqlControl;
const USERS = new MysqlControl('STU_ELE', 'USERS');
const cookieControl = require('./cookie').cookieControl;
const cookiess = new cookieControl()
const token = require('./tools/token');

app.use(cookieParser());
app.use('/', express.static('./'));
app.use('/', express.static('./static'));
app.use('/', express.static('./static/LoginPage'));
app.use('/register', require('./register'));
app.use('/teacher', require('./teacher'))
app.use('/student', require('./student'))

app.use(express.static('./Home'))
app.get('/', function (req, res) {
    var exit = req.query.exit
    if (exit) {
        res.cookie('id','')
        res.redirect('/')
    }
    else {
        var SNO = req.cookies['id'];
        var obj = { user: '' }
        obj.user = SNO
        ejs.renderFile('./Home/Home.ejs', { obj: obj }, function (err, result) {
            res.send(result)
        })
    }

})

app.get('/login', function (req, res) {
    res.sendFile(path.resolve('./static/LoginPage/login.html'));
})

app.post('/login', urlencoded, function (req, res) {
    var no = req.body.NO;
    var password = req.body.PASS;
    let sql = `select ID,STATU from USERS where STUDENTID ='${no}' and PASSWORDS = '${password}'`
    USERS.query(sql, function (err, mysqlData,field) {
        if (err) {
            console.log(err)
        }
        else {
            if (JSON.stringify(mysqlData) === '[]') {
                res.redirect('/login/again');
            }
            else {
                // 获得权限和id
                var statu = mysqlData[0].STATU;
                var id = mysqlData[0].ID;
                // 生成token
                var tok = token.createToken({
                    StudentID: no,
                }, 3600);

                // 在数据库中更改token
                let sql = `UPDATE USERS SET TOKEN = '${tok}' WHERE ID = '${id}';`
                USERS.query(sql, function (err, result,field) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result)
                    // 更改客户端cookie
                    res.cookie('token', tok);
                    res.cookie('id', no);
                    if (statu == 2) {
                        res.redirect('/teacher');
                    }
                    else {
                        res.redirect('/student');
                    }
                })

            }
        }
    })
})

app.get('/login/again', function (req, res) {
    res.sendFile(path.resolve('./static/LoginPage/loginagain.html'));
})




app.listen(4000);