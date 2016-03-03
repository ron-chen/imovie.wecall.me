/* 
* @Author: Ron Chen
* @Date:   2016-02-16 21:12:03
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-17 10:02:35
*/

var mongoose    = require('mongoose');
var MovieSchema = require("../schemas/movie");

var Movie       = mongoose.model('movies',MovieSchema)

module.exports  = Movie