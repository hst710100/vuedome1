const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
const Token = require("../token/jwt")
const { lte } = require('semver')
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
    // console.log(param)
    if (err) {
      res.json({ code: -1, msg: "用户登录失败" });
    }
    if (result.length > 0) {
      //生成值问题，条件不充分，管理员密码和名称要相同然后生成一个密钥为token的加密token值
      //如果二个条件不相等生成一个其他的密钥，并且不能得到后台数据
      if (result[0].PASSWORD == param.userpassword) {
        //管理员判断并给予权限
        if (result[0].username == 'admin') {
          //对密码加密生成一个token值
          const token = Token.encrypt({ id: param }, 'token', '1h');
          res.json({
            username: req.username,
            token: token,
            code: 1,
            msg: "管理员登录成功"
          })
        } else {
          //对密码加密生成一个token值
          const token = Token.encrypt({ id: param }, 'user', '1h');
          // console.log(token);
          res.json({
            username: req.username,
            token: token,
            code: 1,
            msg: "用户登录成功"
          })
        }
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
  //密码也上传上去了，不够严谨
  const sql = `select * from user WHERE username LIKE '%${input}%'  limit ${(pagenum - 1) * pagesize},${pagesize}`
  // console.log(req.query);
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
    //对token解密,后面为密钥
    const data = Token.decrypt(token, 'token');
    //不是管理员token值无法获取数据
    if (!data.token) {
      resp.json({ msg: "token值无效", code: -1 });
      return;
    }
    // console.log(result);
    //查看数据查询结果,返回给客户端
    resp.json({
      data: result,
      msg: "管理员数据请求成功",
      num: num,
      total: total,
      code: 1,
    });
  })
})
//用户添加
router.post('/usersadd', (req, resp) => {
  //接受vue提交的参数
  const { username, userpassword, email, telephone } = req.body
  // console.log(username, userpassword, email, telephone);
  //语句查询用户名是否存在并返回对应数据
  var sql1 = `select * from user where username='${username}'`
  conn.query(sql1, (err, result) => {
    //已存在返回相应数据
    if (result.length > 0) {
      resp.json({ msg: '用户名已经存在重新输入', code: -1 })
      return;
    }
    //用户添加成功返回数据
    var sql = `insert into user(username,PASSWORD,email,telephone) 
    values('${username}','${userpassword}','${email}','${telephone}')`
    conn.query(sql, (err, result) => {
      resp.json({ msg: '用户添加成功', code: 1 })
    })
  })
})
//删除
router.get('/deluser', (req, resp) => {
  // console.log(req.query);
  const { username } = req.query
  const sql = `delete from user where username='${username}'`;
  conn.query(sql, (err, result) => {
    resp.json({ msg: '用户删除成功' })
  })
})
//编辑用户信息
router.post('/editFix', (req, resp) => {
  // console.log(req.body);
  var { username, email, telephone, id } = req.body
  // //语句查询用户名是否存在并返回对应数据
  // var sql1 = `select * from user where username='${username}'`
  // conn.query(sql1, (err, result) => {
  //   //已存在返回相应数据
  //   if (result.length > 0) {
  //     resp.json({ msg: '用户名已经存在重新输入', code: -1 })
  //     return;
  //   }
  // })
  var sql = `update user set 
    username='${username}',email='${email}',telephone='${telephone}'
    where id=${id}`
  conn.query(sql, (err, result) => {
    resp.json({ msg: '编辑修改成功', code: 1 })
  })
})
//修改用户状态
router.get('/modifyState', (req, resp) => {
  // console.log(req.query);
  var { state, username } = req.query
  var sql = `update user set state='${state}' where username='${username}'`
  conn.query(sql, (err, result) => {
    resp.json({ msg: '状态更新成功' })
  })
})
//角色类别查询
router.post('/roleInformation', (req, resp) => {
  const { rolesuser } = req.body
  // console.log(req.body);
  //全部角色
  var sql = 'SELECT roleid,role FROM roles'
  conn.query(sql, (err, results) => {
    // console.log(results);//全部角色名和对应的角色指定id
    var sql1 = `SELECT roles.role,user.roleid FROM USER,roles 
    WHERE user.username = '${rolesuser}' AND roles.roleid = user.roleid`
    conn.query(sql1, (err, result) => {
      resp.json({ roleAll: results, role: result[0] })
      // console.log(result);
    })
  })
})
//角色分配确认
router.get('/rolesConfirm', (req, resp) => {
  const { regionId, rolesuser } = req.query
  // console.log(req.query);
  var sql = `UPDATE USER SET roleid = ${regionId} WHERE username = '${rolesuser}'`
  conn.query(sql, (err, result) => {
    resp.json({msg:"角色分配成功"})
  })
})
module.exports = router