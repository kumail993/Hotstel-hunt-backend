
const express=require('express');
const router=express.Router();
var db=require('./db.js');
const nodemailer = require("nodemailer");

const app = express();

router.route('/reservation').post((req, res) => {
    console.log(req.body);
    const Hostel_id = req.body.Hostel_id;
    const reservation_name = req.body.reservation_name;
    const reservation_email = req.body.reservation_email;
    const reservation_phone = req.body.reservation_phone;
    const type = req.body.type;
    const login = req.body.login_id;
    const sql = 'INSERT INTO reservations ( name, email, ph_no, type, created_at,Hostel_id, login_id) VALUES (?, ?, ?, ?,NOW(),?,?)';
    const values = [ reservation_name, reservation_email, reservation_phone, type,Hostel_id,login];
    db.query(sql, values, (error, result) => {
        if (error) {
            res.send(JSON.stringify({ success: false, message: error }));
        } else {
            // Registration successful

            const query = 'SELECT hostel_name FROM hostels WHERE hostel_id = ?';

            db.query(query, [Hostel_id], (error, results, fields) => {
                if (error) {
                  console.error('Error fetching data:', error);
                  return;
                }
              
                if (results.length === 0) {
                  console.log('No hostel found for the provided ID.');
                } else {
                  const hostelName = results[0].hostel_name;
                  //console.log('Hostel Name:', hostelName);
        

            const transporter = nodemailer.createTransport({
                service: "Gmail", // Use your email service here (e.g., "Gmail", "Outlook")
                auth: {
                user: "khaider308@gmail.com",
                pass: "epjudfftrtdmaukc",
                },
            });

            const mailOptions = {
                from: "Khaider308@gmail.com",
                to: reservation_email, // Recipient's email
                subject: "Your Hostel-hunt Reservation Has Been Done",
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
                    text-align: left;
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
                  <div class="header">Reservation Email</div>
                  <div class="info">
                    Hello, ${reservation_name}!<br>
                    We are thrilled to inform you that your reservation has been successfully confirmed. We appreciate your choice to book with us and look forward to providing you with an exceptional experience..
                  </div>
                  <div class="info">
                     Name: ${reservation_name}<br>
                     Email: ${reservation_email}<br>
                     Phone No: ${reservation_phone}<br>
                     Hostel Name: ${hostelName}<br>
                     Room type: ${type} Seater<br>
                    
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
        }
        });

            res.send(JSON.stringify({ success: true, message: 'Reservation Successfuly' }));
        }
    });
    
  });



module.exports =router;