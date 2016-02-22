/* 
* @Author: Ron Chen
* @Date:   2016-02-18 15:08:05
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-19 17:00:16
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
    createtime : {
		type    : Date,
		default : Date.now()
	}
});


FileSchema.statics = {
	fetch : function(cb){
		return this.find({},{name:1,size:1,mimetype:1,filename:1},cb);
	}
}

module.exports = FileSchema