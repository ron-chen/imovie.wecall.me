/* 
* @Author: Ron Chen
* @Date:   2016-02-23 14:18:37
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-23 21:22:13
*/


var Country  = require("../models/country")

exports.new = function(req,res){
	res.render('admin/country/new',{
		title: "iMovie 详情页"
	})
}

exports.save = function(req,res){
	var _country = req.body.country
	var country = new Country(_country)
	country.save(function(err,country){
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/country/list');
	})
}

exports.list = function(req,res){
	Country.fetch(function(err,countries){
		res.render('admin/country/list',{
			title: "国家分类列表",
			countries : countries
		})
	})
}

exports.movielist = function(req,res){
	Country.fetch(function(err,countries){
		var countryArr = new Array()
		for (var i = 0; i < countries.length; i++) {
			countryArr.push({id:countries[i]._id,text:countries[i].name})
		}
		res.json(countryArr)
	})
}