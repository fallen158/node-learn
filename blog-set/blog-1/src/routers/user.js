const { SussessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')
const handleUserRouter = (req, res) => {
  const method = req.method
  if (method === 'POST' && req.path === '/api/user/login') {
    // console.log(req.body)
    // console.log(typeof req.body)
    // console.log(req.body.username)
    const { username, password } = req.body
    const result = login(username, password)
    if (result) {
      return new SussessModel('登录成功')
    }
    return new ErrorModel('登录失败, 请检查账户名或密码是否正确')
  }
}

module.exports = handleUserRouter
