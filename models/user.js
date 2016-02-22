/* 
* @Author: Ron Chen
* @Date:   2016-02-20 15:31:28
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-20 15:44:07
*/

var mongoose    = require('mongoose');
var UserSchema  = require("../schemas/user");

var User        = mongoose.model('users',UserSchema)

module.exports  = User