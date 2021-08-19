
const conn = require('../database');

var CryptoJS = require("crypto-js");
var queryString = require("querystring");
const Axios = require("axios")
module.exports = {
    getAccountInformation:(req,res)=>{
        var user = req.body.user;
        var amount = req.body.amount;
        var id_project = req.body.id_project
        var responseSuccess = {
            id_user : user.id,
            status:"settlement",
            total_price:amount,
            id_ads:id_project
        }
        var sql = `insert into transactions set ?`;
        conn.query(sql,responseSuccess,(err, result) => {
            // console.log(result)
            if(err){
                // throw err
                console.log(err)
            }else{
                res.send(result)   
            }
        })
        // var headers = {
        //     headers: 
        //     {'Content-Type': 'application/x-www-form-urlencoded'}   
        // }
        // const body = {
        //     client_id:"egEPZthrstPSA3FqKBecL1tTHucN8X80",
        //     client_secret:"8IDluS8eesIO1EMD"
        //   }
          
        //   Axios.post(`https://sandbox.partner.api.bri.co.id/oauth/client_credential/accesstoken?grant_type=client_credentials`,queryString.stringify(body),headers)
        //   .then((data)=>{
        //         var secret_key = "8IDluS8eesIO1EMD";
        //         var timestamp = new Date().toISOString();
        //         var requestPath = "/v1/briva";
        //         var httpMethod = "POST";
        //         var token = data.data.access_token;
        //         var date = new Date();
        //         var expire = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() +1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
        //         var user = req.body.user;
        //         var amount = req.body.amount;
        //         var id_project = req.body.id_project
                
        //         var data = {
        //             "institutionCode": "J104408",
        //             "brivaNo": "77777",
        //             "custCode": `${user.id}00${id_project}`,
        //             "nama": `${user.fullname}`,
        //             "amount": `${amount}`,
        //             "keterangan": "",
        //             "expiredDate": `${expire} 21:00:00`
        //           }
        //         var requestBody = JSON.stringify(data);
        //         var payload = 'path=' + requestPath + '&verb=' + httpMethod +
        //             '&token=Bearer ' + token + '&timestamp=' + timestamp +
        //             '&body=' + requestBody;
                
        //         var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payload, secret_key));
                
        //         var headers2 = {
        //             headers: 
        //             {
        //                 'Content-Type': 'application/json',
        //                 'Authorization':`Bearer ${token}`,
        //                 'BRI-Signature':`${hmacSignature}`,
        //                 'BRI-Timestamp':`${timestamp}`
        //             }   
        //         }
               
        //         Axios.post('https://sandbox.partner.api.bri.co.id/v1/briva',data,headers2)
        //         .then((data1)=>{
        //             var cek = `select * from transactions where id_user = ${user.id} and id_ads = ${id_project}`;
        //             conn.query(cek,(errcek,resultcek)=>{
        //                 // console.log(resultcek)
        //                 if(resultcek ==undefined){
        //                     var responseSuccess = {
        //                         id_user : user.id,
        //                         status:"N",
        //                         total_price:amount,
        //                         id_ads:id_project
        //                     }
        //                     var sql = `insert into transactions set ?`;
        //                     conn.query(sql,responseSuccess,(err, result) => {
        //                         // console.log(result)
        //                         if(err){
        //                             // throw err
        //                             console.log(err)
        //                         }else{
        //                             res.send(result)   
        //                         }
        //                     })
        //                 }else{
        //                     res.send(data1.data)
        //                 }
        //             })
                        

        //         }).catch((err)=>{
        //             // console.log(err.response.data)
        //             // res.send(err.response.data)
        //             // console.log(user,id_project)
        //             var cek = `select * from transactions where id_user = ${user.id} and id_ads = ${id_project}`;
        //             conn.query(cek,(errcek,resultcek)=>{
        //             // console.log(resultcek)   
        //             if(resultcek == undefined){
        //                 var responseSuccess = {
        //                     id_user : user.id,
        //                     status:"n",
        //                     total_price:amount,
        //                     id_ads:id_project
        //                 }
        //                 var sql = `insert into transactions set ?`;
        //                 conn.query(sql,responseSuccess,(err, result) => {
        //                     // console.log(result)
        //                     if(err){
        //                         // throw err
        //                         console.log(err)
        //                     }else{
        //                         res.send(result)   
        //                     }
        //                 })
        //             }else{
        //                 res.send(err.response.data)
        //             }
        //         })
                
        //         })
        //   })
          
        
    },
    getBrivaStatus:(req,res)=>{
        var headers = {
            headers: 
            {'Content-Type': 'application/x-www-form-urlencoded'}   
        }
        const body = {
            client_id:"egEPZthrstPSA3FqKBecL1tTHucN8X80",
            client_secret:"8IDluS8eesIO1EMD"
          }
          
          Axios.post(`https://sandbox.partner.api.bri.co.id/oauth/client_credential/accesstoken?grant_type=client_credentials`,queryString.stringify(body),headers)
          .then((data)=>{
                console.log(data)
                var secret_key = "8IDluS8eesIO1EMD";
                var timestamp = new Date().toISOString();
                var httpMethod = "GET";
                var token = data.data.access_token;
                var user = req.body.user;
                var id_project = req.body.id_project
                var requestPath = `/v1/briva/J104408/77777/${user.id}00${id_project}`;
                
                
                
                var requestBody = '';
                var payload = 'path=' + requestPath + '&verb=' + httpMethod +
                    '&token=Bearer ' + token + '&timestamp=' + timestamp +
                    '&body=' + requestBody;
                console.log(payload)
                var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payload, secret_key));
                
                var headers2 = {
                    headers: 
                    {
                        // 'Content-Type': 'application/json',
                        'Authorization':`Bearer ${token}`,
                        'BRI-Signature':`${hmacSignature}`,
                        'BRI-Timestamp':`${timestamp}`
                    }   
                }
                console.log(user.id,id_project)
               
                Axios.get(`https://sandbox.partner.api.bri.co.id/v1/briva/J104408/77777/${user.id}00${id_project}`,headers2)
                .then((data1)=>{
                    console.log(data1.data)
                    var cek = `update transactions set status =  "${data1.data.data.statusBayar}" where id_user = ${user.id} and id_ads = ${id_project}`;
                    conn.query(cek,(errcek,resultcek)=>{
                        res.send(data1.data.data)
                     })
                    }).catch(
                        (err)=>console.log(err.response.data)
                    )
                        

                })
          
        
    },
    getTransaksiById:(req,res)=>{
        var sql = `select status from transactions  where id_user = ${req.body.id_user} and id_ads = ${req.body.id_project}`;
        conn.query(sql,(err, result) => {
            
            if(result.length>0 || result != undefined){
                if(result[0].status == "Y"){
                    var update = `update project_ads set status_ads = 2 where id_user = ${req.body.id_user} and id = ${req.body.id_project} `
                    conn.query(update,(err,result)=>{
                        if(err){
                            throw err
                        }
                        var update2 = `update bidding set status_bidding = 2 where status_bidding < 2 and id_project_ads = ${req.body.id_project} `
                        conn.query(update2,(err2,result2)=>{
                            if(err2){
                                throw err2
                            }
                            res.send({message:"update"})
                        })    
                    })
                }else{
                    res.send(result)
                }
            }
            // if(err){
            //     // throw err
            //     console.log(err)
            // }else{
            //     res.send(result)   
            // }
        })
    },
    aproveInfuencer:(req,res)=>{
        var update = `update project_ads set status_ads = 5 where id_user = ${req.body.id_user} and id = ${req.body.id_project} `
                    conn.query(update,(err,result)=>{
                        if(err){
                            throw err
                        }
                        res.send(result)    
                    })
    }
}