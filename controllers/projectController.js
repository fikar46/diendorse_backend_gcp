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
    },
    getAllAdsOnGoing : (req,res) => {
        var sql = `select p.id as id, p.id_user as id_user,p.product_name,p.file as file, p.upload_at as upload_at, 
        location_ads,sex_ads, age_ads, description,estimation_ads, created_ads, status_ads,u.fullname as ads_creator,u.email as email_creator,
        c.name as category_name
        from project_ads p 
        join users u on p.id_user = u.id
        join category_ads c on c.id = p.category where status_ads != 5 order by id desc;`

        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send(result)
        })
    }
}