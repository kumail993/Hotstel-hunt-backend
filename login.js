
const express = require('express');
const router = express.Router();
const db = require('./db.js');
const app = express();
require('dotenv').config();

router.route('/login').post((req, res, next) => {
    console.log(req.body);
    var student_email = req.body.student_email;
    var student_password = req.body.student_password;

    var sql = "SELECT * FROM login WHERE email=? AND password=?";

    if (student_email !== "" && student_password !== "") {
        db.query(sql, [student_email, student_password], function(err, data, fields) {
            console.log(student_email);
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: "Internal server error" });
            } else {
                if (data.length > 0) {
                    if (data[0].active_status === 1) {
                        res.status(200).json({ success: true, user: data });
                    } else {
                        res.status(403).json({ success: false, message: 'User not verified' });
                    }
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect email or password' });
                }
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'Email and password required!' });
    }
});

module.exports = router;



// const express=require('express');
// const router=express.Router();
// var db=require('./db.js');
// const app = express();
// require('dotenv').config();



// router.route('/login').post((req,res,next)=>{
//     console.log(req.body);
//     var student_email=req.body.student_email;
//     var student_password=req.body.student_password;

//     var sql="SELECT * FROM login WHERE email=? AND password=?";
    
//     if(student_email != "" && student_password !=""){
//         db.query(sql,[student_email,student_password],function(err,data,fields){
//             if(err){
//                 console.log(err);
//                 res.send(JSON.stringify({success:false,message:err}));

//             }else{
                
//                 if(data.length > 0)
//                 {
                     
//                     res.send(JSON.stringify({success:true,user:data}));
            
//                     next();
                    
//                 }else{
//                     console.log(err);
//                     res.send(JSON.stringify({success:false,message:'Empty Data'}));
                    
//                 }
//             }
//         });
//     }else{
        
//         res.send(JSON.stringify({success:false,message:'Email and password required!'}));
//     }
    
    
// });


// module.exports =router;
