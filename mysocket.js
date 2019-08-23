/*
 * @Description: 
 * @Author: zhongshuai
 * @Date: 2019-08-22 17:36:58
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-08-23 12:33:33
 */
// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;


//用户
const user = null;

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
    console.log(this.clients.size);
    ws.on('message', function (url) {
        console.log(`[URL]  ${url}`);
        if(!mpeg1MuxerMap[url]){
            let mpeg1Muxer = new Mpeg1Muxer({
                url: url
            })
            mpeg1Muxer.on('mpeg1data', (obj) => {
                for (let client of clients) {
                    if ( client.url === obj.url) {
                        client.send(obj.data);
                    }
                }
            })
            mpeg1Muxer.on('ffmpegStderr', function(data) {
                console.log(data.toString())
            })
            mpeg1MuxerMap[url] = mpeg1Muxer;
        }
        ws.url = url;
    })

});

// const wss1 = new WebSocketServer({
//     port: 3001
// });

// let mpeg1Muxer1 = new Mpeg1Muxer({
//     url: "rtsp://admin:Abc123456@10.231.20.158/cam/realmonitor?channel=1&subtype=0"
// })

// mpeg1Muxer1.on('ffmpegStderr', function(data) {
//     console.log(data.toString())
// })
// wss1.on('connection', function (ws) {
//     mpeg1Muxer1.on('mpeg1data', (obj) => {
//         ws.send(obj.data);
//     })
// });

// const wss2 = new WebSocketServer({
//     port: 3002
// });
// let mpeg1Muxer2 = new Mpeg1Muxer({
//     url: "rtsp://admin:admin@10.231.20.155/1"
// })

// mpeg1Muxer2.on('ffmpegStderr', function(data) {
//     console.log(data.toString())
// })

// wss2.on('connection', function (ws) {
//     mpeg1Muxer2.on('mpeg1data', (obj) => {
//         ws.send(obj.data);
//     })
// });