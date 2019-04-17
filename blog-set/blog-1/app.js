const handleUserRouter = require('./src/routers/user')
const handleBlogRouter = require('./src/routers/blog')
const querystring = require('querystring')
// 解析 post 数据
const getPostData = req => {
  return new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      return resolve({})
    }
    if (req.headers['content-type'] !== 'application/json') {
      return resolve({})
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        return resolve({})
      }
      return resolve(JSON.parse(postData))
    })
  })
}
const serverHeader = (req, res) => {
  // 设置返回格式 json
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  req.path = req.url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(req.url.split('?')[1])

  // 处理 postData
  getPostData(req).then(postData => {
    req.body = postData
    // 处理 blog 路由
    const blogData = handleBlogRouter(req, res)
    if (blogData) {
      return res.end(JSON.stringify(blogData))
    }
    // 处理 user 路由
    const userData = handleUserRouter(req, res)
    if (userData) {
      return res.end(JSON.stringify(userData))
    }
    // 未命中路由返回 404
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 Not Found')
    res.end()
  })
}

module.exports = serverHeader

// process.env.NODE_ENV
