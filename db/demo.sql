SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for event_attendance
-- ----------------------------
DROP TABLE IF EXISTS `event_attendance`;
CREATE TABLE `event_attendance` (
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of event_attendance
-- ----------------------------
BEGIN;
INSERT INTO `event_attendance` VALUES (319, 8);
INSERT INTO `event_attendance` VALUES (319, 8);
INSERT INTO `event_attendance` VALUES (319, 8);
INSERT INTO `event_attendance` VALUES (319, 8);
INSERT INTO `event_attendance` VALUES (319, 7);
INSERT INTO `event_attendance` VALUES (319, 8);
INSERT INTO `event_attendance` VALUES (319, 9);
INSERT INTO `event_attendance` VALUES (319, 10);
INSERT INTO `event_attendance` VALUES (319, 11);
INSERT INTO `event_attendance` VALUES (319, 12);
COMMIT;

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `start_dt` date NOT NULL,
  `end_dt` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of events
-- ----------------------------
BEGIN;
INSERT INTO `events` VALUES (1, 319, 'test', 'test', '2022-06-07', '2022-06-07', '2022-06-07 23:14:13');
INSERT INTO `events` VALUES (4, 319, 'test1', 'test1', '2022-06-01', '2022-06-22', '2022-06-09 17:26:36');
INSERT INTO `events` VALUES (5, 319, 'test2', 'test2', '2022-06-01', '2022-06-03', '2022-06-09 18:40:09');
INSERT INTO `events` VALUES (6, 319, 'test3', 'test3', '2022-06-01', '2022-06-10', '2022-06-09 18:41:21');
INSERT INTO `events` VALUES (7, 1, 'test4', 'test4', '2022-06-01', '2022-06-03', '2022-06-09 18:42:09');
INSERT INTO `events` VALUES (8, 1, 'test5', 'test5', '2022-06-01', '2022-06-10', '2022-06-09 18:42:49');
INSERT INTO `events` VALUES (11, 319, 'mytest1', 'mytest1', '2022-06-01', '2022-06-03', '2022-06-09 21:06:28');
COMMIT;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `menu_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) NOT NULL,
  `menu_name` varchar(20) NOT NULL,
  `menu_url` varchar(50) DEFAULT NULL,
  `menu_icon` varchar(50) DEFAULT NULL,
  `creator_id` bigint(20) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_id` bigint(20) DEFAULT '0',
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `type` tinyint(4) DEFAULT '0',
  `is_del` tinyint(1) DEFAULT '0',
  `menu_flag` varchar(16) DEFAULT '',
  PRIMARY KEY (`menu_id`),
  KEY `parent_id` (`parent_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menu
-- ----------------------------
BEGIN;
INSERT INTO `menu` VALUES (1, 0, 'Dashboard', '#', 'fa fa-dashboard', 0, '2017-08-08 22:52:02', 319, '2022-06-07 23:47:27', 0, 0, '');
INSERT INTO `menu` VALUES (5, 0, 'System', '#', 'glyphicon glyphicon-certificate', 0, '2017-08-08 22:52:02', 319, '2022-06-07 23:55:56', 0, 0, '');
INSERT INTO `menu` VALUES (6, 5, 'Users', '/users', 'glyphicon glyphicon-user', 0, '2017-08-08 22:52:02', 319, '2022-06-07 23:56:01', 0, 0, '');
INSERT INTO `menu` VALUES (9, 5, 'Roles', '/roles', 'glyphicon glyphicon-leaf', 0, '2017-08-08 22:52:02', 319, '2022-06-07 23:56:06', 0, 0, '');
INSERT INTO `menu` VALUES (10, 0, 'Permission', '#', 'glyphicon glyphicon-lock', 0, '2017-08-08 22:52:02', 319, '2022-06-08 00:47:38', 0, 0, '');
INSERT INTO `menu` VALUES (11, 10, 'User-Role', '/user_role', 'glyphicon glyphicon-lock', 0, '2017-08-08 22:52:02', 319, '2022-06-08 00:48:02', 0, 0, '');
INSERT INTO `menu` VALUES (12, 10, 'Menu-Role', '/menu_role', 'glyphicon glyphicon-lock', 0, '2017-08-08 22:52:02', 319, '2022-06-08 00:56:42', 0, 0, '');
INSERT INTO `menu` VALUES (13, 5, 'Menus', '/menus', 'glyphicon glyphicon-list-alt', 0, '2017-08-08 22:52:02', 319, '2022-06-07 23:56:40', 0, 0, '');
INSERT INTO `menu` VALUES (35, 0, 'Events', '/events', 'fa fa-pie-chart', 0, '2017-08-08 22:52:02', 319, '2022-06-09 13:36:00', 0, 0, '');
INSERT INTO `menu` VALUES (38, 0, 'Home', '/events/home', 'fa fa-home', 0, '2017-08-08 22:52:02', 319, '2022-06-09 17:27:49', 0, 0, '');
INSERT INTO `menu` VALUES (41, 0, 'My Events', '/events/my', 'fa fa-pie-chart', 0, '2017-08-08 22:52:02', 0, '2022-06-09 20:11:07', 0, 0, '');
COMMIT;

-- ----------------------------
-- Table structure for menu_role
-- ----------------------------
DROP TABLE IF EXISTS `menu_role`;
CREATE TABLE `menu_role` (
  `menu_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`menu_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menu_role
-- ----------------------------
BEGIN;
INSERT INTO `menu_role` VALUES (1, 1);
INSERT INTO `menu_role` VALUES (1, 11);
INSERT INTO `menu_role` VALUES (1, 14);
INSERT INTO `menu_role` VALUES (5, 1);
INSERT INTO `menu_role` VALUES (5, 11);
INSERT INTO `menu_role` VALUES (5, 14);
INSERT INTO `menu_role` VALUES (6, 1);
INSERT INTO `menu_role` VALUES (6, 11);
INSERT INTO `menu_role` VALUES (6, 14);
INSERT INTO `menu_role` VALUES (9, 1);
INSERT INTO `menu_role` VALUES (9, 11);
INSERT INTO `menu_role` VALUES (10, 1);
INSERT INTO `menu_role` VALUES (10, 11);
INSERT INTO `menu_role` VALUES (10, 14);
INSERT INTO `menu_role` VALUES (11, 1);
INSERT INTO `menu_role` VALUES (11, 11);
INSERT INTO `menu_role` VALUES (11, 14);
INSERT INTO `menu_role` VALUES (12, 1);
INSERT INTO `menu_role` VALUES (12, 11);
INSERT INTO `menu_role` VALUES (13, 1);
INSERT INTO `menu_role` VALUES (13, 11);
INSERT INTO `menu_role` VALUES (15, 1);
INSERT INTO `menu_role` VALUES (15, 5);
INSERT INTO `menu_role` VALUES (15, 11);
INSERT INTO `menu_role` VALUES (15, 14);
INSERT INTO `menu_role` VALUES (16, 1);
INSERT INTO `menu_role` VALUES (16, 5);
INSERT INTO `menu_role` VALUES (16, 14);
INSERT INTO `menu_role` VALUES (17, 1);
INSERT INTO `menu_role` VALUES (17, 5);
INSERT INTO `menu_role` VALUES (17, 11);
INSERT INTO `menu_role` VALUES (17, 14);
INSERT INTO `menu_role` VALUES (18, 1);
INSERT INTO `menu_role` VALUES (18, 5);
INSERT INTO `menu_role` VALUES (18, 11);
INSERT INTO `menu_role` VALUES (18, 14);
INSERT INTO `menu_role` VALUES (19, 1);
INSERT INTO `menu_role` VALUES (19, 5);
INSERT INTO `menu_role` VALUES (19, 11);
INSERT INTO `menu_role` VALUES (19, 14);
INSERT INTO `menu_role` VALUES (23, 1);
INSERT INTO `menu_role` VALUES (23, 11);
INSERT INTO `menu_role` VALUES (23, 14);
INSERT INTO `menu_role` VALUES (23, 999999904);
INSERT INTO `menu_role` VALUES (32, 1);
INSERT INTO `menu_role` VALUES (32, 11);
INSERT INTO `menu_role` VALUES (32, 14);
INSERT INTO `menu_role` VALUES (32, 999999901);
INSERT INTO `menu_role` VALUES (32, 999999903);
INSERT INTO `menu_role` VALUES (35, 1);
INSERT INTO `menu_role` VALUES (35, 5);
INSERT INTO `menu_role` VALUES (35, 11);
INSERT INTO `menu_role` VALUES (35, 14);
INSERT INTO `menu_role` VALUES (35, 999999901);
INSERT INTO `menu_role` VALUES (35, 999999907);
INSERT INTO `menu_role` VALUES (38, 1);
INSERT INTO `menu_role` VALUES (38, 2);
INSERT INTO `menu_role` VALUES (38, 5);
INSERT INTO `menu_role` VALUES (38, 11);
INSERT INTO `menu_role` VALUES (38, 14);
INSERT INTO `menu_role` VALUES (38, 999999901);
INSERT INTO `menu_role` VALUES (38, 999999942);
INSERT INTO `menu_role` VALUES (41, 1);
INSERT INTO `menu_role` VALUES (41, 2);
INSERT INTO `menu_role` VALUES (41, 5);
INSERT INTO `menu_role` VALUES (41, 11);
INSERT INTO `menu_role` VALUES (41, 14);
INSERT INTO `menu_role` VALUES (41, 999999901);
INSERT INTO `menu_role` VALUES (41, 999999942);
INSERT INTO `menu_role` VALUES (44, 1);
INSERT INTO `menu_role` VALUES (44, 5);
INSERT INTO `menu_role` VALUES (44, 11);
INSERT INTO `menu_role` VALUES (44, 14);
INSERT INTO `menu_role` VALUES (44, 999999901);
INSERT INTO `menu_role` VALUES (44, 999999907);
INSERT INTO `menu_role` VALUES (47, 1);
INSERT INTO `menu_role` VALUES (47, 5);
INSERT INTO `menu_role` VALUES (47, 11);
INSERT INTO `menu_role` VALUES (47, 14);
INSERT INTO `menu_role` VALUES (47, 999999901);
INSERT INTO `menu_role` VALUES (47, 999999907);
INSERT INTO `menu_role` VALUES (50, 1);
INSERT INTO `menu_role` VALUES (50, 5);
INSERT INTO `menu_role` VALUES (50, 14);
INSERT INTO `menu_role` VALUES (50, 999999901);
INSERT INTO `menu_role` VALUES (53, 1);
INSERT INTO `menu_role` VALUES (53, 5);
INSERT INTO `menu_role` VALUES (53, 11);
INSERT INTO `menu_role` VALUES (53, 14);
INSERT INTO `menu_role` VALUES (53, 999999901);
INSERT INTO `menu_role` VALUES (53, 999999907);
INSERT INTO `menu_role` VALUES (56, 1);
INSERT INTO `menu_role` VALUES (56, 5);
INSERT INTO `menu_role` VALUES (56, 11);
INSERT INTO `menu_role` VALUES (56, 14);
INSERT INTO `menu_role` VALUES (56, 999999901);
INSERT INTO `menu_role` VALUES (56, 999999907);
INSERT INTO `menu_role` VALUES (59, 5);
INSERT INTO `menu_role` VALUES (59, 11);
INSERT INTO `menu_role` VALUES (59, 14);
INSERT INTO `menu_role` VALUES (59, 999999901);
INSERT INTO `menu_role` VALUES (59, 999999902);
INSERT INTO `menu_role` VALUES (83, 5);
INSERT INTO `menu_role` VALUES (83, 11);
INSERT INTO `menu_role` VALUES (83, 14);
INSERT INTO `menu_role` VALUES (83, 999999901);
INSERT INTO `menu_role` VALUES (83, 999999902);
INSERT INTO `menu_role` VALUES (83, 999999904);
INSERT INTO `menu_role` VALUES (103, 1);
INSERT INTO `menu_role` VALUES (103, 5);
INSERT INTO `menu_role` VALUES (104, 1);
INSERT INTO `menu_role` VALUES (104, 5);
INSERT INTO `menu_role` VALUES (108, 1);
INSERT INTO `menu_role` VALUES (109, 1);
INSERT INTO `menu_role` VALUES (112, 1);
INSERT INTO `menu_role` VALUES (113, 1);
INSERT INTO `menu_role` VALUES (114, 1);
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(10) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `creator_id` bigint(20) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_id` bigint(20) DEFAULT '0',
  `modified_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `is_del` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=999999943 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES (1, 'admin', 'Administrator', 0, '2017-08-08 23:07:27', 319, '2022-06-08 00:37:35', 0);
INSERT INTO `role` VALUES (2, 'user', 'Normal User', 0, '2017-08-08 23:07:27', 319, '2022-06-09 21:17:06', 0);
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(40) NOT NULL,
  `mail` varchar(40) CHARACTER SET latin1 DEFAULT NULL,
  `tel` varchar(11) DEFAULT NULL,
  `sex` varchar(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `salt` varchar(40) DEFAULT NULL,
  `creator_id` bigint(20) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_id` bigint(20) DEFAULT '0',
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_del` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'admin', 'ANIjkslgOogPNK+ViTQvXA==', 'Admin', '123@123.com', '1234432123', '0', '2022-06-01', '0500b410-e67f-11ec-91e6-41b4ed6ebf08', 319, '2022-06-08 00:29:36', 0, '2022-06-09 20:26:51', 0);
INSERT INTO `user` VALUES (319, 'test', 'I94lucSajzG4FfsMOPh+Tw==', 'test', 'adminuser@44.com', '', '0', '2017-08-03', '3b757fa0-7890-11e8-9247-7d7cda1d0971', 0, '2017-08-08 22:21:47', 319, '2022-06-07 22:26:27', 0);
INSERT INTO `user` VALUES (340, '22222222', 'vDNPdo/ShKcmo4Me2DVC7A==', '333', '223', '232', '0', '2019-04-03', '54992010-68ed-11e9-b9e4-d9dc27a1bbb0', 319, '2019-04-27 21:06:54', 319, '2022-06-08 00:28:22', 0);
INSERT INTO `user` VALUES (366, 'user1', 'X5+KhT3JVn90F9DHISuk2w==', 'user1', '123@gmail.com', '1234321123', '1', '2022-06-01', '6355c730-e73d-11ec-b657-8d8622dd39da', 0, '2022-06-08 23:12:18', 0, '0000-00-00 00:00:00', 0);
INSERT INTO `user` VALUES (370, 'liangzelee@gmail.com', '', 'liangze li', 'liangzelee@gmail.com', '', '', '2000-01-01', 'df02cb60-e7b2-11ec-b9ee-d1d8dd407780', 0, '2022-06-09 13:13:17', 0, '0000-00-00 00:00:00', 0);
COMMIT;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_role
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES (1, 1);
INSERT INTO `user_role` VALUES (319, 1);
INSERT INTO `user_role` VALUES (366, 2);
INSERT INTO `user_role` VALUES (26, 5);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
