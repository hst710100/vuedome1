const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
const Token = require("../token/jwt")
// 连接数据库
const conn = mysql.createConnection(models.mysql)
conn.connect()
//http://localhost:3000/api/Stu/showStu
// 接口：查询全部
router.post('/showStu', (req, res) => {
  //sql语句
  const sql = $sql.Stu.show
  //const params = req.body  post
  // const params = req.query get
  //接受vue提交的参数
  const param = req.body
  // var { username, userpassword } = req.body;
  // console.log(param)
  conn.query(sql, [param.username], function (err, result) {
    // console.log(param.userpassword)
    if (err) {
      res.json({ code: -1, msg: "用户登录失败" });
    }
    if (result.length > 0) {
      if (result[0].PASSWORD == param.userpassword) {
        //对密码加密生成一个token值
        const token = Token.encrypt({ id: param.userpassword }, 'token', '1h');
        // console.log(token);
        res.json({
          username: req.username,
          token: token, 
          code: 1,
          msg: "用户登录成功"
        })
      } else {
        res.json({ code: -1, msg: "用户账号或密码错误" });
      }
    } else {
      res.json({ code: -1, msg: "用户账号或密码错误" });
    }
  })
})
module.exports = router