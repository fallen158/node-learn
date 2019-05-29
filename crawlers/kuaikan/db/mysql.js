const mysql = require('mysql')
const MYSQL_CONF = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '13717022872.',
  database: 'comius'
}

const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

const exc = sql => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// const sql = 'select * from comius_data'
// exc(sql).then(data => {
//   console.log(data)
// })

// // 关闭连接
// con.end()

module.export = {
  exc
}
