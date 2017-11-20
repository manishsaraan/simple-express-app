var express = require('express');
var randomInt = require('./randomNumber');
var ejs = require('ejs');
var fs  = require('fs');
var app = express();
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');

app.use(logger('dev'));
var publicPath  = path.resolve(__dirname,'public');
app.use(express.static(publicPath));
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

var entries = [];
app.locals.entries = entries;

//routes starts here
app.get('/', function(req, res){                 
	      res.render('index');
});

app.post('/edit/:id', function(req, res){
	if(!req.body.title || !req.body.body){
		res.status(400).send('Entries must have title and body');
		return;
	}
	_.each(app.locals.entries, (val) => {
          if(val.id === req.params.id){
          	 val.title = req.body.title,
          	 val.body = req.body.body
          }
	});
	res.render('index');
});

app.get('/edit/:id', function(req, res){
	var data = _.filter(app.locals.entries, (val) => {
		return val.id === req.params.id;         
	});
	if(data.length === 0){
		res.status(400).render('404');
	}
	res.render('edit',{data : data[0]});
});

app.get('/new-entry', function(req, res){
          res.render('new-entry');
});

app.post('/new-entry', function(req, res){	
	if(!req.body.title || !req.body.body){
		res.status(400).send('Entries must have title and body');
		return;
	}
   
   entries.push({
   	 id : uuidv1(),
   	 title : req.body.title,
   	 body : req.body.body,
   	 published : new Date()
   });
   res.redirect('/');
});

app.get('/user/:id', function(req, res){
   res.send('id is :'+req.ip);
});

//middleware
app.use(function(request, response) {
    response.status(404).render("404");
});

app.listen(3000, () => {
	 console.log(`app is running at port : 3000`);
});