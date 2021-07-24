const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
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
  const params = req.body.param
  // var { username, userpassword } = req.body;
  console.log(params)
  conn.query(sql, [params.username], function (err, result) {
    console.log(params.userpassword)
    if (err) {
      res.json({ code: -1, msg: "用户登录失败" });
    }
    if (result.length > 0) {
      if (result[0].PASSWORD == params.userpassword) {
        //session服务器记录存储
        req.session.username = params.username;
        res.json({
          data: {
            username: req.session.username
          }, code: 1, msg: "用户登录成功"
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