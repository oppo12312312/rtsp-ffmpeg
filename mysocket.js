/*
 * @Description: 
 * @Author: zhongshuai
 * @Date: 2019-08-22 17:36:58
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-08-26 14:41:17
 */
// 导入WebSocket模块:
var _  = require('lodash');
const WebSocket = require('ws');
const qs = require('qs');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

const express = require('express');
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.listen(8888, () => {
    console.log(`App listening at port 8082`)
})

//视屏流
const Mpeg1Muxer = require('./mpeg1muxer')

// 实例化:

const wss = new WebSocketServer({
    port: 3000
});




wss.on('connection', function (ws,req) {
    console.log(this.clients.size);
    const wsUrl = req.url;
    let prarms = qs.parse(_.split(wsUrl,'?')[1]); // token=xxxxxx
    const url = unescape(prarms.url);
    console.log(`[URL]${url}`);
    let mpeg1Muxer = new Mpeg1Muxer({
        url: url
    })
    mpeg1Muxer.on('mpeg1data', (obj) => {
        ws.send(obj.data);
    })
    mpeg1Muxer.on('ffmpegStderr', function(data) {
        // console.log(data.toString())
    })
    ws.mpeg1Muxer = mpeg1Muxer;
    ws.on("close", function(){
        console.log("close");
        ws.mpeg1Muxer.stream.kill();
    })
    
});





