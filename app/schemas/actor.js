/*
* @Author: Ron Chen
* @Date:   2016-02-26 22:35:49
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-27 01:11:23
*/

var mongoose = require('mongoose')
var Schema   = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var ActorSchema = new Schema({
	name    : String,
	photo   : String,
	constellation : String,
	professional : String,
	hometown     : String,
	sex       : String,
	source_id : String
});

ActorSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	},
	countBySource : function(name,source,cb){
		return this.where({name:name,source_id:source}).count(cb);
	}
}

module.exports = ActorSchema