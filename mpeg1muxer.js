/*
 * @Description: 
 * @Author: zhongshuai
 * @Date: 2019-08-21 18:10:43
 * @LastEditors: zhongshuai
 * @LastEditTime: 2019-08-23 13:46:56
 */
var Mpeg1Muxer, child_process, events, util

child_process = require('child_process')

util = require('util')

events = require('events')

Mpeg1Muxer = function(options) {
  var key
  this.url = options.url
  this.ffmpegOptions = options.ffmpegOptions
  this.exitCode = undefined
  this.additionalFlags = []
  if (this.ffmpegOptions) {
    for (key in this.ffmpegOptions) {
      this.additionalFlags.push(key)
      if (String(this.ffmpegOptions[key]) !== '') {
        this.additionalFlags.push(String(this.ffmpegOptions[key]))
      }
    }
  }
  this.spawnOptions = [
    "-rtsp_transport",
    "tcp",
    "-i",
    this.url,
    '-f',
    'mpegts',
    "-an",
    '-c:v',
    'mpeg1video',
    "-q",
    "0",
    '-r',
    '50',
    '-s',
    '1920x1080',
    // additional ffmpeg options go here
    // ...this.additionalFlags,
    '-'
  ]
  this.stream = child_process.spawn("ffmpeg", this.spawnOptions, {
    detached: false
  })
  this.inputStreamStarted = true
  this.stream.stdout.on('data', (data) => {
    
    return this.emit('mpeg1data', {
      data: data,
      url: this.url
    })
  })
  this.stream.stderr.on('data', (data) => {
    return this.emit('ffmpegStderr', data)
  })
  this.stream.on('exit', (code, signal) => {
    if (code === 1) {
      console.error('RTSP stream exited with error')
      this.exitCode = 1
      return this.emit('exitWithError')
    }
  })
  return this
}

util.inherits(Mpeg1Muxer, events.EventEmitter)

module.exports = Mpeg1Muxer
