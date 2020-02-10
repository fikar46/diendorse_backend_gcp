const conn = require('../database');

module.exports = {
    getAllInfluencers : (req,res) => {        
        var locations = req.body.locations ? req.body.locations : []
        var min_followers = req.body.min_followers ? req.body.min_followers : 0
        var min_engagement = req.body.min_engagement ? req.body.min_engagement : 0        
        var min_price = req.body.min_price ? req.body.min_price : 0
        var max_price = req.body.max_price ? req.body.max_price : 0
        var sql = `select * from users u 
        join user_details ud on u.id = ud.id_user where role = 'influencer'`

        if(locations.length > 0 || min_followers > 0 || min_price > 0 || max_price > 0 || min_engagement > 0){
            sql += ' having '
        }

        if(locations.length > 0){
            sql += '('
            locations.forEach((val,index) => {
                if(index !== locations.length -1){
                    sql += ` json_extract(place,'$.kab') LIKE '%${val.toUpperCase()}%' or `
                }else{
                    sql += ` json_extract(place,'$.kab') LIKE '%${val.toUpperCase()}%' `
                }
            })
            sql += ')'
        }

        if(min_price !== 0){
            if(locations.length > 0){
                sql += ' and '
            }
            sql += '('
            sql += `json_extract(price,'$.feed') *1 > ${min_price} `
            sql += ')'
        }

        if(max_price !== 0){
            if(locations.length > 0 || min_price >0){
                sql += ' and '
            }
            sql += '('
            sql += `json_extract(price,'$.feed')*1 < ${max_price} `
            sql += ')'
        }


        if(min_followers !== 0){
            if(locations.length > 0 || min_price >0 || max_price > 0){
                sql += ' and '
            }
            sql += '('
            sql += `followers_ig > ${min_followers} `
            sql += ')'
        }

        if(min_engagement !== 0){
            if(locations.length > 0 || min_price >0 || max_price > 0 || min_followers > 0) {
                sql += ' and '
            }
            sql += '('
            sql += `engagement_ig > ${min_engagement} `
            sql += ')'
        }

        sql += ` order by u.id desc limit ${req.query.limit};`
        console.log(sql)
        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({error : false,data : result})
        })
    }
}
