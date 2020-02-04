var Crypto = require('crypto');
const conn = require('../database');
const { createJWTToken } = require('./../helpers/jwt')
const transporter = require('../helpers/emailSender');

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
                    var mailOptions = {
                        from: 'No Reply <mzulfikarmey@gmail.com>',
                        to : email,
                        subject : 'Hola pengguna diendorse',
                        html: `<p><b>Hallo ${fullname}</b></p>
                        <p>Terimakasih telah bergabung menjadi pengguna diendorse</p>
                        <p>klik link dibawah ini untuk memverifikaasi email ini</p>
                        <br><br>
                        <a href="http://localhost:3000/email-verification?email=${email}&&fullname=${fullname}">Klik disini</a>
                        `
                    }

                    transporter.sendMail(mailOptions, (err2, res2) => {
                        if(err2){
                            // res.send({status: 'Error!', message: 'Error sending message'})
                            throw err2;
                        } else {
                            res.send({username, email, role: 'User', status: 'Unverified', token:''})
                        }
                    })
                    res.send({email, role, verified: '0', token:token,fullname})   
                })
               
            }
        })
    },
    updateRoleUser:(req,res) => {
        var {id,email,role} = req.body;
        var sql = `update users set role= "${role}" where id = ${id} and email ="${email}"`;
        conn.query(sql, (err, result) => {
            if(err){
                throw err
            }else{
                res.send({result})   
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
        let { email,password } = req.body;
        console.log(email)
        console.log(password)
        const hashPassword = Crypto.createHmac('sha256', "abcd123")
        .update(password).digest('hex');
        let sql = 'select * from users where email = ? and password = ?;'

        try{
            conn.query(sql,[email,hashPassword],(err,result) => {
                if(err) throw err
                if(result.length == 0){
                    return res.status(200).send({error: true, message: "Email or Password Invalid!"})
                }       
                const token = createJWTToken({email : result[0].email ,fullname : result[0].fullname,role : result[0].role,verified : result[0].verified})
                const data = {
                    email : result[0].email ,fullname : result[0].fullname,role : result[0].role,status : result[0].verified,token
                }
                res.status(200).send({error : false, data:data })
            })
        }catch(err){
            console.log(err.message)
            res.status(409).send({status: "error", message: err.message})            
        }

    },

    verificationEmail: (req,res) => {
        var {email} = req.body;
        var sql = `update users set verified= 1 where email ="${email}"`;
        conn.query(sql, (err, result) => {
            if(err){
                throw err
            }else{
                res.send({result})   
            }
        })
    },
}