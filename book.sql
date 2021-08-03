CREATE DATABASE IF NOT EXISTS book DEFAULT CHARACTER SET utf8;

USE book;

##用户表
CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `PASSWORD` VARCHAR(20) NOT NULL,
  `gender` VARCHAR(2) DEFAULT NULL,
  `email` VARCHAR(50) DEFAULT NULL,
  `telephone` VARCHAR(20) DEFAULT NULL,
  `introduce` VARCHAR(100) DEFAULT NULL,
  `activeCode` VARCHAR(50) DEFAULT NULL,
  `state` VARCHAR(2) DEFAULT '0',
  `roleid` INT(11) DEFAULT 0,
  `registTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

INSERT  INTO 
`user`(`id`,`username`,`PASSWORD`,`gender`,`email`,`telephone`,`introduce`,`activeCode`,`state`,`roleid`,`registTime`) 
VALUES 
(1,'admin','123456','男','huan9yun@163.com','13041019968','我是超级管理员，我可以登录后台管理系统','49338fdc-d8c9-46fa-8391-0fac7bf09707','1',1,'2015-03-19 16:16:40'),
(2,'madan','123456','女','huan9yun@163.com','13269219270','我是一个课程设计师','c1cc1229-f0ac-41b4-920c-dfef9f8a96a3','1',0,'2015-03-19 18:12:36'),
(3,'huangyun','123456','男','huan9yun@163.com','13041019968','大家好，我是黄云','d0827d1d-dc0d-4cdc-8710-678ce917880e','0',0,'2015-03-20 17:36:38'),
(4,'hanyongmeng','123456','男','itcast_hym@163.com','15207545526','课程设计师','da483412-1e34-43cf-aef2-4925748c811d','0',0,'2016-01-21 15:19:32'),
(5,'tianjiao','123456','男','hanyongmeng@126.cn','','','f8173f4f-debe-4d32-8117-b228d555d822','0',0,'2016-02-18 15:32:01');
##角色
CREATE TABLE `roles` (
  `id` INT(11) NOT NULL,
  `roleid` INT(11) PRIMARY KEY DEFAULT 0,
  `role` VARCHAR(10) DEFAULT '普通用户'
)

INSERT  INTO 
`roles`(`id`,`roleid`,`role`) 
VALUES 
(1,0,'普通用户'),(2,1,'超级用户'),(3,22,'游客'),(4,30,'测试用户')

##外键约束
ALTER TABLE USER ADD CONSTRAINT fk_11 FOREIGN KEY(roleid) REFERENCES roles(roleid);