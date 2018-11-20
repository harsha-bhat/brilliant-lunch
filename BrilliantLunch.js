const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

// Import route files
const User = require('./routes/user');
const Lunch = require('./routes/lunch');

// Create Express app
const app = express();

// Use logging middleware
app.use(logger('dev'));

// Set default headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Plugin body parser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Declare routes
app.use('/api/user', User);
app.use('/api/lunch', Lunch);

// Error handlers
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
};

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Listen on port 5030
app.listen((process.env.PORT || 5030), 
    () => console.log("server running on port " + (process.env.PORT || 5030)));