const fs = require('fs');

// 最早期 node js 的回调写法
// fs.readFile('./package.json',(err,data)=>{
//     if(err) return console.error(err)
//     data = JSON.parse(data)
//     console.log(data.name)
// })

// Promise 阶段
// 1.原生promise 写法
// function readFileAsync(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, (err, data) => {
//       if (err) reject(err);
//       else resolve(data);
//     });
//   });
// }

// readFileAsync('./package.json').then(data=>{
//     data = JSON.parse(data)
//     console.log(data.name)
// }).catch(err=>{
//     console.log(err)
// })

// 2,利用 util.promisity方法
// const util = require('util');
// util
//   .promisify(fs.readFile)('./package.json')
//   .then(data => {
//     data = JSON.parse(data);
//     console.log(data.name);
//   })
//   .catch(err => {
//     console.log(err);
//   });


