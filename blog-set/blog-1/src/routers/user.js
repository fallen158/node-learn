const { SussessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')
const { set } = require('../db/redis')
const handleUserRouter = (req, res) => {
  
  const method = req.method
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置 session
        req.session.username = data.username
        req.session.realname = data.realname
        // 同步 redis
        set(req.sessionId, req.session)
        return new SussessModel('登录成功')
      }
      return new ErrorModel('登录失败')
    })
  }

  // if (method === 'GET' && req.path === '/api/user/login-test') {
  //   if (req.session.username) {
  //     return Promise.resolve(new SussessModel(`已登录: ${req.session.username}`))
  //   }
  //   return Promise.resolve(new ErrorModel('未登录'))
  // }
}

module.exports = handleUserRouter
