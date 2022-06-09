const express = require('express');
const router = express.Router();
const stringUtils = require("../core/util/StringUtils");
const mysql = require('../core/mysql');
const menu_auth = require("../core/menu_auth");
const common = require("../core/common");
const log = require('../core/logger').getLogger("system");
var UUID = require('uuid');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('register', {title: 'Register', msg: ""});
});
/* POST */
router.post("/", async(req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var phone = req.body.phone;
    var email = req.body.email;
    var salt = UUID.v1();
    var sql_user = "select * from user where user_name=? and is_del=0";
    var users = await mysql.query(sql_user, username);
    if (users.length > 0) {
        res.status(200).json({error: 1, msg: "Username exists"});
        return;
    }
    var sql = "insert user (user_name, password,name,mail,tel,sex,birthday,salt) values (?,?,?,?,?,?,?,?)";
    password = stringUtils.createPassword(password.trim()+salt);
    await mysql.query(sql, [username, password, name, email, phone, sex, birthday, salt]);
    var user = await  mysql.query(sql_user, username);
    var insert_sql = "insert user_role (user_id, role_id) values (?, 2)";
    await mysql.query(insert_sql, user[0]['id']);
    req.session.user = user[0];
    await menu_auth.setMenus(req, user[0]['id']);
    res.redirect("/");
});

module.exports = router;
