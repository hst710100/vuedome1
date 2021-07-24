// sqlMap.js  sql语句
const sqlMap = {
    Stu: {
      show: "select username,PASSWORD from user where username=? limit 1",
    }
  }
  
  module.exports = sqlMap