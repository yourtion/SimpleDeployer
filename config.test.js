'use strict';

const path = require('path');
const config = module.exports;

config.port = 8080;

config.tasks = {};

config.tasks['test'] = {
  token: 'HRPUNDCJ1S',
  command: `cd ${ path.resolve(__dirname, './') } && git pull`,
};

config.tasks['test0'] = {
  command: `cd ${ path.resolve(__dirname, './') } && git pull`,
};

config.tasks['test1'] = {};
