var https = require("https");
var httpProxy = require("http-proxy");
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const fs = require('fs')
const app = express();
//Server SSL 
// ========================================================
const cert = fs.readFileSync('./certs/newCerts/cert.crt');
const ca = fs.readFileSync('./certs/newCerts/ca.ca-bundle');
const key = fs.readFileSync('./certs/newCerts/freightdok.key');
const httpsOptions = { cert, ca, key };
// ========================================================


// reverse proxy
var proxy = httpProxy.createProxyServer();

app.use(function (request, response, next) {
    var ip = (request.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         request.socket.remoteAddress
    
    console.log("HTTP Request arrived => From IP Address ",ip,request.headers.host, "= To URL =", request.url)
    if (process.env.NODE_ENV != 'development' && !request.secure) {
        return response.redirect("https://" + request.headers.host + request.url);
    }
    next();
})

https.createServer(httpsOptions, function (req, res) {
    try {
        
        var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.socket.remoteAddress
        
        var target,
            domain = req.headers.host,
            host = domain.split(":")[0];
        if (host === "dev.freightdok.io") {
            if (req.url === "/privacy-policy") {
                target = { host: "localhost", port: "5000", path: "/privacy-policy" }
            }
            target = { host: "localhost", port: "3100" }

        };
        
        if (host === "pulse-dev.freightdok.io") target = { host: "localhost", port: "5698" }
        if (host === "sunnylogistics.co") target = { host: "localhost", port: "9898" }
        if (host === "app-dev.freightdok.io") target = { host: "localhost", port: "3200" }
        if (host === "mail-dev.freightdok.io") target = { host: "localhost", port: "9999" }
        if (host === "api-dev.freightdok.io") target = { host: "localhost", port: "5000" };
        if (host === "go-dev.freightdok.io") target = { host: "localhost", port: "8080" };
        if (host === "dev-babylonian-gate.freightdok.io") target = { host: "localhost", port: "5800" };
	if (host === "dev-cors.freightdok.io") target = { host: "localhost", port: "3432" };    
	  console.log("Request Host Domain Arrived => From IP Address :",ip,"  & HOST => ", host, "Redirecting to Application target =>", target)
        //////////////////

        proxy.web(req, res, {
            target: target
        });
    }

    catch (err) {
        console.log("Couldn't Connect to Target Source :", err.message)
    }
}).listen(443);

app.listen(80, () => { console.log("==========================Hearing HTTP Requests: (http server running) =================") })

