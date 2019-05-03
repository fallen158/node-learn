const { exec } = require('../db/mysq')
const getList = (author, keyword) => {
  // 1=1 是为啦以防 author，keyword 为空的情况下
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}'`
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`
  }
  sql += `order by createtime desc;`
  // 返回 Promise
  return exec(sql)
}

const getDetail = id => {
  const sql = `select * from blogs where id=${id}`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogDta 是一个对象 包含  title content author createtime等属性
  const { title, content, author } = blogData
  const createtime = Date.now()
  const sql = `insert into blogs(title,content,createtime,author) values('${title}','${content}','${createtime}','${author}');`
  return exec(sql).then(insertData => {
    console.log(insertData)
    return {
      id: insertData.insertId
    }
  })
}

const updataBlog = (id, blogData = {}) => {
  // id 就是要更新 blog 的 id
  // blogDta 是一个对象 包含  title content 等属性
  const { title, content } = blogData
  const sql = `update blogs set title='${title}',content='${content}' where id=${id}`
  return exec(sql).then(updaData => {
    console.log(updaData)
    if (updaData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  // 删除的 blog 的 id
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  return exec(sql).then(delData => {
    console.log(delData)
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog
}
