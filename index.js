'use strict';

const express = require('express');
const exec = require('child_process').exec;
let cfg = './config';
if(process.env.NODE_ENV === 'test') {
  cfg = './config.test.js';
}
const config = require(cfg);
const app = express();
const tasks = config.tasks;
const port = config.port || 8300;

app.post('/:task', function (req, res) {
  const task = tasks[req.params.task];
  if(!task) return res.end('Task Error!');
  if(task.token && (!req.query.token || req.query.token !== task.token)) {
    console.error(`Token error: ${ req.query.token } !== ${ task.token }`);
    return res.end('Token Error!');
  }
  if(!task.command) return res.end('Task Error!');
  exec(task.command, function (err, stdout, stderr){
    if(err) console.error(err);
    console.log(`stderr: ${ stderr }`);
    res.end('Done!');
  });
});

const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('UpdateService listening at http://%s:%s', host, port);
});

module.exports = app;
