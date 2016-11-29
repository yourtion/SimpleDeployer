'use strict';

const http = require('http');
const url = require('url');
const exec = require('child_process').exec;
let cfg = './config';
if(process.env.NODE_ENV === 'test') {
  cfg = './config.test.js';
}

const config = require(cfg);
const tasks = config.tasks;

const port = config.port || 8300;

http.createServer((req, res) => {
  const request = url.parse(req.url, true);
  const taskName = request.pathname.slice(1);
  if(!taskName) {
    res.writeHead(404);
    return res.end();
  }
  const task = tasks[taskName];
  if(!task) return res.end('Task Error!');
  if(task.token) {
    if(!request.query.token || request.query.token !== task.token) {
      console.error(`Token error: ${ request.query.token } !== ${ task.token }`);
      return res.end('Token Error!');
    }
  }
  if(!task.command) return res.end('Task Error!');
  exec(task.command, function (err, stdout, stderr){
    if(err) console.error(err);
    console.log(`stderr: ${ stderr }`);
    res.end('Done!');
  });

}).listen(port);
