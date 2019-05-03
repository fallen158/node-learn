const env = process.env.NODE_ENV || 'dev' // 获取环境变量

// 配置
let MYSQL_CONF
let REDIS_CONF

// 本地环境
if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '13717022872.',
    port: '3306',
    database: 'myblog'
  }

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

// 线上环境
if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '13717022872.',
    port: '3306',
    database: 'myblog'
  }

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
