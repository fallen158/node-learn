const handleUserRouter = require('./src/routers/user')
const handleBlogRouter = require('./src/routers/blog')
const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
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
// // session 数据
// const SESSION_DADT = {}
// 设置 cookie 过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  return d.toGMTString()
}
const serverHeader = (req, res) => {
  // 设置返回格式 json
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  req.path = req.url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(req.url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) return
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 解析 session
  // let needSetCookie = false
  // let userId = req.cookie.userid
  // if (userId) {
  //   if (!SESSION_DADT[userId]) {
  //     SESSION_DADT[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DADT[userId] = {}
  // }
  // req.session = SESSION_DADT[userId]

  // 解析 session (使用redis)
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
  }
  // 获取 session
  req.sessionId = userId
  get(req.sessionId)
    .then(sessionData => {
      if (sessionData === null) {
        // 初始化 redis 中的 session 值
        set(req.sessionId, {})
        // 设置 session
        req.session = {}
      } else {
        req.session = sessionData
      }
      // 处理 postData
      return getPostData(req)
    })
    .then(postData => {
      req.body = postData

      // 处理 user 路由
      const userResult = handleUserRouter(req, res)
      if (userResult) {
        return userResult
          .then(userData => {
            if (needSetCookie) {
              res.setHeader(
                'Set-Cookie',
                `userid=${userId}; path="/"; httpOnly; expires=${getCookieExpires()}`
              )
            }
            return res.end(JSON.stringify(userData))
          })
          .catch(err => {
            console.log(err, 'err')
          })
      }

      // 处理 blog 路由
      const blogResult = handleBlogRouter(req, res)
      if (blogResult) {
        return blogResult
          .then(blogData => {
            if (needSetCookie) {
              res.setHeader(
                'Set-Cookie',
                `userid=${userId}; path="/"; httpOnly; expires=${getCookieExpires()}`
              )
            }
            return res.end(JSON.stringify(blogData))
          })
          .catch(err => {
            console.log(err, 'err')
          })
      }

      // 未命中路由返回 404
      res.writeHead(404, { 'Content-type': 'text/plain' })
      res.write('404 Not Found')
      res.end()
    })
}

module.exports = serverHeader

// process.env.NODE_ENV
