const mysql = require('./mysql');
const log = require('./logger').getLogger("system");
const _ = require('lodash');
const stringUtils = require('../core/util/StringUtils');

/**
 * @param req
 * @param user_id
 * @param menu_id
 * @return {Promise<void>}
 */
module.exports.getPermissions = async (req) => {
    let user = req.session.user;
    let menu_active = req.session.menu_active['/users'] || {};
    let user_id = user.id;
    let menu_id = menu_active.menu_id;
    let sql = "select a.menu_id,a.menu_name,a.menu_url,a.menu_flag from menu a " +
        "inner join menu_role b on a.menu_id = b.menu_id " +
        "inner join user_role c on b.role_id = c.role_id " +
        "inner join user d on c.user_id = d.id " +
        "where d.id = ? and a.type = 1 and a.parent_id = ?";
    let permissions = await mysql.query(sql, [user_id, menu_id]);
    let obj = {};
    for (let i = 0; i < permissions.length; i++) {
        let permObj = permissions[i];
        obj[permObj.menu_flag] = permObj;
    }
    return obj;
};
module.exports.permission = async (req, operate) => {
    let permissions = await this.getPermissions(req);
    return permissions[operate];
}
