const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/roomtype/:hostelid', (req, res) => {
    let { hostelid } = req.params;
    if (hostelid.startsWith(':')) {
        hostelid = hostelid.substring(1); // Remove the first character (the colon)
    }

    const query = `
        SELECT r.room_type, SUM(r.room_rent) AS total_rent
        FROM rent r
        WHERE r.hostel_id = ?
        GROUP BY r.room_type;
    `;

    db.query(query, [hostelid], (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.status(200).json(result);
    });
});

module.exports = router;
