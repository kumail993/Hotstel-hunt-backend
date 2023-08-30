
const express=require('express');
const router=express.Router();
var db=require('./db.js');
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const app = express();

router.route('/premiumhostels').get((req, res) => {
    const query = 'SELECT * FROM hostels WHERE Category = "premium";';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.status(200).json(result);
    });
  });



  router.route('/ratedhostels').get((req, res) => {
    const query = 'SELECT * FROM hostels WHERE Category = "rated";';
  
    db.query(query, (err, result) => {
      
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
    //   const hostelIds = result.map(hostel => hostel.id);

    //     res.status(200).json({ hostelIds })
  
      res.status(200).json(result);
    });
  });


  router.route('/Allhostels').get((req, res) => {
    const query = 'SELECT * FROM hostels ';
  
    db.query(query, (err, result) => {
      
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
    //   const hostelIds = result.map(hostel => hostel.id);

    //     res.status(200).json({ hostelIds })
  
      res.status(200).json(result);
    });
  });

  module.exports =router;