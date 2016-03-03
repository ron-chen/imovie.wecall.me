/* 
* @Author: Ron Chen
* @Date:   2016-02-23 14:37:17
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 21:24:32
*/

var mongoose = require('mongoose')
var Schema   = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var LanguageSchema = new Schema({
	movies	: [
		{ type: ObjectId,ref : 'movies' }
	],
	name    : String ,
	enname  : String
});

LanguageSchema.statics = {
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

module.exports = LanguageSchema