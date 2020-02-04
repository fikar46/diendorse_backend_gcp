const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mzulfikarmey@gmail.com',
        pass: 'vvqiyursusvbqgmk'
    }, 
    tls: {
        rejectUnauthorized: false
    }
})
// var transporter = nodemailer.createTransport({
//     host:"www.siapptn.com",
//     port:465,
//     secure:true,
//     auth: {
//         user: 'halo@siapptn.com',
//         pass: 'fikar123'
//     }, 
//     tls: {
//         rejectUnauthorized: false
//     }
// })

module.exports = transporter;