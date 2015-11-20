var express = require('express');
var app = express(),
        mongoose = require('mongoose'),
        morgan = require('morgan'),
        bodyParser = require('body-parser');
var core = require('./core/config');


var port = process.env.PORT || core.port;


/**
 * node js configuration
 */
mongoose.connect(core.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db is open')
});
app.configure(function() {
  app.use(express.static(__dirname + '/app')); 		// set the static files location /public/img will be /img for users
  app.use(express.logger('dev')); 						// log every request to the console
  app.use(express.bodyParser()); 							// pull information from html in POST
  app.use(express.methodOverride()); 						// simulate DELETE and PUT
});



require('./core/routes.js')(app);



// listen (start app with node server.js)
app.listen(port);
console.log("App listening on port 3000");