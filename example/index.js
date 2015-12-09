/* 
 * @Author: Tomasz Niezgoda
 * @Date: 2015-12-09 21:22:56
 * @Last Modified by: Tomasz Niezgoda
 * @Last Modified time: 2015-12-09 22:21:26
 */
'use strict';

var control = require('../index');

console.log('server will be started immediately and stopped after 5 seconds');

var instance = control.create({
  path: './server',
  onOnline: function(instance){
    setTimeout(function(){
      instance.destroy();
    }, 5000);

    console.log('server is online, waiting for timeout');
  },
  onOffline: function(){
    console.log('received exit from server');
  }
});