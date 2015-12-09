/* 
 * @Author: Tomasz Niezgoda
 * @Date: 2015-12-09 21:23:17
 * @Last Modified by: Tomasz Niezgoda
 * @Last Modified time: 2015-12-09 22:21:29
 */
'use strict';

console.log('server starting');

var control = require('../index');
var interval = setInterval(function(){
  console.log('server still running');
}, 1000);

control.serverReady(process, function(){
  clearInterval(interval);
});

console.log('server started');