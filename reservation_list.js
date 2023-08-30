const express = require('express');
const router = express.Router();
var db = require('./db.js');

const app = express();

router.route('/reservations/:loginId').get((req, res) => {
  console.log(req.params);
  var { loginId } = req.params;
  console.log('Received loginId:', loginId);

  if (loginId.startsWith(':')) {
    loginId = loginId.substring(1); // Remove the first character (the colon)
  }
  console.log(loginId);

  var query = "SELECT * FROM reservations WHERE login_id = ?";

  db.query(query, [loginId], (err, reservations)=> {
    if (err) {
      console.error('Error fetching reservation data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (reservations.length === 0) {
      res.status(404).json({ message: 'No reservations found for the provided LoginId' });
      return;
    }

    const responsePromises = reservations.map(reservation => {
      const hostelId = reservation.hostel_id; // Assuming the reservations have a hostel_id column
      const hostelQuery = 'SELECT hostel_name FROM hostels WHERE hostel_id = ?';

      return new Promise((resolve, reject) => {
        db.query(hostelQuery, [hostelId], (err, hostelDetails) => {
          if (err) {
            reject(err);
            return;
          }

          if (hostelDetails.length === 0) {
            // Hostel details not found, resolve with an empty object
            resolve({});
          } else {
            
            const hostelName = hostelDetails[0].hostel_name;
            resolve({ ...reservation, hostel_name: hostelName });
          }
        });
      });
    });

    Promise.all(responsePromises)
      .then(responseData => {
        console.log('hello');
        res.status(200).json(responseData);
      })
      .catch(error => {
        console.error('Error fetching hostel details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });
});

module.exports = router;