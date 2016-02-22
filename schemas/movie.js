/* 
* @Author: Ron Chen
* @Date:   2016-02-16 20:55:23
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-17 10:00:42
*/

var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	name       : String,
	alias      : String,
	writers    : String,
	directors  : String,
	actors     : String,
	country    : String,
	formats    : String,
	types      : String,
	language   : String,
	duration   : String,
	summary    : String,
	story      : String,
	introduction : String,
	stills       : String,
	image        : String,
	prevueVideo  : String,
	video        : String,
	showDate     : String,
	score        : String
});

MovieSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	}
}

module.exports = MovieSchema


