'use strict';

const path = require('path');
const config = module.exports;

config.port = 8080;

config.tasks = [];
config.tasks.push({
  name: 'test',
  token: 'HRPUNDCJ1S',
  command: `cd ${ path.resolve(__dirname, './') } && git pull`,
});
