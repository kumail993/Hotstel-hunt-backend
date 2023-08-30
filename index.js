
const express=require('express');
const app=express();
var bodyParser=require('body-parser');
var db=require('./db.js')

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const RegisterRouter=require('./Register');
const LoginRouter = require('./login');
const HostelFetchRouter = require('./hostel_fetch');
const ReservationRouter = require('./reservation');
const otpverificationRouter = require('./OTP_verification');
const reservationlistRouter = require('./reservation_list');
const RentRouter = require('./fetchrent');


app.use('/Hostel-hunt',RegisterRouter);
app.use('/Hostel-hunt',LoginRouter);
app.use('/Hostel-hunt', HostelFetchRouter);
app.use('/Hostel-hunt',ReservationRouter);
app.use('/Hostel-hunt',otpverificationRouter);
app.use('/Hostel-hunt',reservationlistRouter);
app.use('/Hostel-hunt',RentRouter);


app.listen(3000,()=> console.log('your server is running on port 3000'))

