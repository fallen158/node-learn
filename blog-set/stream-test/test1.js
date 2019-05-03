// 标准输入输出
// 把输入和输出用管道的方式连接起来
// process.stdin.pipe(process.stdout)

// 1

// 操作网络
// const http = require('http');
// http
//   .createServer((req, res) => {
//     if (req.method === 'POST') {
//       req.pipe(res);
//     }
//   })
//   .listen(8000);
// console.log('node at port http://localhost:8000');

// // 操作fs文件系统
// const fs = require('fs');
// const path = require('path');

// 2

// // 两个文件名
// const fileName1 = path.resolve(__dirname, 'data1.txt');
// const fileName2 = path.resolve(__dirname, 'data2.txx');
// // 读取文件的 stream 对象
// let readStream = fs.createReadStream(fileName1);
// // 写入文件的 stream 对象
// let writeStream = fs.createWriteStream(fileName2);
// // 执行拷贝,通过 pie
// readStream.pipe(writeStream);
// // 数据读取完成，拷贝成功
// readStream.on('end', () => {
//   console.log('拷贝完成');
// });

// 3

const http = require('http');
const fs = require('fs');
const path = require('path');
http 
  .createServer((req, res) => {
    if (req.method === 'POST') {
      const fileName1 = path.resolve(__dirname, 'data1.txt');
      let readStream = fs.createReadStream(fileName1);
      readStream.pipe(res);
    }
  })
  .listen(8000);
console.log('node at port http://localhost:8000');
