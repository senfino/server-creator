/* 
 * @Author: Tomasz Niezgoda
 * @Date: 2015-12-09 17:31:04
 * @Last Modified by: Tomasz Niezgoda
 * @Last Modified time: 2015-12-09 22:16:29
 */
'use strict';

function create(customOptions){
  var childP = require('child_process');
  var childProcess;
  var defaults = {
    path: null,
    cwd: '',
    onOnline: function(){},
    onOffline: function(){}
  };
  var _ = require('lodash');
  var options = _.assign({}, defaults, customOptions);
  var path;
  var base = process.env.PWD;
  var controls;

  if(typeof options.path !== 'string'){
    throw new Error('path needs to be specified as string');
  }

  path = require('path');

  childProcess = childP.fork(path.resolve(base, options.path), {cwd: path.resolve(base, options.cwd)});

  controls = {
    destroy: function(force){

      if(force === true){
        childProcess.kill('SIGKILL');
      }else if(childProcess !== null){
        childProcess.kill('SIGINT');
      }
    }
  };

  childProcess.on('message', function(message) {

    if(message === 'server-control-online'){
      console.log('server ready to accept calls');

      options.onOnline(controls);
    }
  });

  childProcess.on('close', function (code, signal) {
    childProcess = null;//just in case

    console.log('child process exited with code ' + code + ' and signal ' + signal);

    options.onOffline();
  });

  return controls;
}

function onServerReady(serverProcess, gracefulShutdownCallback){
  var isChildProcess;

  isChildProcess = !!serverProcess.send;

  if(isChildProcess){
    serverProcess.on('message', function(message) {

      if (message === 'shutdown') {
        console.log('server shutting down');

        if(typeof gracefulShutdownCallback === 'function'){
          gracefulShutdownCallback();
        }else{
          serverProcess.exit(1);
        }
      }
    });

    serverProcess.send('server-control-online');
  }
}

function attachShutdownCallback(serverProcess, gracefulShutdownCallback){
  var isChildProcess;

  isChildProcess = !!serverProcess.send;

  if(isChildProcess){
    serverProcess.on('message', function(message) {

      if (message === 'shutdown') {
        console.log('server shutting down');

        if(typeof gracefulShutdownCallback !== 'function'){
          throw new Error('gracefulShutdownCallback must be a function');
        }

        gracefulShutdownCallback();
      }
    });
  }
}

module.exports = {
  create: create,
  serverReady: onServerReady,
  attachShutdownCallback: attachShutdownCallback
};