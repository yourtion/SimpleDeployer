'use strict';

const express = require('express');
const config = require('./config');
const exec = require('child_process').exec;
const debug = require('debug')('SimpeDeployer:');

const app = express();
const tasks = config.tasks;
const port = config.port || 8300;

function register(task) {
  debug('Add Task: %j', task);

  app.post('/' + task.name, function (req, res) {

    console.log(`Run :${ task.name } - ${ task.command } - ${ task.token }`);

    if(req.params.token && req.params.token !== task.token) {
      debug(`Token error: ${ req.params.token } !== ${ task.token }`);
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
