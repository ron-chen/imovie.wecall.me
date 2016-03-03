/* 
* @Author: Ron Chen
* @Date:   2016-02-24 12:26:37
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-24 12:28:30
*/

var Format  = require("../models/format")

exports.new = function(req,res){
	res.render('admin/format/new',{
		title: "iMovie 表单页"
	})
}

exports.save = function(req,res){
	var _format = req.body.format
	var format = new Format(_format)
	format.save(function(err,format){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/format/list');
	})
}

exports.list = function(req,res){
	Format.fetch(function(err,formats){
		res.render('admin/format/list',{
			title: "iMovie 格式列表页",
			formats : formats
		})
	})
}