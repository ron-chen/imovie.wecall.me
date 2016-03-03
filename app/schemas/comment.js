/* 
* @Author: Ron Chen
* @Date:   2016-02-21 15:48:04
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-21 22:08:36
*/

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
	movie		: { type: ObjectId,ref : 'movies' },
	reply  	: [{
		from 	: {type:ObjectId,ref:'users'},
		to   	: {type:ObjectId,ref:'users'},
		content : String
	}],
	from        : { type : ObjectId,ref : 'users' },
	to          : { type : ObjectId,ref : 'users' },
	content     : String,
	masterId    : String,
	// films + actors
	masterType  : String

});

CommentSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	},
	findByMovie: function(movieId,cb){
		return this
			.find({movie:movieId})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(cb);
	}
}

module.exports = CommentSchema