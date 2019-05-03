const mysql = require('mysql');

// 创建链接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13717022872.',
  port: '3306',
  database: 'myblog'
});

// 开始链接
con.connect();

// 执行 sql 语句
const sql = 'select id,username from users;'
con.query(sql, (err, data) => {
  if (err) {
    throw new Error(err);
  }
  console.log(data);
});

// 关闭链接
con.end();
