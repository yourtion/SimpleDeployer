'use strict';

const http = require('http');
const url = require('url');
const exec = require('child_process').exec;
let cfg = './config';
if(process.env.NODE_ENV === 'test') {
  cfg = './config.test.js';
}

const config = require(cfg);
// eslint-disable-next-line no-console
const log = config.log ? console.log : () => {};
// eslint-disable-next-line no-console
const debug = config.debug ? console.log : () => {};
const tasks = config.tasks;

const port = config.port || 8300;
const host = config.host || '127.0.0.1';

function execCommand(command, options = {}, cb) {
  exec(command, options, function (err, stdout, stderr){
    if(err) cb(err);
    debug(`execCommand: ${ stderr }`);
    cb(null);
  });
}

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
      debug(`Token error: ${ request.query.token } !== ${ task.token }`);
      return res.end('Token Error!');
    }
  }
  if(!task.command) return res.end('Task Error!');
  const options = {};
  if(task.cwd) options.cwd = task.cwd;

  if(req.method === 'POST' && task.type && task.branch) {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      try {
        const json = JSON.parse(bodyString);
        let run = false;
        switch (task.type) {
        case 'gitlab':
          run = json.ref.indexOf(task.branch) > -1;
          break;
        
        default:
          break;
        }

        if (run) {
          execCommand(task.command, options, (err) => {
            log(`${ taskName } - ${ json.ref }: Done ${ err }`);
            res.end(err && err.toString() || 'Done!');
          });
        } else {
          log(`${ taskName } - ${ json.ref } Skip`);
          res.end('OK!');
        }
      } catch (error) {
        res.end(error.toString());
      }
    });
  } else {
    execCommand(task.command, options, (err) => {
      log(`${ taskName } Run`);
      res.end(err && err.toString() || 'Done!');
    });
  }
}).listen(port, host, () => {
  log(`SimpleDeployer is runing at ${ host }:${ port } ! 
  tasks: ${ Object.keys(tasks) }`);
});
