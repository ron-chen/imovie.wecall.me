/* 
* @Author: Ron Chen
* @Date:   2016-02-20 21:35:54
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-29 11:01:14
*/

//  电影模块
var _        = require('underscore')
var Movie    = require("../models/movie")

var Category = require("../models/category")
var Language = require("../models/language")
var Formats  = require("../models/format")
var Country  = require("../models/country")
var Comment  = require("../models/comment")
var Files    = require("../models/file")

/*
* 电影后台录入页
*/
exports.new = function(req,res) {
	Category.fetch(function(err,categories){
		Language.fetch(function(err,languages){
			Country.fetch(function(err,countries){
				Formats.fetch(function(err,formats){
					// 获取当前最大的排序值:
					Movie.getMaxSort(function(err,maxmovie){
						res.render('admin/movie/new',{
							title: "电影录入",
							categories:categories,
							countries:countries,
							languages:languages,
							formats  : formats,
							stillfiles:"",
							movie:{},
							maxmovie:maxmovie[0]
						})
					})
				})
			})
		})
	})
}

/*
* 后台录入数据提交
*/
exports.add = function(req,res){
	var id = req.body.movie._id
	var movieObj   = req.body.movie
	var stillfileIds = req.body.stillfiles
	var _movie
	var stillfiles  = new Array()
	var stills      = "";
	var imageArr    = new Array();

	// 处理海报 和 宣传图片
	if (stillfileIds) {
		stillfiles = stillfileIds.split(",");
		if (stillfiles.length > 0) {
			stills  = stillfiles[0];
			if (stillfiles.length > 1) {
				stillfiles.splice(0,1)
				imageArr = stillfiles;
			}
		}
	}
	
	if (id) {
		Movie.findOne(id,function(err,movie){
			if (err) {
				console.log(err);
			}
			if (movie) {
				movie = _.extend(movie,movieObj);
				movie.stills = stills;
				movie.image  = imageArr;

				movie.save(function(err,movie){
					if (err) {
						console.log(err)
					}
					res.redirect('/movie/detail/'+id)
				})
			}
		})
	}else{
		_movie = new Movie({
			name         : movieObj.name,
			alias        : movieObj.alias,
			writers      : movieObj.writers,
			directors    : movieObj.directors,
			actors       : movieObj.actors,
			category     : movieObj.category,
			country      : movieObj.country,
			formats      : movieObj.formats,
			language     : movieObj.language,
			duration     : movieObj.duration,
			summary      : movieObj.summary,
			story        : movieObj.story,
			introduction : movieObj.introduction,
			prevueVideo  : movieObj.prevueVideo,
			video        : movieObj.video,
			showDate     : movieObj.showDate,
			score        : movieObj.score,
			iorder       : movieObj.iorder,
			schedule_url : movieObj.schedule_url
		})
		
		if (stillfileIds) {
			_movie.stills = stills
			_movie.image  = imageArr
		}
		var categoryIds = _movie.category
		var languageIds = _movie.language
		var countryIds  = _movie.country
		var formatIds   = _movie.formats

		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}
			var movie_id = movie._id;
			if (categoryIds && categoryIds.length > 0) {
				for (var i = 0; i < categoryIds.length; i++) {
					Category.findById(categoryIds[i],function(err,category){
						category.movies.push(movie_id)

						category.save(function(err,category){
							console.log(category)
						})
					})
				}
			}

			if (languageIds && languageIds.length > 0) {
				for (var i = 0; i < languageIds.length; i++) {
					Language.findById(languageIds[i],function(err,language){
						language.movies.push(movie_id)

						language.save(function(err,language){
							console.log(language)
						})
					})
				}
			}

			if (countryIds && countryIds.length > 0) {
				for (var i = 0; i < countryIds.length; i++) {
					Country.findById(countryIds[i],function(err,country){
						country.movies.push(movie_id)

						country.save(function(err,country){
							console.log(country)
						})
					})
				}
			}

			if (formatIds && formatIds.length > 0) {
				for (var i = 0; i < formatIds.length; i++) {
					Formats.findById(formatIds[i],function(err,format){
						format.movies.push(movie_id)

						format.save(function(err,format){
							console.log(format)
						})
					})
				}
			}

			// 先执行跳转
			res.redirect('/movie/detail/' + movie._id )
		})
	}
}

/*
* 电影详情页
*/
exports.detail = function(req,res) {
	var id = req.params.id;
	
	// 解决外部地址没有，会出现多一次请求的问题 src 地址 会变成 /movie/detail/undefined 代码报错
	if (id !== "undefined") {
		Movie.findByInfo(id,function(err,movie){
			// 处理海报
			movie.stills.key = movie.stills.key;
			// 处理国家
			var arrCountry  = movie.country;
			var countryName = new Array()
			var strcountry  = ""
			// 处理国家
			var arrCategory  = movie.category;
			var categaryName = new Array()
			var strcategary  = ""
			// 处理语言
			var arrLanguage  = movie.language;
			var languageName = new Array()
			var strlanguage  = ""
			
			if (arrCountry && arrCountry.length > 0) {
				for (var i = 0; i < arrCountry.length; i++) {
			 		countryName.push(arrCountry[i].name)
				}
			}

			if (arrCategory && arrCategory.length > 0) {
				for (var i = 0; i < arrCategory.length; i++) {
			 		categaryName.push(arrCategory[i].name)
				}
			}

			if (arrLanguage && arrLanguage.length > 0) {
				for (var i = 0; i < arrLanguage.length; i++) {
			 		languageName.push(arrLanguage[i].name)
				}
			}

			strcountry  = countryName.join(",")
			strcategary = categaryName.join(",")
			strlanguage = languageName.join(",")

			Comment.findByMovie(id,function(err,comments){
				res.render('movie/detail',{
					title: "iMovie 详情页",
					movie: movie,
					comments:comments,
					strcountry:strcountry,
					strcategary:strcategary,
					strlanguage:strlanguage
				})
			})
		})
	}
}

/*
* 影片数据更新
*/
exports.edit = function(req,res){
	var id = req.params.id
	
	if (id) {
		Movie.findById({_id:id},function(err,movie){
			var images = "" , stills = "",stillfiles = ""
			
			if (movie.stills) {
				stillfiles = movie.stills
			}

			if (movie.image.length > 0) {
				if (stillfiles) {
					stillfiles = stillfiles + "," + movie.image.join(",")
				}else{
					stillfiles = movie.image.join(",")
				}
			}
			
			Category.fetch(function(err,categories){
				Language.fetch(function(err,languages){
					Country.fetch(function(err,countries){
						Formats.fetch(function(err,formats){
							// 获取当前最大的排序值:
							Movie.getMaxSort(function(err,maxmovie){
								res.render('admin/movie/new',{
									title: "电影更新",
									categories: categories,
									languages : languages,
									formats   : formats,
									countries : countries,
									stillfiles: stillfiles,
									movie:movie,
									maxmovie  : maxmovie[0]
								})
							})
						})	
					})
				})
			})
		})
	}
}


/*
* 电影后台录入页
*/
exports.list = function(req,res) {
	Movie.fetchSortByIOrder(function(err,movies){
		if (err) {
			console.log(err)
		}
		var data   = new Array()
		
		for (var i = 0; i < movies.length; i++) {
			
			// 处理分类
			var arrCategory  = null;
			var categaryName = new Array()
			var strcategary  = ""
			// 处理国家
			var arrCountry  = null;
			var countryName = new Array()
			var strcountry  = ""

			// 处理分类
			arrCategory = movies[i].category
			if (arrCategory && arrCategory.length > 0) {
				for (var j = 0; j < arrCategory.length; j++) {
					categaryName.push(arrCategory[j].name)
				}
				strcategary = categaryName.join(",");
			}
			// 处理国家
			arrCountry = movies[i].country
			if (arrCountry && arrCountry.length > 0) {
				for (var k = 0; k < arrCountry.length; k++) {
					countryName.push(arrCountry[k].name)
				}
				strcountry = countryName.join(",");
			}

			data.push({
				stills : movies[i].stills.key,
				name   : movies[i].name,
				directors   : movies[i].directors,
				strcategary : strcategary,
				strcountry  : strcountry,
				showDate    : movies[i].showDate,
				pvcount     : movies[i].pvcount,
				source_id   : movies[i].source_id,
				_id         : movies[i]._id
			})
		}

		res.render('admin/movie/list',{
			title : "iMovie 列表页",
			movies: data
		})
	})
}

/*
* 后台数据删除操作
*/
exports.delete = function(req,res){
	var id = req.query.id

	if (id) {
		Movie.findById({_id:id},function(err,movie){
			
			var categoryIds = movie.category
			var languageIds = movie.language
			var countryIds  = movie.country
			var formatIds   = movie.formats
			
			if (categoryIds && categoryIds.length > 0) {
				for (var i = 0; i < categoryIds.length; i++) {
					Category.findById(categoryIds[i],function(err,category){
						var index = category.movies.indexOf(categoryIds[i])
						category.movies.splice(index,1)

						category.save(function(err,category){
							console.log(category)
						})
					})
				}
			}

			if (languageIds && languageIds.length > 0) {
				for (var i = 0; i < languageIds.length; i++) {
					Language.findById(languageIds[i],function(err,language){
						var index = language.movies.indexOf(languageIds[i])
						language.movies.splice(index,1)
						
						language.save(function(err,language){
							console.log(language)
						})
					})
				}
			}

			if (countryIds && countryIds.length > 0) {
				for (var i = 0; i < countryIds.length; i++) {
					Country.findById(countryIds[i],function(err,country){
						var index = country.movies.indexOf(countryIds[i])
						country.movies.splice(index,1)
						
						country.save(function(err,country){
							console.log(country)
						})
					})
				}
			}

			if (formatIds && formatIds.length > 0) {
				for (var i = 0; i < formatIds.length; i++) {
					Formats.findById(formatIds[i],function(err,format){
						var index = format.movies.indexOf(formatIds[i])
						format.movies.splice(index,1)
						
						format.save(function(err,format){
							console.log(format)
						})
					})
				}
			}

			Movie.remove({_id:id},function(err,result){
				if (err) {
					console.log(err)
				}
				res.json(result.result)
			})
		})
	}
}