const getList = (author, keyword) => {
  // 模拟数据
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      author: '张三',
      createTime: 1546610491112
    },
    {
      id: 2,
      title: '标题B',
      content: '内容B',
      author: '李四',
      createTime: 1846610322321
    }
  ]
}

const getDetail = (id) => {
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      author: '张三',
      createTime: 1546610491112
    },
    {
      id: 2,
      title: '标题B',
      content: '内容B',
      author: '李四',
      createTime: 1846610322321
    }
  ]
}

const newBlog = (blogData = {}) => {
  // blogDta 是一个对象 包含  title content 等属性
  console.log('new blogData ....', blogData)
  return {
    id: 3
  }
}

const updataBlog = (id, blogData = {}) => {
  // id 就是要更新 blog 的 id
  // blogDta 是一个对象 包含  title content 等属性
  console.log(id, blogData, 'updateBlog')
  return true
}

const delBlog = (id) => {
  // 删除的 blog 的 id
  console.log('delBlog', id)
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
}
