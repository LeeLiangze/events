const express = require('express');
const mysql = require('../core/mysql');
const perm = require('../core/permissions');
const router = express.Router();
const log = require('../core/logger').getLogger("system");
const moment = require('moment');
const stringUtils = require('../core/util/StringUtils');
const _ = require('lodash');
var UUID = require('uuid');
/* GET users listing. */
router.get('/', async (req, res, next) => {
    let user = req.session.user;
    let menu_active = req.session.menu_active['/users'] || {};
    let permissions = await perm.getPermissions(req);
    res.render('user', {
        user: user,
        menus: req.session.menus,
        menu_active: menu_active,
        permissions: permissions,
        title: 'Users'
    });
});
router.get('/load', async(req, res, next) => {
    try {
        var sqlcount = "select count(*) count from user where is_del=0 ";
        var sql = "select * from user where is_del=0 ";

        var s_name = req.query.s_name;
        var s_user_name = req.query.s_user_name;

        if (s_name) {
            sqlcount = sqlcount + " and name like '%" + s_name.trim() + "%'";
            sql = sql + " and name like '%" + s_name.trim() + "%'";
        }
        if (s_user_name) {
            sqlcount = sqlcount + " and user_name like '%" + s_user_name.trim() + "%'";
            sql = sql + " and user_name like '%" + s_user_name.trim() + "%'";
        }
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
                user_name: result[i].user_name,
                name: result[i].name,
                mail: result[i].mail,
                phone: result[i].tel,
                created_at: result[i].created_at ? moment(result[i].created_at).format("YYYY-MM-DD HH:mm:ss") : "",
                modified_at: result[i].modified_at != "0000-00-00 00:00:00" ? moment(result[i].modified_at).format("YYYY-MM-DD HH:mm:ss") : "",
                sex: result[i].sex == "1" ? "Male" : "Female",
                birthday: result[i].birthday ? moment(result[i].birthday).format("YYYY-MM-DD") : ""
            });
        }
        res.status(200).json(backResult);
    } catch (e) {
        log.error("e");
        res.status(500).json({error: 1, msg: 'Server Error'});
    }
});

router.get('/save', async(req, res, next) => {
    var result = {
        error: 0,
        msg: ""
    };
    try {
        var user = req.session.user;
        log.info("user save params: ", req.query);
        var e_id = req.query.e_id;
        var e_user_name = req.query.e_user_name;
        var e_name = req.query.e_name;
        var e_phone = req.query.e_phone;
        var e_sex = req.query.e_sex;
        var e_birthday = req.query.e_birthday;
        var e_mail = req.query.e_mail;
        var e_password = req.query.e_password;
        if (e_user_name == "" || e_user_name.trim() == "") {
            result.msg = "Username can not empty";
        } else if (e_name == "" || e_name.trim() == "") {
            result.msg = "Name can not empty";
        } else if (e_id == "" && (e_password == "" || e_password.trim() == "")) {
            result.msg = "Username Can not empty";
        } else if (e_birthday == "" || e_birthday.trim() == "") {
            result.msg = "Birth can not empty";
        } else if (e_phone == "" || e_phone.trim() == "") {
            result.msg = "Telephone can not empty";
        } else if (e_mail == "" || e_mail.trim() == "") {
            result.msg = "Email can not empty";
        }
        if (result.msg != "") {
            result.error = 1;
        } else {
            var ret, sql;
            var salt = UUID.v1();
            if (e_id) {
                let updatePermission = await perm.permission(req, 'update');
                if(!updatePermission) {
                    result.error = 1;
                    result.msg = "No permission";
                    res.status(200).json(result);
                    return;
                }

                sql = "update user set name=?,user_name=?,birthday=?,tel=?,sex=?,mail=?, modified_id=?, modified_at=?";
                var params = [e_name, e_user_name, e_birthday || null, e_phone, e_sex, e_mail, user.id, new Date()];
                if (e_password != "" || e_password.trim() != "") {
                    sql = sql + ",password=? ";
                    sql = sql + ",salt=? ";
                    params.push(stringUtils.createPassword(e_password.trim()+salt));
                    params.push(salt);
                }
                sql = sql + "where id=?";
                params.push(e_id);
                ret = await mysql.query(sql, params);
            } else {

                let addPermission = await perm.permission(req, 'add');
                if(!addPermission) {
                    result.error = 1;
                    result.msg = "No permission";
                    res.status(200).json(result);
                    return;
                }
                sql = "select * from user where user_name=? and is_del=0";
                var users = await mysql.query(sql, e_user_name);
                if (users.length > 0) {
                    result.error = 1;
                    result.msg = "Username exists";
                } else {
                    sql = "insert user(user_name, password,name,mail,tel,sex,birthday,salt,creator_id) values (?,?,?,?,?,?,?,?,?)";
                    var password = stringUtils.createPassword(e_password.trim()+salt);
                    ret = await mysql.query(sql, [e_user_name, password, e_name, e_mail, e_phone, e_sex, e_birthday, salt, user.id]);
                }
            }
            log.info("save user ret: ", ret);
        }
        res.status(200).json(result);
    } catch (e) {
        log.error("save user ret:", e);
        result.error = 1;
        result.msg = "Server error";
        res.status(200).json(result);
    }
});
router.delete('/delete', async(req, res, next) => {
    var result = {
        error: 0,
        msg: ""
    };
    let deletePermission = await perm.permission(req, 'delete');
    if(!deletePermission) {
        result.error = 1;
        result.msg = "No Permission";
        res.status(200).json(result);
        return;
    }
    var user = req.session.user;
    var conn = await mysql.getConnection();
    await mysql.beginTransaction(conn);
    try {
        log.info("delete user params: ", req.body);
        var ids = req.body.ids;
        var user = req.session.user;
        var user_id = user.id;
        if (ids && ids.trim() != "") {
            ids = ids.split(",");
            if (_.indexOf(ids, user_id + "") != -1) {
                await mysql.rollback(conn);
                result.error = 1;
                result.msg = "Can not delete yourself";
                res.status(200).json(result);
                return;
            } else {
                var sql = 'update user set is_del=1, modified_at=?, modified_id=? where id in (';
                var sql2 = 'delete from user_role where user_id in (';
                for (var i = 0; i < ids.length; i++) {
                    if (i == 0) {
                        sql = sql + ids[i];
                        sql2 = sql2 + ids[i];
                    } else {
                        sql = sql + "," + ids[i];
                        sql2 = sql2 + "," + ids[i];
                    }
                }
                sql = sql + ")";
                sql2 = sql2 + ")";
                await mysql.query2(conn, sql, [new Date(), user.id]);
                await mysql.query2(conn, sql2);
                await mysql.commit(conn);
            }
        } else {
            result.error = 1;
            result.msg = "One must be selected";
            await mysql.rollback(conn);
        }
    } catch (e) {
        log.error("delete user ret:", e);
        result.error = 1;
        result.msg = "Deleted error";
        await mysql.rollback(conn);
    }
    res.status(200).json(result);
});
module.exports = router;
