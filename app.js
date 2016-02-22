/* 
* @Author: Ron Chen
* @Date:   2016-02-15 21:29:09
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-20 21:22:49
*/

var express    = require('express')
var mongoose   = require('mongoose')
var bodyParser = require('body-parser')
var session    = require('express-session')
var mongoStore = require('connect-mongo')(session)

// var fs         = require('fs')
// var path       = require('path')

var port     = process.env.PORT || 3000
var app      = express()

app.set("views","./views")
app.set("view engine",'jade')

// 引用配置文件
var config   = require("./config.js")
mongoose.connect(config.db.mongodb)

// 直接访问我们的资源即可, public 表示加入资源至引用
app.use(express.static(__dirname+ '/public'))
// 表单提交 name 的数据处理
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'iMovie',
    store : new mongoStore({
    	url : config.db.mongodb,
    	collection : "sessions"
    })
}));

// 配置开发环境的设置
if ('development' === app.get('env')) {
	app.set('showStackError',true)
	// app.use(express.logger(':mehtod :url :status'))
	app.locals.pretty = true
	mongoose.set('debug',true)

}

app.listen(port)

console.log('app listen port: ' + port)

require('./config/routes')(app)

