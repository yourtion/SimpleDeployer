'use strict';

const express = require('express');
const exec = require('child_process').exec;
const debug = require('debug')('SimpeDeployer:');
let cfg = './config';
if(process.env.NODE_ENV === 'test') {
  cfg = './config.test.js';
}
const config = require(cfg);

const app = express();
const tasks = config.tasks;
const port = config.port || 8300;

function register(task) {
  debug('Add Task: %j', task);

  app.post('/' + task.name, function (req, res) {

    console.log(`Run :${ task.name } - ${ task.command } - ${ task.token }`);

    if(!req.query.token || req.query.token !== task.token) {
      debug(`Token error: ${ req.query.token } !== ${ task.token }`);
      return res.end('Token Error!');
    }

    exec(task.command, function (err, stdout, stderr){
      if(err) console.error(err);
      console.log(`stderr: ${ stderr }`);
      res.end('Done!');
    });

  });
}

for (const task of tasks) {
  register(task);
}

const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('UpdateService listening at http://%s:%s', host, port);
});

module.exports = app;
