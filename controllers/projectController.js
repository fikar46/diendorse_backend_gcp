const conn = require('../database');

module.exports = {
    categorAds:(req,res)=>{
        var sql = `select * from category_ads;`;
        conn.query(sql,(err, result) => {
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },
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
        var categories = req.body.categories ? req.body.categories : []
        var locations = req.body.locations ? req.body.locations : []
        var min_price = req.body.min_price ? req.body.min_price : 0
        var max_price = req.body.max_price ? req.body.max_price : 0

        let sql = `select p.id as id,p.id_user as id_user,p.product_name,p.file as file, p.upload_at as upload_at, 
        location_ads,sex_ads, age_ads, description,estimation_ads, created_ads, status_ads,u.fullname as ads_creator,u.email as email_creator,
        c.name as category_name
        from project_ads p 
        join users u on p.id_user = u.id
        join category_ads c on c.id = p.category where status_ads != 5`

        if(categories.length > 0 || locations.length > 0 || min_price > 0 || max_price > 0){
            sql += ' having '
        }

        if(categories.length > 0){
            sql += '('
            categories.forEach((val,index) => {
                if(index !== categories.length-1){
                    sql += ' category_name = "' + val +  '" or ' 
                }else{
                    sql += ' category_name = "' + val +  '" ' 
                }
                
            })
            sql += ')'
        }

        if(locations.length > 0){
            if(categories.length > 0){
                sql += ' and '
            }
            sql += '('
            locations.forEach((val,index) => {
                if(index !== locations.length -1){
                    sql += ` json_extract(location_ads,'$.kab') LIKE '%${val.toUpperCase()}%' or `
                }else{
                    sql += ` json_extract(location_ads,'$.kab') LIKE '%${val.toUpperCase()}%' `
                }
            })
            sql += ')'
        }

        if(min_price !== 0){
            if(locations.length > 0 || categories.length >0){
                sql += ' and '
            }
            sql += '('
            sql += `json_extract(estimation_ads,'$.min') *1 > ${min_price} `
            sql += ')'
        }

        if(max_price !== 0){
            if(locations.length > 0 || categories.length >0 || min_price >0){
                sql += ' and '
            }
            sql += '('
            sql += `json_extract(estimation_ads,'$.max')*1 < ${max_price} `
            sql += ')'
        }

        sql += ` order by id desc limit ${req.query.limit};`

        // console.log(sql)

        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({
                error : false,
                // num_of_datas : result_2[0].jumlah,
                data : result,
            })
        })
    },

    getAllCategoris : (req,res) => {
        var sql = 'select * from category_ads;'
        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({error : false , data: result})
        })
    },
    getAllKabupaten : (req,res) => {
        var sql = 'select * from kabupaten;'
        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({
                error : false,
                data : result
            })
        })
    }
}