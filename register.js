const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const MysqlControl = require('./mysql').MysqlControl;
const USERS = new MysqlControl('STU_ELE', 'USERS');
const router = express.Router();
router.use('/', express.static('./static/RegisterPage'));
const cookieParser = require('cookie-parser');
const cookieControl = require('./cookie').cookieControl;
const cookiess = new cookieControl()
router.use(cookieParser());
const token = require('./tools/token');
const ejs = require('ejs')


const urlencoded = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    ejs.renderFile('./static/RegisterPage/register.ejs', {}, function (err, result) {
        res.send(result)
    })
})

router.post('/', urlencoded, (req, res) => {
    var StudentID = req.body.StudentID;
    var Password = req.body.Password;
    var Info = req.body.Info;
    var realname = req.body.realname
    if (StudentID && Password && Info && realname) {
        var tok = token.createToken({
            StudentID: StudentID,
        }, 3600);

        res.cookie('token', tok);
        //console.log(tok)
        var sql1 = `SELECT *FROM STU_INFORMATION WHERE SNO=` + StudentID + ';';
        var statu = 0;
        //console.log(StudentID)
        USERS.query(sql1, function (err, mysqlData1,field) {
            // console.log(mysqlData1)
            if (err) {
                console.log(err)
            }
            else {
                if (JSON.stringify(mysqlData1) === '[]') {
                    statu = 0
                }
                else {
                    statu = 1
                }
            }
        })
        var sql2 = `INSERT INTO USERS(USER_NAME,STUDENTID,PASSWORDS,CLASS,TOKEN,STATU) VALUES("${realname}","${StudentID}","${Password}","${Info}","${tok}",${statu});`;
        USERS.query(sql2, function (err, mysqlData2,field) {
            if (err) {
                ejs.renderFile('./static/RegisterPage/tishi.ejs', {}, function (err, result) {
                    res.send(result)
                })
            }
            else {
                res.sendFile(path.resolve('./static/LoginPage/login.html'));
            }
        })
    } else {
        ejs.renderFile('./static/RegisterPage/tishi.ejs', {}, function (err, result) {
            res.send(result)
        })
    }

})

module.exports = router;