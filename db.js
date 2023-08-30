
    const express= require('express');
    
    var mysql=require('mysql2');
    require('dotenv').config();


    const dbHost= process.env.MYSQL_HOST;
    const dbUser = process.env.MYSQL_USER;
    const dbPass = process.env.MYSQL_PASSWORD;
    const dbDatabase = process.env.MYSQL_DATABASE

    
    var connection=mysql.createConnection
    ({
        host: dbHost,
        user: dbUser,
        password:dbPass,
        database:dbDatabase,       // 3306 is default port no. of mysql 
     // your db name
    });


    
    
    connection.connect(function(err){
        if(err) throw err;
        console.log('db connected');
    });
    
    
    module.exports = connection;