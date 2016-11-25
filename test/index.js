'use strict';

const request = require('request');
const should = require('should');

require('../index');
const url = 'http://localhost:8080/';

describe('Update server', function () {

  it('404 - Index', (done) => {
    request.get(url, (err, res) => {
      res.statusCode.should.equal(404);
      done(err);
    });
  });

  it('Task Error', (done) => {
    request.post(url + 't', (err, res, body) => {
      res.statusCode.should.equal(200);
      body.should.equal('Task Error!');
      done(err);
    });
  });

  it('Task Error - 2', (done) => {
    request.post(url + 'test1', (err, res, body) => {
      res.statusCode.should.equal(200);
      body.should.equal('Task Error!');
      done(err);
    });
  });

  it('Succeed no token', (done) => {
    request.post(url + 'test0', (err, res, body) => {
      res.statusCode.should.equal(200);
      body.should.equal('Done!');
      done(err);
    });
  });

  it('Token Error', (done) => {
    request.post(url + 'test', (err, res, body) => {
      res.statusCode.should.equal(200);
      body.should.equal('Token Error!');
      done(err);
    });
  });

  it('Success !', (done) => {
    request.post(url + 'test?token=HRPUNDCJ1S', (err, res, body) => {
      res.statusCode.should.equal(200);
      body.should.equal('Done!');
      done(err);
    });
  });
  
});
