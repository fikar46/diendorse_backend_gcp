var Crypto = require('crypto');
const conn = require('../database');
const { createJWTToken } = require('./../helpers/jwt')

module.exports = {
    createAds:(req,res) => {
        var data = req.body;
        var sql = `insert into project_ads set ?`;
        conn.query(sql, data,(err, result) => {
            if(err){
                throw err
            }else{
                res.send({result})   
            }
        })
    },
}