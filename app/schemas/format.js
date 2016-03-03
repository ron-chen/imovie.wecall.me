/* 
* @Author: Ron Chen
* @Date:   2016-02-24 11:41:01
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 21:24:26
*/

var mongoose = require('mongoose')
var Schema   = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var FormatSchema = new Schema({
	movies	: [
		{ type: ObjectId,ref : 'movies' }
	],
	name    : String
});

FormatSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	},
	// 首页获取数据
	fetchIndex : function(cb){
		return this
			.find({})
			// .populate({path:"movies",options:{limit:5}})
			.exec(cb);
	}
}

module.exports = FormatSchema