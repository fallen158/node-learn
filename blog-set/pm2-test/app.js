
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
const http = require('http')

const server = http.createServer((req, res) => {
    // 模拟日志
    console.log('cur time', Date.now())
    // 模拟错误
    console.error('假装出错', Date.now())

    // 模拟一个错误
    if (req.url === '/err') {
        throw new Error('/err 出错了')
    }

    res.setHeader('Content-type', 'application/json')
    res.end(
        JSON.stringify({
            errno: 0,
            msg: 'pm2 test server 3'
        })
    )
})

server.listen(8000)
console.log('server is listening on port 8000 ...')