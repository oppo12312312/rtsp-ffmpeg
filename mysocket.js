/*
 * @Description: 
 * @Author: zhongshuai
 * @Date: 2019-08-22 17:36:58
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-09-05 14:06:43
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
app.listen(8082, () => {
    console.log(`App listening at port 8082`)
})

//视屏流
const Mpeg1Muxer = require('./mpeg1muxer')

// 实例化:

const wss = new WebSocketServer({
    port: 3000
});




// wss.on('connection', function (ws,req) {
//     console.log(this.clients.size);
//     const wsUrl = req.url;
//     let prarms = qs.parse(_.split(wsUrl,'?')[1]); // token=xxxxxx
//     const url = unescape(prarms.url);
//     console.log(`[URL]${url}`);
//     let mpeg1Muxer = new Mpeg1Muxer({
//         url: url
//     })
//     mpeg1Muxer.on('mpeg1data', (obj) => {
//         ws.send(obj.data);
//     })
//     mpeg1Muxer.on('ffmpegStderr', function(data) {
//         // console.log(data.toString())
//     })
//     ws.number = 1;
//     ws.startData = [];
//     ws.mpeg1Muxer = mpeg1Muxer;
//     ws.on("close", function(){
//         console.log("close");
//         ws.mpeg1Muxer.stream.kill();
//     })
    
// });

var clients = {};
var mpeg1MuxerMap = {};
var firstTag= {};
//第一次推送的数据
var thisUrl = ""; 

// wss.on('connection', function (ws,req) {
//     clients = this.clients;
//     console.log(this.clients.size);
//     const wsUrl = req.url;
//     let prarms = qs.parse(_.split(wsUrl,'?')[1]); // token=xxxxxx
//     const url = unescape(prarms.url);
//     console.log(`[URL]${url}`);
//     newFlv(url,ws)
     

// });

// function newFlv(url,ws){
//     ws.count = 1;
//     ws.url = url;
//     if( ! mpeg1MuxerMap[url]){
//         ws.creatFF = true;
        
//         let mpeg1Muxer = new Mpeg1Muxer({
//             url: url
//         })
//         mpeg1Muxer.on('mpeg1data', (obj) => {
//             for (let client of clients) {
//                 if ( client.url === obj.url) {
//                     if(client.creatFF){
//                         client.send(obj.data);
//                         if(client.count === 1){
//                             firstTag[obj.url] = obj.data;
//                         }
//                     }else{
//                         if(client.count === 1){
//                             client.send(firstTag[obj.url].slice(0, 263)); 
//                         }else{
//                             client.send(obj.data);
//                         }
//                     }
//                     client.count ++

//                 }
//             }
//         })
//         mpeg1Muxer.on('ffmpegStderr', function(data) {
//             console.log(data.toString())
//         })
//         mpeg1MuxerMap[url] = mpeg1Muxer;
//     }else{
//         console.log("creatFF false")
//         ws.creatFF = false;
//     }
    


// }



wss.on('connection', function (ws,req) {
    clients = this.clients;
    console.log(this.clients.size);
    const wsUrl = req.url;
    let prarms = qs.parse(_.split(wsUrl,'?')[1]); // token=xxxxxx
    const url = unescape(prarms.url);
    console.log(`[URL]${url}`);
    if( mpeg1MuxerMap[url] ){
        mpeg1MuxerMap[url].state = false;
        mpeg1MuxerMap[url].stream.kill();
        newFlv(url,ws)
    }else{
        newFlv(url,ws)
    }
});

function newFlv(url,ws){
    ws.url = url;
    let mpeg1Muxer = new Mpeg1Muxer({
        url: url
    })
    mpeg1Muxer.on('mpeg1data', (obj) => {
        if(obj.state){
            for (let client of clients) {
                if ( client.url === obj.url) {
                    client.send(obj.data);
                }
            }
        }

    })
    mpeg1Muxer.on('ffmpegStderr', function(data) {
        console.log(data.toString())
    })
    mpeg1MuxerMap[url] = mpeg1Muxer;
    


}





