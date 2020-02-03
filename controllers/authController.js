var Crypto = require('crypto');
const conn = require('../database');

module.exports = {
    register: (req,res) => {
        
        var { fullname, username, email, password } = req.body;
       
        var sql = `SELECT username, email FROM users WHERE username='${username}' or email='${email}'`;
        conn.query(sql, (err, result) =>{
             // console.log(Error('Error Auth controller'));
            if(result.length > 0){
                res.status(409).send({status: "error", message: "Username or Email has been taken!"})
            } else {
                const hashPassword = Crypto.createHmac('sha256', "abcd123")
                            .update(password).digest('hex');
                var dataUser = { 
                    username,
                    password: hashPassword,
                    email,
                    fullname,
                    role: 'User'
                }
                sql = `INSERT INTO users SET ?`;
                conn.query(sql, dataUser, (err1, result1) => {
                  res.send({username, email, role: 'User', status: 'Unverified', token:''})   
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
        let { username,password } = req.body
        let sql = 'select * from users where username = ? and password = ?;'

        try{
            conn.query(sql,[username,password],(err,result) => {
                if(err) throw err
                if(result.length == 0){
                    res.status(409).send({status: "error", message: "Username or Email Invalid!"})
                }            
                res.status(200).send({status:"error" , data : result[0]})
            })
        }catch(err){
            res.status(409).send({status: "error", message: err.message})            
        }

    }
}