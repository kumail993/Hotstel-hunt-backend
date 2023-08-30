const express=require('express');
const router=express.Router();
var db=require('./db.js');
const app = express();
require('dotenv').config();



router.route('/otpverification').post((req, res, next) => {
    console.log(req.body);
    var email = req.body.email;
    var otp = req.body.otp;

    db.query('SELECT * FROM login WHERE email = ?', [email], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).json({ message: 'Internal server error' });
        } else if (rows.length > 0) {
            const row = rows[0]; // Get the first row from the array
            if (row.otp === otp) {
                db.query('UPDATE login SET active_status = 1 WHERE email = ?', [email], (err) => {
                    if (err) {
                        console.error('Database update error:', err.message);
                        res.status(500).json({ message: 'Internal server error' });
                    } else {
                        res.json({ message: 'OTP verified and status updated.' });
                    }
                });
            } else {
                res.status(400).json({ message: 'OTP does not match.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    });
});

module.exports = router;