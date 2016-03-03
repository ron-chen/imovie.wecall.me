/* 
* @Author: Ron Chen
* @Date:   2016-02-24 18:24:24
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-24 18:35:03
*/
//  养殖场信息表

var mongoose = require('mongoose')
var Schema   = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var FarmsSchema = new Schema({
	name    : String,
	province: {
		type: ObjectId,
		ref : 'province'
	},
	city:{
		type: ObjectId,
		ref : 'city'
	},
	district:{
		type: ObjectId,
		ref : 'distinct'
	},
	address : String,
	area    : String,
	inintroduce : String,
	// 0 未认证 ; 1 认证
	isauth : Number,
	openedtime : String,
	// 0 未注册 ; 1 注册 
	isregister: Number,

});


FarmsSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	}
}

module.exports = FarmsSchema