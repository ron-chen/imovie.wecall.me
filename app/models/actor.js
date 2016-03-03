/*
* @Author: Ron Chen
* @Date:   2016-02-26 23:29:57
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-26 23:30:36
*/

var mongoose       = require('mongoose');
var ActorSchema    = require("../schemas/actor");

var Actor          = mongoose.model('actors',ActorSchema)

module.exports     = Actor