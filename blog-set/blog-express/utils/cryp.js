const crypto = require('crypto')

 // 密钥
 const SECRET_KEY = 'wjdwdwq_21421@#'

 // md5 加密
 function md5(content){
     let md5 = crypto.createHash('md5')
     return md5.update(content).digest('hex')
 }

 // 加密函数
 function genPassword(password){
     const str = `password=${password}&key=${SECRET_KEY}&value=dnijiosa`
     return md5(str)
 }

console.log(genPassword('123'))
 module.exports = {
     genPassword
 }