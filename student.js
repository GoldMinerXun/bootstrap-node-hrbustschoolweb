const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const MysqlControl = require('./mysql').MysqlControl;
const USERS = new MysqlControl('STU_ELE', 'USERS');
const STU_INFORMATION = new MysqlControl('STU_ELE', 'STU_INFORMATION');
const CP_INFORMATION = new MysqlControl('STU_ELE', 'CP_INFORMATION');
const STU_PRO_STATUS = new MysqlControl('STU_ELE', 'STU_PRO_STATUS')
const router = express.Router();
const moment = require('moment');
const cookieParser = require('cookie-parser');
const urlencoded = bodyParser.urlencoded({ extended: false });
const token = require('./tools/token');

router.use('/', express.static('./static/RegisterPage'));
router.use(cookieParser());
router.use('/', express.static('./'));
router.use('/', express.static('./static'));
router.use('/', express.static('./static/StudentPage'))

router.get('/', function (req, res) {
    if (req.query.sno == 'admin') {
        res.redirect('/teacher')
    } else {
        var tok = req.cookies['token'];
        var id = req.cookies['id'];
        if (tok && id && token.checkToken(tok)) {
            let sql = `select USER_NAME,STATU,ID from USERS where TOKEN = '${tok}' and STUDENTID = ${id};`
            USERS.query(sql, function (err, userData,field) {
                if (JSON.stringify(userData) === '[]') {
                    return res.redirect('/login');
                }
                if (!(userData[0].STATU == 0 || userData[0].STATU == 1)) {
                    return res.redirect('/login');
                }

                let sql = `select * from CP_INFORMATION;`
                CP_INFORMATION.query(sql, function (err, cpData,field) {
                    ejs.renderFile('./static/StudentPage/studentpageindex.ejs', { userData: userData[0], cpData: cpData }, function (err, result) {
                        return res.send(result)
                    })
                })
            })
        } else {
            return res.redirect('/login');
        }
    }

})

router.get('/appointment', function (req, res) {
    var tok = req.cookies['token'];
    var id = req.cookies['id'];
    if (tok && id && token.checkToken(tok)) {
        let sql = `select USER_NAME,STATU,ID from USERS where TOKEN = '${tok}' and STUDENTID = ${id};`
        USERS.query(sql, function (err, userData,field) {
            if (JSON.stringify(userData) === '[]') {
                return res.redirect('/login');
            }
            if (!(userData[0].STATU == 0 || userData[0].STATU == 1)) {
                return res.redirect('/login');
            }
            else if (userData[0].STATU == 1) {
                let sql = `SELECT * FROM CP_INFORMATION ORDER BY COMTIME`
                CP_INFORMATION.query(sql, function (err, cpData,field) {
                    // 取预约状态(预约/取消)
                    let sql = `SELECT PID,STATE,SNO FROM STU_PRO_STATUS WHERE SNO='${id}'`
                    STU_PRO_STATUS.query(sql, (err, stateData,field) => {
                        var state = {};
                        stateData.forEach(e => {
                            state[e.PID] = e.STATE;
                        });
                        ejs.renderFile('./static/StudentPage/studentpageappointment.ejs', { userData: userData[0], cpData: cpData, state: state }, function (err, result) {
                            res.send(result)
                        })
                    })
                })
            }
            else if (userData[0].STATU == 0) {
                let sql = `SELECT * FROM CP_INFORMATION;`
                CP_INFORMATION.query(sql, function (err, cpData,field) {
                    ejs.renderFile('./static/StudentPage/studentpageindexSTATU0.ejs', { userData: userData[0], cpData: cpData }, function (err, result) {
                        res.send(result)
                    })
                })

            }

        })
    } else {
        return res.redirect('/login');
    }
})

router.post('/modify', urlencoded, function (req, res) {
    var sno = req.cookies['id'];
    // console.log(req.body)
    var name = req.body.name;
    var phone = req.body.phone;
    var sgood = req.body.goodAtPro;
    var qq = req.body.qq;
    var newPass = req.body.newPass;
    var sql1 = `UPDATE USERS SET USER_NAME='${name}',PASSWORDS='${newPass}',QQ='${qq}' WHERE USERS.ID IN( 
        SELECT A.ID FROM (
        SELECT ID FROM USERS WHERE STUDENTID='${sno}')
        AS A);`;
    USERS.query(sql1, function (err, mysqlData,field) {
        if (err) {
            // console.log(err)
        }
    })
    var sql2 = `UPDATE STU_INFORMATION SET PHN='${phone}',SGOOD='${sgood}' WHERE  SNO='${sno}';`;
    STU_INFORMATION.query(sql2, function (err, mysqlData,field) {
        if (err) {
            //  console.log(err)
        }
        else{
            res.send('1')
        }
    })

})



router.get('/appointment/success', function (req, res) {
    var SNO = req.cookies['id'];
    var PID = req.query.id;
    var time = moment().format('YYYY-MM-DD h:mm:ss');
    // 取出点击的活动时间
    var sql1 = `SELECT COMTIME FROM CP_INFORMATION WHERE ID=${PID}`;
    var protime = {}
    CP_INFORMATION.query(sql1, function (err, mysqlData1,field) {
        protime = mysqlData1;
        // console.log(protime[0].COMTIME)
        // 此处COMTIME为唯一索引，只能预约一个同一时间的项目
        var sql2 = `SELECT *FROM STU_PRO_STATUS WHERE SNO="${SNO}" AND PROTIME="${protime[0].COMTIME}"`
        STU_PRO_STATUS.query(sql2, (err, data,field) => {
            if (JSON.stringify(data) === '[]') {
                let sql = `INSERT INTO STU_PRO_STATUS(SNO,PID,DATES,PROTIME) VALUES('${SNO}','${PID}','${time}','${protime[0].COMTIME}')`;
                STU_PRO_STATUS.query(sql, (err, result,field) => {
                    if (err) console.log(err)
                    res.send('success')
                })
            } else {
                // 个人觉得这个应该改成返回预约冲突信号，而不是更改，我觉得STATE字段没有必要，更改预约的话直接取消重新预约就好
                // let sql = `UPDATE STU_PRO_STATUS SET STATE=1 WHERE SNO='${SNO}' and PID='${PID}'`;
                // STU_PRO_STATUS.query(sql, (err, result) => {
                //     if (err) console.log(err)
                //     res.send('unsuccess')
                // })
                res.send('unsuccess')
            }

        })
    })




})
router.get('/appointment/unsuccess', function (req, res) {
    var SNO = req.cookies['id'];
    var PID = req.query.id;

    var sql = `DELETE FROM STU_PRO_STATUS WHERE SNO='${SNO}' and PID='${PID}';`;
    STU_PRO_STATUS.query(sql, (err, result,field) => {
        if (err) console.log(err)
        res.send('success')
    })
})

module.exports = router;