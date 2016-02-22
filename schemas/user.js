/* 
* @Author: Ron Chen
* @Date:   2016-02-19 23:18:16
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-20 16:12:49
*/


var mongoose = require('mongoose');
// 加密
var bcrypt   = require('bcrypt');

var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
	name       : {
		unique : String,
		type   : String
	},
	password   : String
});

UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)
		
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        if (err) return next(err)
	        user.password = hash
	    	next()
	    });
	});
})

// 实例方法
UserSchema.methods = {
	comparePassword : function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if (err) return cb(err)

			cb(null,isMatch)
		})
	}
}

// 模型方法
UserSchema.statics = {
	fetch : function(cb){
		return this.find({},cb);
	},
	findByName : function(name,cb){
		return this.findOne({name:name},cb);
	},
	findById : function(id,cb){
		return this.findOne({_id:id},cb);
	}
}

module.exports = UserSchema