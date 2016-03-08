/* 
* @Author: Ron Chen
* @Date:   2016-02-16 20:55:23
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 21:33:18
*/

var mongoose = require('mongoose');
var Schema   = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
	name       : String,
	alias      : String,
	writers    : String,
	directors  : String,
	actors     : String,
	country    : [{
		type : ObjectId,
		ref  : 'countries'
	}],
	formats    : [{
		type : ObjectId,
		ref  : 'formats'
	}],
	category   : [{
		type : ObjectId,
		ref  : 'categories'
	}],
	language   : [{
		type : ObjectId,
		ref  : 'languages'
	}],
	duration   : String,
	summary    : String,
	story      : String,
	introduction : String,
	stills       : {
		type : ObjectId,
		ref  : 'files'
	},
	image        : [{
		type : ObjectId,
		ref  : 'files'
	}],
	prevueVideo  : String,
	video        : String,
	showDate     : String,
	score        : String,
	// 排序值
	iorder       : {
		type  : Number,
		default : 0
	},
	// 浏览量
	pvcount      : {
		type  : Number,
		default : 0
	},
	stars        : String, 
	schedule_url : String,
	source_id    : String
});

MovieSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findById : function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb);
	},
	fetchByInfo : function(cb){
		return this
			.find({})
			.populate('stills','key')
			.populate('country','name')
			.populate('language','name')
			.populate('category','name')
			.populate('formats','name')
			.exec(cb);
	},
	findByInfo: function(id,cb){
		return this
			.findOne({_id:id})
			.populate('stills','key')
			.populate('country','name')
			.populate('language','name')
			.populate('category','name')
			.populate('formats','name')
			.exec(cb);
	},
	findBySource : function(source,cb){
		return this
			.findOne({source_id:source})
			.populate('stills','key')
			.populate('country','name')
			.populate('language','name')
			.populate('category','name')
			.populate('formats','name')
			.exec(cb);
	},
	countBySource : function(source,cb){
		return this.where({source_id:source}).count(cb);
	},
	fetchSortByIOrder : function(cb){
		return this
			.find({})
			.populate('stills','key')
			.populate('country','name')
			.populate('language','name')
			.populate('category','name')
			.populate('formats','name')
			.sort({iorder:-1,pvcount:-1})
			.exec(cb);
	},
	// 获取当前最大的排序值
	getMaxSort : function(cb){
		return this
			.find({},{iorder:1,name:1})
			.sort({iorder:-1,pvcount:-1})
			.limit(1)
			.exec(cb);
	}
}

module.exports = MovieSchema


