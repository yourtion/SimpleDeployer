'use strict';

const express = require('express');
const config = require('./config');
const exec = require('child_process').exec;
const debug = require('debug')('SimpeDeployer:');

const app = express();
const tasks = config.tasks;
const port = config.port || 8300;

function register(task) {
  debug("Add Task: %j", task);

  app.post('/'+task.name, function (req, res) {

    console.log(`Run :${task.name} - ${task.command}`);

    exec(task.command,function(err, stdout, stderr){
      console.log(`stderr: ${stderr}`);
      res.end('Done!');
    });

  });
}

for (let task of tasks) {
  register(task);
}

const server = app.listen(8300, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('UpdateService listening at http://%s:%s', host, port);
});
