/* 
* @Author: Ron Chen
* @Date:   2016-02-22 09:28:53
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-22 09:44:55
*/

var mongoose       = require('mongoose');
var CategorySchema = require("../schemas/category");

var Category       = mongoose.model('categories',CategorySchema)

module.exports     = Category