const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const MysqlControl = require('./mysql').MysqlControl;
const router = express.Router();
router.use('/', express.static('./static/TeacherPage'));
const cookieParser = require('cookie-parser');
const cookieControl = require('./cookie').cookieControl;
const cookiess = new cookieControl()
router.use(cookieParser());
const token = require('./tools/token');
const ejs = require('ejs')
const urlencoded = bodyParser.urlencoded({ extended: false });
const CP_INFORMATION = new MysqlControl('STU_ELE', 'CP_INFORMATION');
const STU_PRO_STATUS = new MysqlControl('STU_ELE', 'STU_PRO_STATUS');
const USERS = new MysqlControl('STU_ELE', 'USERS');

router.use(express.static('./static/TeacherPage'))
router.use(cookieParser());

router.get('/', function (req, res) {
    var tok = req.cookies['token'];
    var id = req.cookies['id'];
    if (tok && id && token.checkToken(tok)) {
        var sql1 = `SELECT *FROM USERS WHERE STATU=0`;
        var mysqlData1;
        USERS.query(sql1, function (err, mysqlData,field) {
            mysqlData1 = mysqlData;
        })

        var sql = `select USER_NAME,STATU from USERS where TOKEN = '${tok}' and STUDENTID = '${id}';`
        USERS.query(sql, function (err, mysqlData,field) {
            if (JSON.stringify(mysqlData) === '[]') {
                return res.redirect('/login');
            }
            if (mysqlData[0].STATU != 2) {
                return res.redirect('/login');
            }
            var sql3 = 'select user_name,class,studentid,statu from users'
            USERS.query(sql3, function (err, mysqlresult,field) {
                ejs.renderFile('./static/TeacherPage/TeacherAdmin.ejs', { teacherName: mysqlData[0].USER_NAME, check: mysqlData1 , mysqlresult:mysqlresult }, function (err, result) {
                    return res.send(result)
                })
            })

        })
    } else {
        return res.redirect('/login');
    }
})
router.get('/check', function (req, res) {
    var tok = req.cookies['token'];
    var id = req.cookies['id'];
    var idd = req.query.id;
    if (tok && id && token.checkToken(tok)) {
        var sql = `UPDATE USERS SET STATU=1 WHERE ID=${idd}`;
        USERS.query(sql, function (err, mysqlData,field) {
            res.redirect('/teacher')
        })
    }

})
router.get('/appoint', function (req, res) {
    var tok = req.cookies['token'];
    var id = req.cookies['id'];
    if (tok && id && token.checkToken(tok)) {
        var sql = `select USER_NAME,STATU from USERS where TOKEN = '${tok}' and STUDENTID = '${id}';`
        USERS.query(sql, function (err, mysqlData,field) {
            if (JSON.stringify(mysqlData) === '[]') {
                return res.redirect('/login');
            }
            if (mysqlData[0].STATU != 2) {
                return res.redirect('/login');
            }
            var sql2 = `select id,comname from CP_INFORMATION`
            CP_INFORMATION.query(sql2, function (err, mysqlData2,field) {
                var sql3 = `select sno,pid,state from stu_pro_status`
                STU_PRO_STATUS.query(sql3, function (err, mysqlData3,field) {
                    ejs.renderFile('./static/TeacherPage/ApoList.ejs', { teacherName: mysqlData[0], iteamlist: mysqlData2, count: mysqlData3 }, function (err, result) {
                        return res.send(result)
                    })
                })

            })

        })
    } else {
        return res.redirect('/login');
    }
})

router.get('/appointlist', function (req, res) {
    var tok = req.cookies['token'];
    var id = req.cookies['id'];
    var comid = req.query.id;
    var obj = { iteam: '' }
    var comsql = `select comname from cp_information where id ='${comid}'`
    CP_INFORMATION.query(comsql, function (err, result,field) {
        obj.iteam = result[0].comname
    })
    if (tok && id && token.checkToken(tok)) {
        var sql = `select USER_NAME,STATU from USERS where TOKEN = '${tok}' and STUDENTID = '${id}';`
        USERS.query(sql, function (err, mysqlData,field) {
            if (JSON.stringify(mysqlData) === '[]') {
                return res.redirect('/login');
            }
            if (mysqlData[0].STATU != 2) {
                return res.redirect('/login');
            }
            var sql2 = `select user_name from users where studentid in (select sno from stu_pro_status where pid = ${comid})`
            USERS.query(sql2, function (err, mysqlData2,field) {
                ejs.renderFile('./static/TeacherPage/details.ejs', { teacherName: mysqlData[0], studentlist: mysqlData2, comname: obj }, function (err, result) {
                    return res.send(result)
                })
            })

        })
    } else {
        return res.redirect('/login');
    }
})

router.get('/publish', function (req, res) {
    var tok = req.cookies['token'];
    var id = req.cookies['id'];
    if (tok && id && token.checkToken(tok)) {
        var sql = `select USER_NAME,STATU from USERS where TOKEN = '${tok}' and STUDENTID = '${id}';`
        USERS.query(sql, function (err, mysqlData,field) {
            if (JSON.stringify(mysqlData) === '[]') {
                return res.redirect('/login');
            }
            if (mysqlData[0].STATU != 2) {
                return res.redirect('/login');
            }
            ejs.renderFile('./static/TeacherPage/Publish.ejs', { teacherName: mysqlData[0] }, function (err, result) {
                return res.send(result)
            })
        })
    } else {
        return res.redirect('/login');
    }
})

router.post('/publish', urlencoded, function (req, res) {
    var title = req.body.title;
    var time = req.body.time;
    var place = req.body.place;
    var content = req.body.content;
    var sql = `INSERT INTO CP_INFORMATION (COMNAME,COMTIME,COMPLACE,COMDES) VALUES ('${title}','${time}','${place}','${content}');`
    CP_INFORMATION.query(sql, function (err, result,field) {
        console.log(result)
        return res.redirect('/teacher/publish');
    })


})

module.exports = router