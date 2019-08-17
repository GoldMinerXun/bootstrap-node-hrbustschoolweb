const MysqlControl = require('./mysql').MysqlControl;
const USERS = new MysqlControl('STU_ELE', 'USERS');
const token = require('./tools/token');
const CP_INFORMATION = new MysqlControl('STU_ELE', 'CP_INFORMATION');

// let sql = `UPDATE USERS SET STATU = 0 WHERE ID = 30;`
// USERS.query(sql, function (err, mysqlData) {
//     console.log(mysqlData)
// })

