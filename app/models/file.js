/* 
* @Author: Ron Chen
* @Date:   2016-02-18 15:07:04
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-18 15:07:48
*/

// 文件入库操作
var mongoose    = require('mongoose');
var FileSchema = require("../schemas/file");

var File       = mongoose.model('files',FileSchema)

module.exports  = File