const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
} = require('../controller/blog')
const { SussessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id || ''
  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyWord = req.query.keyWord || ''
    const listData = getList(author, keyWord)
    return new SussessModel(listData)
  }

  if (method === 'GET' && req.path === '/api/blog/detail') {
    const detailData = getDetail(id)
    return new SussessModel(detailData)
  }

  if (method === 'POST' && req.path === '/api/blog/new') {
    const data = newBlog(req.body)
    return new SussessModel(data)
  }

  if (method === 'POST' && req.path === '/api/blog/uptate') {
    const result = updataBlog(id, req.body)
    if (result) {
      return new SussessModel()
    } else {
      return new ErrorModel('更新博客失败')
    }
  }

  if (method === 'POST' && req.path === '/api/blog/del') {
    const result = delBlog(id)
    if (result) {
      return new SussessModel()
    } else {
      return new ErrorModel('删除博客失败')
    }
  }
}

module.exports = handleBlogRouter
