/* 
* @Author: Ron Chen
* @Date:   2016-02-22 09:31:52
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-23 13:48:25
*/

var Category  = require("../models/category")

exports.new = function(req,res){
	res.render('admin/category/new',{
		title: "iMovie 详情页"
	})
}

exports.save = function(req,res){
	var _category = req.body.category
	var category = new Category(_category)
	category.save(function(err,category){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/category/list');
	})
}

exports.list = function(req,res){
	Category.fetch(function(err,categories){
		res.render('admin/category/list',{
			title: "iMovie 分类列表页",
			categories : categories
		})
	})
}