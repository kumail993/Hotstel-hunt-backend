const express=require('express');
const router=express.Router();
var db=require('./db.js');
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const app = express();

router.route('/register').post((req, res) => {
    // Get params
    console.log(req.body);
    var student_name = req.body.student_name;
    var email = req.body.email;
    var password = req.body.password;


    // Check if the email or name already exists
    var checkExistingQuery = "SELECT * FROM login WHERE email = ?";
    db.query(checkExistingQuery, [email], function (error, existingUsers) {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            if (existingUsers.length > 0) {
                // User with the same email or name already exists
                res.send(JSON.stringify({ success: false, message: 'User with the same email already registered' }));
            } else {
                //here

                //Generating OTP for User Authentication

                const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false,lowerCaseAlphabets: false, specialChars: false });
                console.log(otp);

                //sending OTP to the given Email

                const transporter = nodemailer.createTransport({
                    service: "Gmail", // Use your email service here (e.g., "Gmail", "Outlook")
                    auth: {
                    user: "khaider308@gmail.com",
                    pass: "epjudfftrtdmaukc",
                    },
                });

                const mailOptions = {
                    from: "Khaider308@gmail.com",
                    to: email, // Recipient's email
                    subject: "Your Hostel-hunt Verification Code",
                    //text: `Your OTP code is: ${otp}`,
                    html: `<html>
                    <head>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: white;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                      }
                      .header {
                        color: #0d47a1; /* Dark Blue */
                        font-size: 24px;
                        margin-bottom: 10px;
                        text-align: center;
                      }
                      .info {
                        font-size: 18px;
                        margin-bottom: 20px;
                        text-align: center;
                        color: #333; /* Dark Gray */
                      }
                      .otp {
                        font-weight: bold;
                        font-size: 28px;
                        color: #0d47a1; /* Dark Blue */
                        text-align: center;
                        margin: 20px 0;
                      }
                      .footer {
                        font-size: 14px;
                        margin-top: 20px;
                        color: white;
                        background-color: #0d47a1; /* Dark Blue */
                        padding: 10px;
                        text-align: center;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">Verification Email</div>
                      <div class="info">
                        Hello, ${student_name}!<br>
                        We're delighted to welcome you to our Hostel-hunt community.
                      </div>
                      <div class="otp">${otp}</div>
                      <div class="info">
                        Use the verification code above to complete your registration process. If you haven't initiated this request, kindly disregard this email.
                      </div>
                      <div class="footer">
                        Best regards,<br>
                        The Hostel-hunt Team
                      </div>
                    </div>
                  </body>
                    </html>`



                };


                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                    console.log("Error sending OTP:", error);
                    } else {
                    console.log("OTP email sent:", info.response);
                    }
                });


                // Create query for inserting into login table
                var loginSqlQuery = "INSERT INTO login(email, password, otp, created_at,active_status) VALUES (?, ?, ?, NOW(),0)";

                // Call database to insert into login table
                db.query(loginSqlQuery, [email, password, otp], function (error, loginResult, fields) {
                    if (error) {
                        res.send(JSON.stringify({ success: false, message: error }));
                    } else {
                        // Insert successful, now get the login ID
                        var loginId = loginResult.insertId;
                        console.log(loginId);

                        // Create query for inserting into user table
                        var userSqlQuery = "INSERT INTO student(login_id, student_name,created_at) VALUES (?, ?,NOW())";

                        // Call database to insert into user table
                        db.query(userSqlQuery, [loginId, student_name], function (error, userResult) {
                            if (error) {
                                res.send(JSON.stringify({ success: false, message: error }));
                            } else {
                                // Registration successful
                                res.send(JSON.stringify({ success: true, message: 'register' }));
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports =router;