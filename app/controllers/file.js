/* 
* @Author: Ron Chen
* @Date:   2016-02-20 21:39:32
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-27 11:39:03
*/

//  文件处理操作
var qn 		   = require('qn')
var fs         = require('fs')


var File  = require("../models/file")
var config   = require("../../config/config.js")

// 七牛的上传配置
var client = qn.create({
  accessKey: config.qiniu.ACCESS_KEY,
  secretKey: config.qiniu.SECRET_KEY,
  bucket: config.qiniu.BUCKET,
  origin: config.qiniu.ORIGIN
});

// 七牛上传的中间件
exports.qnFileUpload = function(req,res,next){
	var uploadFiles = req.files
	if (uploadFiles.length > 0){
		var filepath = req.files[0].path
		client.upload(fs.createReadStream(filepath), function (err, result) {
			req.stillfile = result.url
			next()
		});
	}else{
		next()
	}
}

exports.findByMasterIds = function(req,res){
	var ids   = req.body.ids
	var idArr = new Array();
	var myfiles = new Array();
	if (ids) {
		idArr = ids.split(",");
	}

	if (idArr.length > 0) {
		File.findByIds(idArr,function(err,files){
			if (err) {
				console.log(err)
			}
			for (var i = files.length - 1; i >= 0; i--) {
				myfiles.push({id:files[i]._id,name:files[i].name,type:files[i].mimetype,url:files[i].key,size:files[i].size});
			}
			res.json(myfiles);
		})
	}
}

exports.uploadStill = function(req,res){
	_file = new File({
		name       : req.files[0].originalname,
		encoding   : req.files[0].encoding,
		mimetype   : req.files[0].mimetype,
	    destination: req.files[0].destination,
	    filename   : req.files[0].filename,
	    path       : req.files[0].path,
	    size	   : req.files[0].size,
	    key        : req.stillfile,
	    category   : "movie_still",
	    isshow     : 1,
	})

	_file.save(function(err,file){
		if (err) {
			console.log(err)
		}
		res.json({id:file._id});
	})
}
// 针对文件的删除 改成模拟删除
exports.delete = function(req,res){
	var id = req.query.id
	if (id) {
		File.findById({_id:id},function(err,file){
			if (err) {
				console.log(err)
			}
			file.isshow = 0
			file.save(function(err,file){
				if (err) {
					console.log(err)
				}
				res.json({success:1})
			})
		})
	}
}