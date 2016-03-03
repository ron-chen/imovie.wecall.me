/* 
* @Author: Ron Chen
* @Date:   2016-02-20 21:32:20
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-20 22:52:11
*/

// 用户模块的控制器
var User  = require("../models/user")

exports.showup = function(req,res){
	res.render('user/signup',{
		title : "会员注册页面"
	})
}
exports.showin = function(req,res){
	res.render('user/signin',{
		title : "会员登录页面"
	})
}

/*
* 用户注册
*/
exports.signup  = function(req,res){
	var _user = req.body.user
	// 用户名重复判断
	User.findByName(_user.name,function(err,user){
		if (err) {
			console.log(err)
		}
		if (user) {
			res.redirect('/signup')
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
}
/*
* 用户列表
*/
exports.list = function(req,res){
	User.fetch(function(err,users){
		if (err) {
			console.log(err)
		}
		res.render('admin/user/list',{
			title : "会员列表",
			users : users
		})
	})
}

// 登录
exports.signin = function(req,res){
	var _user = req.body.user

	User.findByName(_user.name,function(err,user){
		if (err) {
			console.log(err)
		}
		if (!user) {
			res.redirect('/signup')
		}
		// 验证密码正确性
		user.comparePassword(_user.password,function(err,isMatch){
			if (err) {
				res.redirect('/signin')
			}
			if (isMatch) {
				req.session.user = user
				console.log('success')
				res.redirect('/')
			}else{
				res.redirect('/signin')
			}
		})
	})
}

/*
* 退出登录
*/
exports.logout = function(req,res) {
	delete req.session.user
	// delete app.locals.user
	
	res.redirect('/')
}


//  添加中间件 
exports.signinRequired = function(req,res,next){
	var user = req.session.user

	if (!user) {
		return res.redirect('/signin')
	}

	next()
}

exports.adminRequired = function(req,res,next){
	var user = req.session.user

	if (user.role <= 10) {
		return res.redirect('/signin')
	}
	next()
}


