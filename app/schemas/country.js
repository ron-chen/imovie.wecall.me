/* 
* @Author: Ron Chen
* @Date:   2016-02-23 14:16:07
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 21:24:00
*/

var mongoose = require('mongoose')
var Schema   = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CountrySchema = new Schema({
	movies	: [
		{ type: ObjectId,ref : 'movies' }
	],
	name    : String ,
	shortname : String
});

CountrySchema.statics = {
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
	},
	countByName:function(name,cb){
		return this.where({name:name}).count(cb);
	},
	findByName:function(name,cb){
		return this.find({name:name}).limit(1).exec(cb);
	}
}

module.exports = CountrySchema