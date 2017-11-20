var express = require('express');
var randomInt = require('./randomNumber');
var ejs = require('ejs');
var fs  = require('fs');
var app = express();
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');

app.use(logger('dev'));
var publicPath  = path.resolve(__dirname,'public');
app.use(express.static(publicPath));
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

//use middleware
app.use(function(req, res, next){
  console.log('incomming url : ', req.url);
  if(req.url === '/404'){
  	res.status(404).send('404 page not found...');
  }
  next();
});

var entries = [];
app.locals.entries = entries;

app.get('/', function(req, res){	      
	      res.render('index',{no:randomInt(),second:randomInt(),message:'welcome to ejs'});
});

app.use('/new-entry', function(req, res){
          res.render('new-entry');
});

app.post('/new-entry', function(req, res){
	if(!req.body.title || req.body.body){
		res.status(400).send('Entries must have title and body');
		return;
	}
   
   entries.push({
   	 title : req.body.title,
   	 body : req.body.body,
   	 published : new Date()
   });
   res.redirect('/');
});
app.get('/user/:id', function(req, res){
   res.send('id is :'+req.ip);
});
app.listen(8000, () => {
	 console.log(`app is running at port : 3000`);
});