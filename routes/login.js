const express = require('express');
const router = express.Router();
const stringUtils = require("../core/util/StringUtils");
const mysql = require('../core/mysql');
const menu_auth = require("../core/menu_auth");
const common = require("../core/common");
var UUID = require('uuid');

/* GET home page. */
router.get('/', (req, res, next) => {
    const user = req.session && req.session.user;
    if (user) {
        res.redirect("/");
    }
    res.render('login', {title: 'Login', msg: ""});
});
router.get('/exit', (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            console.error("--> session destroy failed.err -> ", err);
        }
    });
    res.redirect("/login");
});
/* POST */
router.post("/", async(req, res, next) => {
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var sql = "select * from user where user_name=? and is_del=0";
    var users = await mysql.query(sql, [username]);
    if (users.length > 0) {
        var user = users[0];
        var salt = user.salt;
        var password2 = stringUtils.createPassword(password.trim()+salt);
        if(user.password != password2) {
            res.status(200).json({error: 1, msg: "Username or password error"});
            return;
        }
        req.session.user = user;
        await menu_auth.setMenus(req, user['id']);
        res.redirect("/");
    } else {
        res.status(200).json({error: 1, msg: "Username or password error"});
    }
});
router.post("/gauth", async(req, res, next) => {
    console.log(req.body)
    var username = req.body.username;
    var name = req.body.name;
    var salt = UUID.v1();
    var sql_user = "select * from user where user_name=? and is_del=0";
    var users = await mysql.query(sql_user, [username]);
    if (users.length == 0) {
        var sql = "insert user (user_name, password,name,mail,tel,sex,birthday,salt) values (?,?,?,?,?,?,?,?)";
        await mysql.query(sql, [username, '', name, username, '', '', '2000-01-01',salt]);
        var user = await  mysql.query(sql_user, username);
        var insert_sql = "insert user_role (user_id, role_id) values (?, 2)";
        await mysql.query(insert_sql, user[0]['id']);
    }
    req.session.user = user;
    await menu_auth.setMenus(req, user[0]['id']);
    res.redirect("/");
});
module.exports = router;
