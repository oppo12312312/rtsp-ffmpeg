/*
 * @Description: 
 * @Author: zhongshuai
 * @Date: 2019-08-22 17:36:58
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-08-22 22:21:17
 */
// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 3000
});

//用户
const user = null;

//视屏流
const Mpeg1Muxer = require('./mpeg1muxer')

const mpeg1MuxerMap = {};

let clients = {};

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




