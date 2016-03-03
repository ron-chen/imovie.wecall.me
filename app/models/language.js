/* 
* @Author: Ron Chen
* @Date:   2016-02-23 14:38:31
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-23 14:39:00
*/

var mongoose       = require('mongoose');
var LanguageSchema  = require("../schemas/language");

var Language        = mongoose.model('languages',LanguageSchema)

module.exports     = Language