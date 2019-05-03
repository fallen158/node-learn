const { readFile } = require('fs')
const EventEmitter = require('events')

class EE extends EventEmitter {}

const yyy = new EE()

yyy.on('event', () => {
  console.log('出大事啦')
})

setTimeout(() => {
  console.log('0 毫秒到期执行的定时器回调')
}, 0)

setTimeout(() => {
  console.log('1 毫秒到期执行的定时器回调')
}, 100)

setTimeout(() => {
  console.log('2 毫秒到期执行的定时器回调')
}, 200)

readFile('../package.json', () => {
  console.log('完成文件 1 读操作的回调')
})

readFile('../package.json', () => {
  console.log('完成文件 2 读操作的回调')
})

setImmediate(() => {
  console.log('immediate 立即回调')
})

process.nextTick(() => {
  console.log('process.nextTick 的回调')
})

Promise.resolve()
  .then(() => {
    yyy.emit('event')
    process.nextTick(() => {
      console.log('process.nextTick 的第 2 次回调')
    })
    console.log('Promise 的第一次回调')
  })
  .then(() => {
    console.log('Promise 的第二次回调')
  })
