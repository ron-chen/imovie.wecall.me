/* 
* @Author: Ron Chen
* @Date:   2016-02-18 15:08:05
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-27 00:22:11
*/

/*
	name: 'IMG_1344.JPG',
	encoding: '7bit',
	mimetype: 'image/jpeg',
	destination: 'uploads/',
	filename: '1337eeeec1d365e4eb6fef036f8fc724',
	path: 'uploads/1337eeeec1d365e4eb6fef036f8fc724',
	size: 130068
*/


var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
	name       : String,
	encoding   : String,
	mimetype   : String,
    destination: String,
    filename   : String,
    path       : String,
    size	   : Number,
    key        : String,
    //  文件分类上传 movie_still,movie_image,
    category   : String,
    //  状态更新 
    isshow     : Number,
    createtime : {
		type    : Date,
		default : Date.now()
	}
});


FileSchema.statics = {
	fetch : function(cb){
		return this.find({isshow:1},{name:1,size:1,mimetype:1,filename:1,key:1},cb);
	},
	fetchByType : function(category,cb){
		return this.find({isshow:1,category:category},{name:1,size:1,mimetype:1,filename:1,key:1},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	},
	findByIds : function(ids,cb){
		return this.find({_id:{'$in':ids},isshow:1},{name:1,size:1,mimetype:1,filename:1,key:1},cb);
	},
	countByNameAndPath:function(name,path,cb){
		return this.where({name:name,key:path}).count(cb);
	},
	findByNameAndPath:function(name,path,cb){
		return this.find({name:name,key:path}).limit(1).exec(cb);
	}
}

module.exports = FileSchema