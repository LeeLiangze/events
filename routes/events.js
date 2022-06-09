const express = require('express');
const mysql = require('../core/mysql');
const log = require('../core/logger').getLogger("system");
const router = express.Router();
const _ = require('lodash');
const common = require('../core/common');
var moment = require("moment");

/* Events Page */
router.get('/', (req, res, next) => {
    res.render('events', {
        user: req.session.user,
        menus: req.session.menus,
        menu_active: req.session.menu_active['/events'] || {},
        title: 'Events',
        router: '/events'
    });
});
router.get('/load', async(req, res, next) => {
    var sqlcount = "select count(*) count from events";
    var sql = "select * from events";

    var start = req.query.start;
    var length = req.query.length;
    var draw = req.query.draw;
    if (!start || !draw || !length) {
        res.status(401).json("invoke error!");
        return;
    }

    start = parseInt(start) || 0;
    length = parseInt(length) || 0;
    draw = parseInt(draw) || 0;

    var search = req.query.search;
    if (search) {
        // sqlcount = sqlcount + " and title like '" + search.value + "%'";
        // sql = sql + " and title like '" + search.value + "%'";
    }

    console.log(sqlcount);
    var memuCount = await mysql.query(sqlcount);
    sql = sql + " ORDER BY id DESC limit " + start + "," + length;
    var result = await mysql.query(sql);
    var backResult = {
        draw: draw,
        recordsTotal: memuCount['0']['count'],
        recordsFiltered: memuCount['0']['count'],
        data: []
    };
    for (var i in result) {
        backResult.data.push({
            id: result[i].id,
            is: result[i].id + "_",
            user_id: result[i].user_id,
            title: result[i].title,
            description: result[i].description,
            start: moment(result[i].start_dt).format("YYYY-MM-DD HH:mm:ss"),
            end: moment(result[i].end_dt).format("YYYY-MM-DD HH:mm:ss")
        });
    }
    res.status(200).json(backResult);
});
router.get('/save', async(req, res, next) => {
    var result = {
        error: 0,
        msg: ""
    };
    try {
        var user = req.session.user;
        log.info("events save params: ", req.query);
        var e_id = req.query.e_id;
        var title = req.query.title;
        var description = req.query.description;
        var start_dt = req.query.start_dt;
        var end_dt = req.query.end_dt
        if (title == "" || title.trim() == "") {
            result.msg = "Title can not empty";
        }
        if (result.msg != "") {
            result.error = 1;
        } else {
            var ret, sql;
            if (e_id) {
                sql = "update events set title=?,description=?, start_dt=?, end_dt=? where id=?";
                var params = [title, description, start_dt, end_dt, e_id];
                ret = await mysql.query(sql, params);
            } else {
                sql = "insert events (user_id, title, description,start_dt,end_dt) values (?,?,?,?,?)";
                ret = await mysql.query(sql, [user.id, title, description, start_dt, end_dt]);
                sql = "insert event_attendance (user_id, event_id) values (?,?)";
                ret = await mysql.query(sql, [user.id, ret.insertId]);
            }
            log.info("save events ret: ", ret);
        }
        res.status(200).json(result);
    } catch (e) {
        log.error("save event ret:", e);
        result.error = 1;
        result.msg = "Save error";
        res.status(200).json(result);
    }
});
router.delete('/delete', async(req, res, next) => {
    var result = {
        error: 0,
        msg: ""
    };

    try {
        var ids = req.body.ids;
        if (ids && ids.trim() != "") {
            var sql = 'delete from events where id = ?';
            await mysql.query(sql, [ids]);
        } else {
            result.error = 1;
            result.msg = "Delete error";
        }
    } catch (e) {
        log.error("delete role ret:", e);
        result.error = 1;
        result.msg = "Delete error";
    }
    res.status(200).json(result);
});

/* Home page */
router.get('/home', (req, res, next) => {
    res.render('home', {
        user: req.session.user,
        menus: req.session.menus,
        menu_active: req.session.menu_active['/events/home'] || {},
        title: 'Home',
        router: '/events/home'
    });
});
router.get('/home/attendance', async(req, res, next) => {
    var result = {
        error: 0,
        msg: ""
    };
    var user = req.session.user;
    var user_id = user.id;
    var event_id = req.query.id;
    var sql_user = "select * from event_attendance where user_id=? and event_id=?";
    var users = await mysql.query(sql_user, [user_id,event_id]);
    if (users.length == 0) {
        var sql = "insert event_attendance (user_id, event_id) values (?,?)";
        await mysql.query(sql, [user_id, event_id]);
        res.status(200).json(result);
    } else {
        res.status(200).json({error: 1, msg: "Already participated"});
        return;
    }
});

/* My page */
router.get('/my', (req, res, next) => {
    console.log("$$$$$$$$$$$$", req.session.menu_active[''])
    res.render('my', {
        user: req.session.user,
        menus: req.session.menus,
        menu_active: req.session.menu_active['/events/my'] || {},
        title: 'My Events',
        router: '/events/my'
    });
});
router.get('/my/load', async(req, res, next) => {
    var user_id = req.session.user.id;
    var sqlcount = "select count(*) count from events where user_id = ?";
    var sql = "select * from events where user_id = ?";

    var start = req.query.start;
    var length = req.query.length;
    var draw = req.query.draw;
    if (!start || !draw || !length) {
        res.status(401).json("invoke error!");
        return;
    }

    start = parseInt(start) || 0;
    length = parseInt(length) || 0;
    draw = parseInt(draw) || 0;

    var search = req.query.search;
    if (search) {
        // sqlcount = sqlcount + " and title like '" + search.value + "%'";
        // sql = sql + " and title like '" + search.value + "%'";
    }

    console.log(sqlcount);
    var memuCount = await mysql.query(sqlcount,[user_id]);
    sql = sql + " ORDER BY id DESC limit " + start + "," + length;
    var result = await mysql.query(sql,[user_id]);
    var backResult = {
        draw: draw,
        recordsTotal: memuCount['0']['count'],
        recordsFiltered: memuCount['0']['count'],
        data: []
    };
    for (var i in result) {
        backResult.data.push({
            id: result[i].id,
            is: result[i].id + "_",
            user_id: result[i].user_id,
            title: result[i].title,
            description: result[i].description,
            start: moment(result[i].start_dt).format("YYYY-MM-DD HH:mm:ss"),
            end: moment(result[i].end_dt).format("YYYY-MM-DD HH:mm:ss")
        });
    }
    res.status(200).json(backResult);
});
module.exports = router;
