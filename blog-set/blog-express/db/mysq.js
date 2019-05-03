const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始链接
con.connect()

// 执行 sql 的函数
const exec = sql => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  exec,
  escape: mysql.escape
}
