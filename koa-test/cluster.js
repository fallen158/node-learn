// node.js 线程与进程
const cluster = require('cluster')
// 本机核数
const cpus = require('os').cpus()

let workers = []

const masterProcess = () => {
  console.log(`一共有 ${cpus.length} 个核`)
  console.log(`Master 主进程 ${process.pid} 启动`)

  for (let i = 0; i < cpus.length; i++) {
    console.log(`正在 Fork 子进程 ${i}`)
    const worker = cluster.fork()

    workers.push(worker)

    worker.on('message', message => {
      console.log(`主进程 ${process.pid} 收到 '${JSON.stringify(message)}' 来自 ${worker.process.pid}`)
    })
  }

  workers.forEach(worker => {
    console.log(`主进程 ${process.pid} 发消息给子进程 ${worker.process.pid}`)
    worker.send({ msg: `来自主进程的消息 ${process.pid}` })
  }, this)
}

const childProcess = () => {
  console.log(`Worker 子进程 ${process.pid} 启动`)

  process.on('message', message => {
    console.log(`Worker 子进程 ${process.pid} 收到消息 '${JSON.stringify(message)}'`)
  })
  console.log(`Worker 子进程 ${process.pid} 发消息给主进程`)
  process.send({ msg: `来自子进程的消息 ${process.pid}` })
}

if (cluster.isMaster) {
  masterProcess()
} else {
  childProcess()
}

// 一共有 4 个核
// Master 主进程 43968 启动
// 正在 Fork 子进程 0
// 正在 Fork 子进程 1
// 正在 Fork 子进程 2
// 正在 Fork 子进程 3
// 主进程 43968 发消息给子进程 43969
// 主进程 43968 发消息给子进程 43970
// 主进程 43968 发消息给子进程 43971
// 主进程 43968 发消息给子进程 43972
// Worker 子进程 43969 启动
// Worker 子进程 43969 发消息给主进程
// 主进程 43968 收到 '{"msg":"来自子进程的消息 43969"}' 来自 43969
// Worker 子进程 43969 收到消息 '{"msg":"来自主进程的消息 43968"}'
// Worker 子进程 43971 启动
// Worker 子进程 43971 发消息给主进程
// 主进程 43968 收到 '{"msg":"来自子进程的消息 43971"}' 来自 43971
// Worker 子进程 43971 收到消息 '{"msg":"来自主进程的消息 43968"}'
// Worker 子进程 43970 启动
// Worker 子进程 43970 发消息给主进程
// 主进程 43968 收到 '{"msg":"来自子进程的消息 43970"}' 来自 43970
// Worker 子进程 43970 收到消息 '{"msg":"来自主进程的消息 43968"}'
// Worker 子进程 43972 启动
// Worker 子进程 43972 发消息给主进程
// 主进程 43968 收到 '{"msg":"来自子进程的消息 43972"}' 来自 43972
// Worker 子进程 43972 收到消息 '{"msg":"来自主进程的消息 43968"}'
