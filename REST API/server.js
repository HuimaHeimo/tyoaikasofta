
var express = require('express');
var app=express();
var fs = require('fs');
var bodyParser = require('body-parser');
var controller = require('./controller');
var cookieParser = require('cookie-parser');
const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

let users = {
    userName: "Testi",
    loginTime: Date.now(),
    sessionId: 1234
};



// Määrittelee esimerkiksi ulkoiset tyylitiedostot ja muut tiedostot, joita voi käyttää selaimen kautta.
app.use(express.static(__dirname + '/public'));



//CORS middleware
var allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());




// Staattiset filut
// app.use(express.static('public'));


// REST API tyoaika
app.route('/projects')
    .get(controller.fetchProjects);


app.route('/login')
    .post(controller.login);
   

app.route('/workers')
    .get(controller.fetchWorkers)
    .post(controller.create);

app.route('/times')
    .get(controller.fetchTimes)
    .post(controller.create);

app.route('/Asiakas/:id')
    .put(controller.update)
    .delete(controller.delete);


app.get('/getuser', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies)
});

app.get('/logout', (req, res) => {
    res.clearCookie("userData");
    res.send("Olet kirjautunut ulos")
});

app.get('/userdata', function (request, response) {
    response.send(request.cookies);
});




app.get('/', function (request, response) {

    if (request.cookies.userData == null) {
        response.redirect("/login");
    }
    else {
        fs.readFile("front.html", function (err, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data);
            response.end();
        });
    }
        
    
});

app.get('/login', function (request, response, req) {
    if (request.cookies.userData == null) {
        fs.readFile("login.html", function (err, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(data);
            response.end();
        });
    }
    response.cookie("userData", users);

});

app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});

