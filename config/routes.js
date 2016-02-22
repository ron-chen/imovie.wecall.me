/* 
* @Author: Ron Chen
* @Date:   2016-02-20 17:07:01
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-20 17:18:02
*/


// 调用模型
var _          = require('underscore')
var multer     = require('multer')

var Movie = require("../models/movie")
var File  = require("../models/file")
var User  = require("../models/user")

// 多文件上传存储处理
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
  	cb(null, Date.now() + '-' + file.originalname);
  }
})
var upload     = multer({ storage: storage });
var uploadtype = upload.array('stills', 5)

module.exports = function(app){
	app.get("/",function(req,res) {
		
		var _user = req.session.user
		if (_user) {
			app.locals.user = _user
		}
		res.render('movie/index',{
			title: "iMovie 首页"
		})
	})

	/*
	* 用户模块
	*/
	app.post('/user/signup',function(req,res){
		var _user = req.body.user
		console.log(_user)
		// 用户名重复判断
		User.findByName(_user.name,function(err,user){
			if (err) {
				console.log(err)
			}
			if (user) {
				res.redirect('/')	
			}else{
				var user = new User(_user)
				user.save(function(err,user){
					if (err) {
						console.log(err)
					}
					res.redirect('/admin/userlist')
				})
			}
		})	
	})
	/*
	* 用户列表
	*/
	app.get('/admin/userlist',function(req,res){
		User.fetch(function(err,users){
			if (err) {
				console.log(err)
			}
			res.render('admin/user/list',{
				title : "会员列表",
				users : users
			})
		})
	})

	// 登录
	app.post('/user/signin',function(req,res){
		var _user = req.body.user

		User.findByName(_user.name,function(err,user){
			if (err) {
				console.log(err)
			}
			if (!user) {
				res.redirect('/')
			}
			// 验证密码正确性
			user.comparePassword(_user.password,function(err,isMatch){
				if (err) {
					console.log(err)
				}
				if (isMatch) {
					req.session.user = user
					console.log('success')
					res.redirect('/')
				}else{
					console.log('password is wrong!')
				}
			})

		})
	})

	/*
	* 电影详情页
	*/
	app.get("/user/logout",function(req,res) {
		delete req.session.user
		delete app.locals.user
		
		res.redirect('/')
	})

	/*
	* 电影详情页
	*/
	app.get("/movie/detail/:id",function(req,res) {
		var id = req.params.id;
		// 解决外部地址没有，会出现多一次请求的问题 src 地址 会变成 /movie/detail/undefined 代码报错
		if (id !== "undefined") {
			Movie.findById(id,function(err,movie){
				res.render('movie/detail',{
					title: "iMovie 详情页",
					movie: movie
				})
			})
		}
	})

	/*
	* 影片数据更新
	*/
	app.get("/admin/edit/:id",function(req,res){
		var id = req.params.id
		
		if (id) {
			Movie.findById({_id:id},function(err,movie){
				res.render('movie/admin',{
					title: "iMovie 后台更新页面",
					movie: movie
				})
			})
		}
	})

	/*
	* 电影后台录入页
	*/
	app.get("/admin/movie",function(req,res) {
		res.render('movie/admin',{
			title: "iMovie 后台录入页面",
			movie:{
				name         : '',
				alias        : '',
				writers      : '',
				directors    : '',
				actors       : '',
				country      : '',
				formats      : '',
				types        : '',
				language     : '',
				duration     : '',
				summary      : '',
				story        : '',
				introduction : '',
				stills       : '',
				image        : '',
				prevueVideo  : '',
				video        : '',
				showDate     : '',
				score        : ''
			}
		})
	})

	/*
	* 后台录入数据提交
	*/
	app.post("/admin/movie/new",function(req,res){
		var id = req.body.movie._id
		var movieObj = req.body.movie
		var _movie
		
		if (id !== "undefined") {
			Movie.findOne(id,function(err,movie){
				if (err) {
					console.log(err);
				}
				_movie = _.extend(movie,movieObj);
				_movie.save(function(err,movie){
					if (err) {
						console.log(err)
					}
					res.redirect('/movie/detail/'+movie._id)
				})
			})
		}else{
			_movie = new Movie({
				name         : movieObj.name,
				alias        : movieObj.alias,
				writers      : movieObj.writers,
				directors    : movieObj.directors,
				actors       : movieObj.actors,
				country      : movieObj.country,
				formats      : movieObj.formats,
				types        : movieObj.types,
				language     : movieObj.language,
				duration     : movieObj.duration,
				summary      : movieObj.summary,
				story        : movieObj.story,
				introduction : movieObj.introduction,
				stills       : movieObj.stills,
				image        : movieObj.image,
				prevueVideo  : movieObj.prevueVideo,
				video        : movieObj.video,
				showDate     : movieObj.showDate,
				score        : movieObj.score
			})
			_movie.save(function(err,movie){
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/detail/' + movie._id )
			})
		}
	})

	/*
	* 电影后台录入页
	*/
	app.get("/movie/list",function(req,res) {
		Movie.fetch(function(err,movies){
			if (err) {
				console.log(err)
			}
			
			res.render('movie/list',{
				title : "iMovie 列表页",
				movies: movies
			})
		})
	})

	/*
	* 后台数据删除操作
	*/
	app.delete('/admin/list',function(req,res){
		var id = req.query.id

		if (id) {
			Movie.remove({_id:id},function(err,movie){
				if (err) {
					console.log(err)
				}else{
					res.json({success:1})
				}
			})
		}
	})

	// 测试表单提交
	// app.get("/form",function(req,res){
	// 	res.render('movie/form',{

	// 	})
	// })

	app.post("/file/findbymaster",function(req,res){
		// var id = req.query.id
		// if(id){
			File.fetch(function(err,files){
				if (err) {
					console.log(err)
				}
				var myfiles = new Array();
				for (var i = files.length - 1; i >= 0; i--) {
					myfiles.push({id:files[i]._id,name:files[i].name,type:files[i].mimetype,url:"http://localhost:3000/uploads/"+files[i].filename,size:files[i].size});
				}
				res.json(myfiles);
			})
		// }
	})


	app.post("/upload",uploadtype,function(req,res){
		_file = new File({
			name       : req.files[0].originalname,
			encoding   : req.files[0].encoding,
			mimetype   : req.files[0].mimetype,
		    destination: req.files[0].destination,
		    filename   : req.files[0].filename,
		    path       : req.files[0].path,
		    size	   : req.files[0].size,
		})
		_file.save(function(err,file){
			if (err) {
				console.log(err)
			}
			res.json({id:file._id});
		})
	})

	app.delete("/upload/del",function(req,res){
		var id = req.query.id
		if (id) {
			File.remove({_id:id},function(err,file){
				if (err) {
					console.log(err)
				}else{
					res.json({success:1})
				}
			})
		}
	})
}
