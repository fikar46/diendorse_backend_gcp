const mysql = require('mysql');

const conn = mysql.createPool({
    // localhost aktif ketika menggunakan cara proxy selain unix
    host:'localhost', 
    user:'root',
    password:'fikar123',
    database:'diendorse',
    // port aktif ketika menggunakan cara proxy selain unix
    port: 3308,
    socketPath: `/cloudsql/diendorse:asia-southeast1:diendorse`,
});  
module.exports = conn;