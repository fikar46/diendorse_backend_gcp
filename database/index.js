const mysql = require('mysql');

const conn = mysql.createPool({
    // host:'localhost',
    user:'root',
    password:'fikar123',
    database:'diendorse',
    // port: 3306,
    socketPath: `/cloudsql/diendorse:asia-southeast1:diendorse`,
});  
module.exports = conn;