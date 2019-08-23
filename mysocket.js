/*
 * @Description: 
 * @Author: zhongshuai
 * @Date: 2019-08-22 17:36:58
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-08-23 16:22:24
 */
// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

const express = require('express');
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.listen(8082, () => {
    console.log(`App listening at port 8082`)
})

//视屏流
const Mpeg1Muxer = require('./mpeg1muxer')

const mpeg1MuxerMap = {};

let clients = {};



// 实例化:

const wss = new WebSocketServer({
    port: 3000
});




wss.on('connection', function (ws) {
    clients = this.clients;
    console.log(this.clients.size)
    let url = "rtsp://admin:admin@10.231.20.156/1"
    let mpeg1Muxer = new Mpeg1Muxer({
        url: url
    })

    mpeg1Muxer.on('ffmpegStderr', function(data) {
        console.log(data.toString())
    })
    mpeg1Muxer.on('mpeg1data', (obj) => {
        console.log(clients.size)
        for (let client of clients) {
            client.send(obj.data);
        }
    })
});





