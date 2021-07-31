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
// showStu参数为 接口：查询全部

//登录的请求数据
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
    console.log(param)
    if (err) {
      res.json({ code: -1, msg: "用户登录失败" });
    }
    if (result.length > 0) {
      if (result[0].PASSWORD == param.userpassword) {
        //对密码加密生成一个token值
        const token = Token.encrypt({ id: param }, 'token', '1h');
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
//用户管理->用户列表给个数据
router.get('/userList', (req, resp) => {
  //接受vue提交的参数
  // const param = req.query
  //sql语句
  // console.log(req.query);
  const { input, pagenum, pagesize, token } = req.query
  //为每次上传一次当前页和分几页数据就重新获取,搜索框查询关键字如果没有为全部查询
  const sql = `select * from user WHERE username LIKE '%${input}%'  limit ${(pagenum - 1) * pagesize},${pagesize}`
  console.log(req.query);
  //input   查询参数 可以为null
  //pagenum 当前页码
  //pagesize 显示条数
  //默认为0表示没页数，等待客户端传递页码
  var num = 0
  //当客服端发送的产生接受到后改变num值
  if (pagenum) {
    num += parseInt(pagenum)
  }
  //获取user数据总页码total,分页数totalpage
  var sql1 = `select count(*) as total from user`
  //默认总条数为0
  var total = 0
  conn.query(sql1, (err, rs) => {
    total = rs[0].total
  })
  conn.query(sql, function (err, result) {
    //对token解密
    const data = Token.decrypt(token, 'token');
    //不是管理员token值无法获取数据
    if (!data.token) {
      resp.json({ msg: "token值无效",code:-1});
      return;
    }
    // console.log(result);
    //查看数据查询结果,返回给客户端
    resp.json({
      data: result,
      msg: "管理员数据请求成功",
      num: num,
      total: total,
      code:1,
    });
  })
})
module.exports = router