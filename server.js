var http = require('http');
var path = require('path');
var express = require('express');
var router = express();

var bodyParser = require('body-parser')

var validSession = [];


router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.use('/', express.static(path.join(__dirname, 'client')));

router.post('/login',　function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  
  if (username === 'patrick' && password === 'stufie'){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (validSession.indexOf(ip) === -1){
      validSession.push(ip);
    }
    
    //this is very bad. LOL
    if (validSession.length > 20){
      validSession.pop();
    }
  }
  res.redirect('/home');
})

router.get('/home', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    if (validSession.indexOf(ip) > -1){
      res.sendFile(path.join(__dirname, 'client/home.html'));
    }else{
      res.redirect('/');
    }
});

router.get('/*', function(req, res) {
    res.redirect('/');
});

var server = http.createServer(router);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
