/* 
* @Author: Ron Chen
* @Date:   2016-02-24 12:25:27
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-24 12:26:20
*/

var mongoose       = require('mongoose');
var FormatSchema  = require("../schemas/format");

var Format        = mongoose.model('formats',FormatSchema)

module.exports     = Format