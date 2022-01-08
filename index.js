var https = require("https");
var httpProxy = require("http-proxy");
const express = require('express');
const fs=require('fs')
const app = express();
//Server SSL 
// ========================================================
const cert=fs.readFileSync('./certs/cert.crt');
const ca=fs.readFileSync('./certs/ca.ca-bundle');
const key=fs.readFileSync('./certs/freightdok.key');
const httpsOptions = {cert, ca, key};
// ========================================================

// reverse proxy
var proxy = httpProxy.createProxyServer();

app.use(function(request, response, next) {
    console.log("HTTP Request arrived => ",request.headers.host,"= To URL =", request.url)
    if (process.env.NODE_ENV != 'development' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})

https.createServer(httpsOptions,function (req, res) {
   try{ var target,
        domain = req.headers.host,
        host = domain.split(":")[0];
                
    ////////////////// (or create your own more fancy version! you can use regex, wildcards, whatever...)
    // if (host === "localhost") target = {host: "localhost", port: "2000"};
    if (host === "freightdok.io") target = {host: "localhost", port: "3000"};
    if (host === "api.freightdok.io") target = {host: "localhost", port: "4000"};
    
    console.log("Request Host Domain Arrived => ",host,"Redirecting to Application target =>",target)  
    //////////////////

        proxy.web(req, res, {
            target: target
        });
    }

    catch(err){
        console.log("Couldn't Connect to Target Source :",err.message)
    }
}).listen(443);

app.listen(80, () => {console.log("==========================Hearing HTTP Requests: (http server running) =================")})