const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
} = require('../controller/blog')
const { SussessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('未登录'))
  }
}
const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id || ''
  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''

    if (req.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(req)
      if (loginCheckResult) {
        // 未登录
        return loginCheckResult
      }
      author = req.session.username
    }

    const result = getList(author, keyword)
    return result.then(listData => new SussessModel(listData))
  }
  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(detailData => new SussessModel(detailData))
  }
  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => new SussessModel(data))
  }
  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/uptate') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const result = updataBlog(id, req.body)
    return result.then(val => {
      if (val) {
        return new SussessModel()
      }
      return new ErrorModel('更新博客失败')
    })
  }
  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(val => {
      if (val) {
        return new SussessModel()
      }
      return new ErrorModel('删除博客失败')
    })
  }
}

module.exports = handleBlogRouter
