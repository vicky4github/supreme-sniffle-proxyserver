const https = require('https');
const express = require('express');
const fs=require("fs")
const bodyParser = require("body-parser");
const path = require("path");

const httpsPORT=443;
const hostname='freightdok.io';
//===================================
// const cert=fs.readFileSync('./certs/cert.crt');
// const ca=fs.readFileSync('./certs/ca.ca-bundle');
// const key=fs.readFileSync('./certs/freightdok.key');
// const httpsOptions = {cert, ca, key};
const app = express();
// const httpsServer = https.createServer(httpsOptions, app);
 app.use((req, res, next) => {
     if(req.protocol === 'http') {
           res.redirect(301, `https://${req.headers.host}${req.url}`);
               }
                   next();
                   });
 app.use(express.static(path.join(__dirname, "build")));
 app.get("/ping", function (req, res) {
             return res.send("pong");
                          });

 app.get("/*", function (req, res) {
   res.sendFile(path.join(__dirname, "build", "index.html"));
       });

//    httpsServer.listen(httpsPORT, hostname);
  app.listen(3000, () => {console.log("==========================FrontEnd Application Running=================3000")})