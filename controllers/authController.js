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
                        from: 'No Reply <noreply@siapptn.com>',
                        to : email,
                        subject : 'Hola pengguna diendorse',
                        html: `<p><b>Hallo ${fullname}</b></p>
                        <p>Terimakasih telah bergabung menjadi pengguna diendorse</p>
                        <p>klik link dibawah ini untuk memverifikasi email ini</p>
                        <br><br>
                        <a href="http://localhost:3000/email-verification?email=${email}&&fullname=${fullname}">Klik disini</a>
                        `
                    }

                    transporter.sendMail(mailOptions, (err2, res2) => {
                        if(err2){
                            // res.send({status: 'Error!', message: 'Error sending message'})
                            throw err2;
                        } else {
                            var sql_select  = 'select id,created_at from users where email = ?'
                            conn.query(sql_select,email ,(err,result_3) => {
                                if(err) throw err
                                res.send({fullname, email, role: 'User', status: 'Unverified', token:token , id : result_3[0].id,created_at : result_3[0].created_at})
                            })
                        }
                    })
                    
                    // res.send({email, role, verified: '0', token:token,fullname})   
                })
               
            }
        })
    },
    updateRoleUser:(req,res) => {
        var {id,role} = req.body;
        var sql = `update users set role= "${role}" where id ="${id}"`;
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
                    id:result[0].id,email : result[0].email ,fullname : result[0].fullname,role : result[0].role,status : result[0].verified,token,created_at : result[0].created_at
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

    completeProfile : (req,res) => {

        var data = req.body;
        var id_user = req.params.id_user
        var fullname = req.body.fullname
        delete data.fullname
        if(fullname !== ''){
            console.log('sql 1')
            conn.query('update users set fullname = ? where id = ?;',[fullname,id_user],(err,result) => {
                if(err) throw err
            })
        }


        var sql_select = 'select * from user_details where id_user = ?'
        console.log('sql 2')

        conn.query(sql_select,id_user,(err,result) => {
            if(err) throw err
            if(result.length > 0){
                // EDIT
                console.log('sql 3')

                var sql_edit = 'update user_details set ? where id_user = ?'
                conn.query(sql_edit,[data,id_user],(err,result) => {
                    if(err) throw err
                    res.redirect('/auth/getuserdetail/' + id_user)
                })
            }else{
                console.log('sql 4')
                // ADD
                data.id_user = id_user
                var sql_add = 'insert into user_details set ?'
                conn.query(sql_add,data,(err,result) => {
                    if(err) throw err
                    res.redirect('/auth/getuserdetail/' + id_user)    
                })
            }
        })

    },
    getUserDetail : (req,res) => {
        var user_id = req.params.id_user
        console.log(user_id)
        var sql = 'select * from user_details where id_user = ?'
        let data ={}
        conn.query(sql,user_id,(err,result) => {
            if(err) throw err
            if(result.length >0){
                console.log(result.length)
                // if(result.length > 0){
                    data = result
                    console.log('masuk')
                    var sql = 'select fullname from users where id = ?'
                    conn.query(sql,user_id,(err,result_2) => {
                        if(err) throw err
                        console.log(result_2[0].fullname)
                        if(data.length > 0){
                            data = data[0]
                            console.log('masuk')
                            console.log(data)
                            data.fullname = result_2[0].fullname
                            console.log(data)
                            res.send({
                                error : false,
                                data : data
                            })
                        }else{
                            res.send({
                                error : false,
                                data : {fullname : result_2[0].fullname}
                            })
                        }
                        
                    })
            }else{
                res.send({
                    error : true,
                    data : {message:"data belum ada"}
                })
            }
        })
    },
    getAllKabupaten : (req,res) => {
        var sql = 'select * from kabupaten;'
        conn.query(sql,(err,result) => {
            // console.log('masuk')
            if(err) throw err
            res.send({error : false,data: result})
        })
    },

    changePassword : (req,res) => {
        var oldPassword = req.body.old
        var newPassword = req.body.new
        var id_user = req.body.id_user

        const hashPassword = Crypto.createHmac('sha256', "abcd123")
                            .update(oldPassword).digest('hex');

        const hashPasswordNew = Crypto.createHmac('sha256', "abcd123")
                            .update(newPassword).digest('hex');

        var sql = 'select * from users where id = ? and password = ?;'
        conn.query(sql,[id_user,hashPassword],(err,result) => {
            if(err) throw err
            if(result.length > 0){
                var sql = 'update users set ? where id = ?;'
                conn.query(sql,[{password : hashPasswordNew}, id_user],(err,result) => {
                    res.send({error : false,message : 'Password Updated'})
                })
            }else{
                res.send({error : true,message : 'Password Invalid'})
            }
        })
    },
    getUserById : (req,res) => {
        var sql = `select * from users u 
        join user_details ud on u.id = ud.id_user where u.id = ${req.params.id};`

        conn.query(sql,(err,result) => {
            if(err) throw err
            res.send({error : false,data : result})
        })
    }
}