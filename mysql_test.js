const mysql = require('mysql');
const moment = require('moment');

var pool = mysql.createPool({
    host: '129.204.195.199',
    user: 'root',
    password: 'root',
    database: 'stu_ele'
});

var query=function(sql,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });
        }
    });
};
var sql='select *from users';
query(sql,function(err,mysqlData,fields){
    if(err){
        console.log(err)
    }
    else{
        console.log('mysqldata',mysqlData)
        // console.log('fields',fields)
    }

})
module.exports=query;

