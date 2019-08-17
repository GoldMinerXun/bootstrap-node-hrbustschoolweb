const mysql = require('mysql');
const moment = require('moment');
var pool = mysql.createPool({
    host: '129.204.195.199',
    user: 'root',
    password: 'root',
    database: 'stu_ele'
});

class Client {
    constructor(dbName, collName) {
        this.dbName = dbName;
        this.collName = collName;
    }
    query(sql, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, function (qerr, vals, fields) {
                    conn.release();
                    callback(qerr, vals, fields);
                });
            }
        });
    }
}
const USERS = new Client('STU_ELE', 'USERS');
var sql = 'select *from users';
USERS.query(sql,function(err,mysqlData,field){
    if(err){
        console.log(err)
    }
    else{
        console.log('mysqldata',mysqlData)
        // console.log('fields',fields)
    }
})
exports.MysqlControl = Client