var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var commonUtil = require('./core/util/commonUtil');
var systemConfig = require(commonUtil.getConfigPath() + "/system_config");
var session = require('express-session');
var menu_auth = require("./core/menu_auth");

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var menus = require('./routes/menus');
var roles = require('./routes/roles');
var events = require('./routes/events');
var user_role = require('./routes/user_role');
var menu_role = require('./routes/menu_role');
var log = require('./core/logger').getLogger("system");
var moment = require('moment');

var app = express();

app.locals.moment = moment;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(log4js.getLogger("express")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var timeout_minute = systemConfig.session_time_out_minute || 120;
app.use(session({
    secret: 'express',
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    if (req.session == undefined) {
        var str = "Can not get session";
        log.error(str);
        res.render("notice", {msg: str});
        return;
    }
    else if (is_login(req)) {
        console.log("@@@@@@@@@@@@@@",req.url);
        if (req.url.indexOf("register") != -1)  {
            console.log("$$$$$$$$$$$", req.method);
            if (req.method != 'POST') {
                res.render("register", {msg: ''});
            }
            next();
        } else {
            res.render("login", {msg: ''});
        }
        return;
    }
    else if (menu_auth.check(req) == false) {
        res.status(401);
        res.render('401', {
            message: "No permission",
            error: {}
        });
        return;
    }
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/menus', menus);
app.use('/roles', roles);
app.use('/events', events);
app.use('/user_role', user_role);
app.use('/menu_role', menu_role);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function is_login(req) {
    if (req.url.indexOf("login") == -1 && !req.session.user) {
        return true;
    }
    return false;
}

module.exports = app;
