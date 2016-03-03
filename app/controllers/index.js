/* 
* @Author: Ron Chen
* @Date:   2016-02-20 21:30:54
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 21:26:04
*/

// 首页的控制器
var Category = require('../models/category')
var Movie    = require('../models/movie')

exports.index = function(req,res) {
	Category.fetchIndex(function(err,categories){
		Movie.fetchByInfo(function(err,movies){
			console.log(movies)

			res.render('movie/index',{
				title  : "iMovie 首页",
				categories : categories,
				movies : movies
			})
		})
	})
	
}