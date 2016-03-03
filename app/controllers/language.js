/* 
* @Author: Ron Chen
* @Date:   2016-02-23 14:39:17
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-23 21:34:07
*/



var Language  = require("../models/language")

exports.new = function(req,res){
	res.render('admin/language/new',{
		title: "iMovie 详情页"
	})
}

exports.save = function(req,res){
	var _language = req.body.language
	var language = new Language(_language)
	language.save(function(err,language){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/language/list');
	})
}

exports.list = function(req,res){
	Language.fetch(function(err,languages){
		res.render('admin/language/list',{
			title: "语言列表",
			languages : languages
		})
	})
}

exports.movielist = function(req,res){
	var languageArr = new Array()
	Language.fetch(function(err,languages){
		for (var i = 0; i < languages.length; i++) {
			languageArr.push({id:languages[i]._id,text:languages[i].name})
		}
		res.json(languageArr)
	})
}