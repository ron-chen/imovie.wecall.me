/* 
* @Author: Ron Chen
* @Date:   2016-02-21 21:01:48
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-21 21:02:31
*/

var mongoose    = require('mongoose');
var CommentSchema = require("../schemas/comment");

var Comment       = mongoose.model('comments',CommentSchema)

module.exports  = Comment