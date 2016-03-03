/* 
* @Author: Ron Chen
* @Date:   2016-02-20 17:07:01
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-27 11:18:58
*/


// 调用模型
var multer     = require('multer')

// 引用控制器
var Index = require("../app/controllers/index")
var User  = require("../app/controllers/user")
var Movie = require("../app/controllers/movie")
var File  = require("../app/controllers/file")
var Comment   = require("../app/controllers/comment")
var Category  = require("../app/controllers/category")
var Country   = require("../app/controllers/country")
var Language  = require("../app/controllers/language")
var Format    = require("../app/controllers/format")
var Api       = require("../app/controllers/api")

// 多文件上传存储处理
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
  	cb(null, Date.now() + '-' + file.originalname);
  }
})

var upload     = multer({ storage: storage }).array('stills', 5);

module.exports = function(app){

	app.use(function(req,res,next){
		app.locals.user = req.session.user
		
		return next()
	})

	app.get("/", Index.index)
	// 前台电影详情页展示
	app.get("/movie/detail/:id",Movie.detail)
	
	/*
	* 用户模块
	*/
	app.post('/user/signup',User.signup)
	app.post('/user/signin',User.signin)
	app.get("/user/logout",User.logout)
	app.get("/signup",User.showup)
	app.get("/signin",User.showin)
	app.post("/user/comment",User.signinRequired,Comment.save)

	/*
	* 电影后台操作
	*/
	app.get("/admin/movie",User.signinRequired,User.adminRequired,Movie.new)
	app.post("/admin/movie/add",User.signinRequired,User.adminRequired,Movie.add)
	app.get("/admin/movie/edit/:id",User.signinRequired,User.adminRequired,Movie.edit)
	app.get("/admin/movie/list",User.signinRequired,User.adminRequired,Movie.list)
	app.delete('/admin/movie/del',User.signinRequired,User.adminRequired,Movie.delete)
	
	app.get("/admin/category/new",User.signinRequired,User.adminRequired,Category.new)
	app.post("/admin/category/add",User.signinRequired,User.adminRequired,Category.save)
	app.get("/admin/category/list",User.signinRequired,User.adminRequired,Category.list)
	
	app.get("/admin/country/new",User.signinRequired,User.adminRequired,Country.new)
	app.post("/admin/country/add",User.signinRequired,User.adminRequired,Country.save)
	app.get("/admin/country/list",User.signinRequired,User.adminRequired,Country.list)
	
	app.get("/admin/language/new",User.signinRequired,User.adminRequired,Language.new)
	app.post("/admin/language/add",User.signinRequired,User.adminRequired,Language.save)
	app.get("/admin/language/list",User.signinRequired,User.adminRequired,Language.list)
	
	app.get("/admin/format/new",User.signinRequired,User.adminRequired,Format.new)
	app.post("/admin/format/add",User.signinRequired,User.adminRequired,Format.save)
	app.get("/admin/format/list",User.signinRequired,User.adminRequired,Format.list)

	// 用户后台管理操作
	app.get('/admin/userlist',User.signinRequired,User.adminRequired,User.list)
	
	/*
	* 文件操作  添加 七牛文件上传中间件
	*/ 
	app.post("/upload/still",upload,File.qnFileUpload,File.uploadStill)
	app.delete("/upload/still/del",File.delete)
	app.post("/file/findbymaster",File.findByMasterIds)
	
	/*
	*  豆瓣接口
	*/
	app.get("/admin/api/douban",User.signinRequired,User.adminRequired,Api.douban)
	app.get("/admin/api/theater",User.signinRequired,User.adminRequired,Api.theater)
	app.get("/admin/api/subject/:movieid",User.signinRequired,User.adminRequired,Api.subject)
	
}
