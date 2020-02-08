const conn = require('../database');

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
    getAdsOngoing:(req,res)=>{
        var sql =`SELECT * from project_ads WHERE status_ads != 5 and id_user= ${req.params.id_user} order by id desc limit 3;`
        conn.query(sql,(err, result) => {
            // console.log(result)
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },
    getAdsHistory:(req,res)=>{
        var sql =`SELECT * from project_ads WHERE status_ads = 5 and id_user= ${req.params.id_user} order by id desc limit 3;`
        conn.query(sql,(err, result) => {
            // console.log(result)
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    }
}