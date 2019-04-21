const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient('6379', '127.0.0.1')
redisClient.on('error', err => {
  console.log(err)
})

// 测试
redisClient.set('name', 'imooc', redis.print) // print 打印存储是否成功信息
redisClient.get('name', (err, val) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('val', val)

  // 退出
  redisClient.quit()
})
