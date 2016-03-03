/* 
* @Author: Ron Chen
* @Date:   2016-02-21 21:04:59
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-21 22:05:38
*/

var Comment  = require("../models/comment")

exports.save = function(req,res){
	var _comment = req.body.comment
	var movieId  = _comment.movie

	console.log(_comment);

	if (_comment.cid) {
		Comment.findById(_comment.cid,function(err,comment){
			var _reply = {
				from : _comment.from,
				to   : _comment.tid,
				content : _comment.content
			}
			comment.reply.push(_reply)
			comment.save(function(err,comment){
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/detail/' + movieId)
			});
		})
	}else{
		var comment = new Comment(_comment)
		comment.save(function(err,comment){
			if (err) {
				console.log(err)
			}
			res.redirect('/movie/detail/' + movieId)
		});
	}
}