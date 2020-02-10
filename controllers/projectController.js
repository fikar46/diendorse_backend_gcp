const conn = require('../database');
var {uploader} = require('../helpers/uploader')
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
    getAdsOngoingAll:(req,res)=>{
        var sql =`SELECT * from project_ads WHERE status_ads != 5 and id_user= ${req.params.id_user} order by id desc;`
        conn.query(sql,(err, result) => {
            // console.log(result)
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },
    getAdsOngoingDetail:(req,res)=>{
        var sql =`SELECT * from project_ads p
        left join category_ads c on c.id = p.category
        WHERE p.id = ${req.body.id_project} and p.id_user= ${req.body.id_user};`
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
        var sql =`SELECT * from project_ads WHERE status_ads = 5 and id_user= ${req.params.id_user} order by created_ads desc limit 3;`
        conn.query(sql,(err, result) => {
            // console.log(result)
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },
    getAdsHistoryAll:(req,res)=>{
        var sql =`SELECT * from project_ads WHERE status_ads = 5 and id_user= ${req.params.id_user} order by created_ads desc;`
        conn.query(sql,(err, result) => {
            // console.log(result)
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },
    uploadFile: (req,res) => {
        try {
            const path = '/file/ads'; //file save path
            const upload = uploader(path, 'ADS').fields([{ name: 'file'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload file failed !', error: err.message });
                }
    
                const { file } = req.files;
                // console.log(file)
                // const imagePath = file ? path + '/' + file[0].filename : null;
                // console.log(imagePath)
                res.send(file)    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    getAllAdsOnGoing : (req,res) => {
        var categories = req.body.categories ? req.body.categories : []
        var locations = req.body.locations ? req.body.locations : []
        var min_price = req.body.min_price ? req.body.min_price : 0
        var max_price = req.body.max_price ? req.body.max_price : 0

        let sql = `select p.id as id,p.id_user as id_user,p.product_name,p.file as file, p.upload_at as upload_at, 
        location_ads,sex_ads, age_ads,p.days as days, description,estimation_ads, created_ads, status_ads,u.fullname as ads_creator,u.email as email_creator,
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
    },

    getAdsById : (req,res) => {
        var sql = `select p.id as id,p.id_user as id_user,p.product_name,p.file as file, p.upload_at as upload_at, 
        location_ads,sex_ads, age_ads,p.days as days, description,estimation_ads, created_ads, status_ads,u.fullname as ads_creator,u.email as email_creator,
        c.name as category_name
        from project_ads p 
        join users u on p.id_user = u.id
        join category_ads c on c.id = p.category where p.id= ${req.params.id}`

        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({
                error : false,
                data : result[0]
            })
        })

    },
    bidNow:(req,res)=>{
        var data = req.body;
        var cek = `select * from bidding where id_user = ${req.body.id_user} and id_project_ads = ${req.body.id_project_ads}`;
        conn.query(cek,(errCek,resultCek)=>{
            if(resultCek.length>0){
                res.status(409).send({status: "error", message: "You have done bidding on this project"})
            }else{
                var sql = `insert into bidding set ?`
                conn.query(sql,data,(err, result) => {
                    if(err){
                        throw err
                    }else{
                        res.send(result)   
                    }
                })
            }
        })
    },
    getOnBiddingByid:(req,res)=>{
        var sql = `SELECT p.id,p.product_name,b.status_bidding,u.email,u.fullname, b.createdAt from project_ads p 
        JOIN bidding b on b.id_project_ads = p.id
        join users u on p.id_user = u.id
        WHERE b.id_user = ${req.params.id_user} order by b.id desc;`
        conn.query(sql,(err, result) => {
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },
    getDataUsersBidding:(req,res)=>{
        var sql = `SELECT b.id_user as id_user ,b.id as id_biding,b.price as price, u.fullname,ud.username_ig,ud.followers_ig,ud.engagement_ig,ud.place from bidding b 
        join users u on u.id = b.id_user
        left join user_details ud on ud.id_user = u.id
        WHERE b.id_project_ads =${req.params.id_ads} and b.status_bidding =0 ORDER by b.id DESC;`
        conn.query(sql,(err, result) => {
            if(err){
                throw err
            }else{
                res.send(result)   
            }
        })
    },

    getDataBiddingByIdProject : (req,res) => {
        var sql = `SELECT b.id_user as id_user, u.email as email, b.id as id_biding,b.price as price, u.fullname,ud.username_ig,ud.followers_ig,ud.engagement_ig,ud.place from bidding b 
        join users u on u.id = b.id_user
        left join user_details ud on ud.id_user = u.id
        WHERE b.id_project_ads =${req.params.id_ads} ORDER by b.id DESC;`

        conn.query(sql , (err,result) => {
            if(err) throw err
            res.send({error : false,data : result})
        })
    },

    updateAdsStatus : (req,res) => {
        let id = req.body.id
        let status = req.body.status

        var sql = 'update bidding set status_bidding = ? where id = ?;'
        conn.query(sql,[status,id] , (err,result) => {
            if(err) throw err
            res.send({error : false,message : 'Status Updated'})
        })
    },

    getDataBidingWithStatusAndIdAds : (req,res) => {
        let id_ads = req.body.id_ads
        let status = req.body.status

        var sql = `SELECT b.id_user as id_user, b.id as id_biding,b.price as price, u.fullname,ud.username_ig,ud.followers_ig,ud.engagement_ig,ud.place from bidding b 
        join users u on u.id = b.id_user
        left join user_details ud on ud.id_user = u.id
        WHERE b.id_project_ads =${id_ads} and b.status_bidding =${status} ORDER by b.id DESC;`

        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({error : false,data : result})
        })

    },
    getAllBids : (req,res) => {
        var sql = 'select * from bidding;'
        conn.query(sql,(err,result) =>{
            if(err) throw err
            res.send({error : false,data: result})
        })
    }
}


