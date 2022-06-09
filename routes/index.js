const express = require('express');
const os=require('os');
const log = require('../core/logger').getLogger("system");
const mysql = require('../core/mysql');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        user: req.session.user,
        menus: req.session.menus,
        menu_active: req.session.menu_active['/'] || {},
        title: 'Home'
    });
});
router.get('/welcome', async function (req, res, next) {

    var sql = "select count(1) total from events";
    var count_events = await mysql.query(sql);

    res.render('content', {
        user: req.session.user,
        menus: req.session.menus,
        count_events: count_events[0],
        menu_active: req.session.menu_active['/'] || {},
        title: 'Home'
    });
});
router.get('/sidebar', function (req, res, next) {
    var result = {
        error: 0,
        data: req.session.menus2
    };
    res.status(200).json(result);
});

module.exports = router;
