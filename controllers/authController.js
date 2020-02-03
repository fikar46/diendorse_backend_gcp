var Crypto = require('crypto');
const conn = require('../database');
const { createJWTToken } = require('./../helpers/jwt')

module.exports = {
    register: (req,res) => {
        
        var { fullname, email, password,role } = req.body;
       
        var sql = `SELECT email FROM users WHERE email='${email}'`;
        conn.query(sql, (err, result) =>{
             // console.log(Error('Error Auth controller'));
            if(result.length > 0){
                res.status(409).send({status: "error", message: "Email has been taken!"})
            } else {
                const hashPassword = Crypto.createHmac('sha256', "abcd123")
                            .update(password).digest('hex');
                var dataUser = { 
                    password: hashPassword,
                    email,
                    fullname,
                    role
                }
                sql = `INSERT INTO users SET ?`;
                const token = createJWTToken({email,fullname,role,verified : 0})
                conn.query(sql, dataUser, (err1, result1) => {
                    if(err1) throw err1
                    res.send({email, role, verified: '0', token:token,fullname})   
                })
               
            }
        })
    },

    getLengthUser: (req,res) => {
        var sql = `select count(*) as sum from users`
        conn.query(sql, (err, result) => {
            if(err){
                throw err
            }else{
                res.send({result})   
            }
        })
    },

    login : (req,res) => {
        let { username,password } = req.body;
        const hashPassword = Crypto.createHmac('sha256', "abcd123")
        .update(password).digest('hex');
        let sql = 'select * from users where username = ? and password = ?;'

        try{
            conn.query(sql,[username,hashPassword],(err,result) => {
                if(err) throw err
                if(result.length == 0){
                    res.status(409).send({status: "error", message: "Username or Email Invalid!"})
                }       
                const token = createJWTToken({username,email : result[0].email ,fullname : result[0].fullname,role : result[0].role,verified : result[0].verified})
                res.status(200).send({username,email : result[0].email ,fullname : result[0].fullname,role : result[0].role,status : result[0].verified,token})
            })
        }catch(err){
            console.log(err.message)
            res.status(409).send({status: "error", message: err.message})            
        }

    },

    
}