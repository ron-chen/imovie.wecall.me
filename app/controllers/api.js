/* 
* @Author: Ron Chen
* @Date:   2016-02-25 09:18:26
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 12:16:43
*/

var request = require('request');

var Movie    = require("../models/movie")
var Category = require("../models/category")
var Country  = require("../models/country")
var Actor    = require("../models/actor")
var File     = require("../models/file")

//  公共的 API 处理
//  豆瓣

var DOUBANHOST = "https://api.douban.com"

exports.douban = function(req,res){
	 res.render('admin/api/douban',{
        title: "iMovie API页"
    })
}

// 电影详情处理
exports.subject = function(req,res){
    var id = req.params.movieid

    request.get(
        {
            url: DOUBANHOST + "/v2/movie/subject/" + id,
            encoding:'utf8'
        },
        function(error, response, body){
            if (response) {
                 if(response.statusCode == 200){
                    var data  = JSON.parse(body);
                    // 处理分类
                    if (data.genres && data.genres.length > 0) {
                        for (var i = 0; i < data.genres.length; i++) {
                            // 闭包的应用 循环中的异步调用问题
                            (function(num){
                                var genresname = data.genres[num];
                                Category.countByName(genresname,function(err,count){
                                    if (!count) {
                                        // 不存在
                                        var category = new Category({
                                            name : genresname,
                                            movie : []
                                        })
                                        category.save(function(err,category){
                                            if (err) {
                                                console.log(err)
                                            }
                                            console.log(genresname + " 插入成功!")
                                        })
                                    }
                                })
                            })(i);
                        }
                    }

                    // 处理国家
                    if (data.countries && data.countries.length > 0){
                        for (var j = 0; j < data.countries.length; j++) {
                            (function(j_num){
                                var countryname = data.countries[j_num];
                                Country.countByName(countryname,function(err,count){
                                    if (!count) {
                                        // 不存在
                                        var country = new Country({
                                            name : countryname,
                                            shortname:'',
                                            movie : [],
                                        })
                                        country.save(function(err,country){
                                            if (err) {
                                                console.log(err)
                                            }
                                            console.log(countryname + " 插入成功!")
                                        })
                                    }else{
                                        console.log(countryname + " 已经存在!")
                                    }
                                })
                            })(j);
                        }
                    }

                    // 处理演员
                    var strcasts = ""
                    var arrcasts = new Array();

                    if (data.casts && data.casts.length > 0) {
                        for (var k = 0; k < data.casts.length; k++) {
                            (function(k_num){
                                var source_id = data.casts[k_num].id
                                var avatars_img = "";
                                var avatars_name = "";
                                if (avatars_name) {
                                    avatars_name = data.casts[k_num].name;
                                }
                                if (data.casts[k_num].avatars) {
                                    avatars_img = data.casts[k_num].avatars.small;
                                }

                                Actor.countBySource(avatars_name,source_id,function(err,count){
                                    if (!count) {
                                        // 不存在
                                        var actor = new Actor({
                                            name : avatars_name,
                                            photo: avatars_img,
                                            constellation:"",
                                            professional:"演员",
                                            hometown:"",
                                            sex:"",
                                            source_id:source_id
                                        })
                                        actor.save(function(err,actor){
                                            if (err) {
                                                console.log(err)
                                            }
                                            console.log(actor.name + " 插入成功!")
                                        })
                                    }else{
                                        console.log(data.casts[k_num].name + "已经存在！")
                                    }
                                })
                            })(k);
                            arrcasts.push(data.casts[k].name);
                        }
                        strcasts = arrcasts.join("/")
                    }

                    // 处理导演
                    var strdirectors = "" ;
                    var arrdirectors = new Array();
                    if (data.directors && data.directors.length > 0) {
                        for (var dir_item = 0; dir_item < data.directors.length; dir_item++) {
                            (function(dir_num){
                                var source_id = data.directors[dir_num].id
                                Actor.countBySource(source_id,function(err,count){
                                    if (!count) {
                                        // 不存在
                                        var actor = new Actor({
                                            name : data.directors[dir_num].name,
                                            photo: data.directors[dir_num].avatars.small,
                                            constellation:"",
                                            professional:"演员",
                                            hometown:"",
                                            sex:"",
                                            source_id:source_id
                                        })
                                        actor.save(function(err,actor){
                                            if (err) {
                                                console.log(err)
                                            }
                                            console.log(actor.name + " 插入成功!")
                                        })
                                    }else{
                                        console.log(data.directors[dir_num].name + "已经存在！")
                                    }
                                })
                            })(dir_item);
                            arrdirectors.push(data.directors[dir_item].name)
                        }
                        strdirectors = arrdirectors.join("/");
                    }

                    // 图片处理
                    if ( data.images ) {
                        var imagename = data.title
                        var imagepath = data.images.small
                        File.countByNameAndPath(imagename,imagepath,function(err,count){
                            if (!count) {
                                // 不存在
                                var file = new File({
                                    name : imagename,
                                    destination:"豆瓣影片图片",
                                    key:imagepath,
                                    category:"movie_still_douban",
                                    isshow:1
                                })
                                file.save(function(err,file){
                                    console.log(file.name + "插入成功!")
                                })
                            }else{
                                console.log(imagename + "已经插入!")
                            }
                        })
                    }
                    var aliasStr = ""
                    if (data.original_title) {
                        aliasStr = data.original_title
                    }
                    if (data.aka && data.aka.length > 0) {
                        aliasStr = aliasStr + "," + data.aka.join(",");
                    }

                    // 处理影片
                    var _movie = new Movie({
                        name         : data.title,
                        alias        : aliasStr,
                        writers      : "",
                        directors    : strdirectors,
                        actors       : strcasts,
                        category     : [],
                        country      : [],
                        formats      : [],
                        language     : [],
                        duration     : "",
                        summary      : "",
                        story        : "",
                        introduction : data.summary,
                        prevueVideo  : "",
                        video        : "",
                        showDate     : data.year,
                        score        : data.rating.average,
                        iorder       : 1,
                        pvcount      : data.wish_count,
                        schedule_url : data.schedule_url,
                        stars        : data.rating.stars,
                        source_id    : data.id
                    })

                    // 判断是否存在
                    Movie.countBySource(data.id,function(err,count){

                        if (!count) {
                            // 插入
                            _movie.save(function(err,movie){
                                if (err) {
                                    console.log(err)
                                }
                                var movie_id = movie._id;
                                
                                // 同步更新分类
                                if (data.genres && data.genres.length > 0) {
                                    for (var gen_item = 0; gen_item < data.genres.length; gen_item++) {
                                        // 闭包的应用 循环中的异步调用问题
                                        (function(gen_num){
                                            var genresname = data.genres[gen_num];
                                            Category.findByName(genresname,function(err,category){
                                                var _category = category[0]
                                                if (_category.movies.indexOf(movie_id) == -1) {
                                                    _category.movies.push(movie_id)
                                                    _category.save(function(err,category){
                                                        console.log(category)
                                                    })
                                                }

                                                Movie.findById(movie_id,function(err,movie){
                                                    if (movie.category.indexOf(_category._id) == -1) {
                                                        movie.category.push(_category._id)
                                                        movie.save(function(err,movie){
                                                            console.log(movie)
                                                        })
                                                    }
                                                })
                                            })
                                        })(gen_item);
                                    }
                                }
                                // 同步更新国家
                                if (data.countries && data.countries.length > 0){
                                    for (var cou_item = 0; cou_item < data.countries.length; cou_item++) {
                                        (function(cou_num){
                                            var countryname = data.countries[cou_num];
                                            Country.findByName(countryname,function(err,country){
                                                var _country = country[0]
                                                if (_country.movies.indexOf(movie_id) == -1) {
                                                    _country.movies.push(movie_id)  
                                                    _country.save(function(err,country){
                                                        console.log(country)
                                                    })
                                                }
                                                Movie.findById(movie_id,function(err,movie){
                                                    if (movie.country.indexOf(_country._id) == -1) {
                                                        movie.country.push(_country._id)
                                                        movie.save(function(err,movie){
                                                            console.log(movie)
                                                        })
                                                    }
                                                })
                                            })
                                        })(cou_item);
                                    }
                                }
                                // 同步更新海报
                                 if ( data.images ) {
                                    var imagename = data.title
                                    var imagepath = data.images.small
                                    File.findByNameAndPath(imagename,imagepath,function(err,file){
                                        Movie.findById(movie_id,function(err,movie){
                                            movie.stills = file[0]._id
                                            movie.save(function(err,movie){
                                                console.log(movie)
                                            })
                                        })
                                    })
                                }

                                // 同步更新演员 和 导演  todo :转化成为数组形式存储
                                res.json({code:200,msg:"同步成功",pv:data.wish_count})
                            })
                        }else{
                            // 更新经常变化的数据
                            Movie.findBySource(data.id,function(err,movie){
                                movie.pvcount = data.wish_count
                                movie.stars = data.rating.stars
                                movie.score = data.rating.average
                                movie.save(function(err,movie){
                                    res.json({code:100,msg:"已同步",pv:movie.pvcount})
                                })
                            })
                        }
                    })
                }else{
                    console.log(response.statusCode);
                }
            }else{
                res.json({title:"500",msg:"正在热映接口请求异常"});
            }
        }
    );
}

// 数据处理
exports.theater = function(req,res){
    var page  = req.query.page
    var city  = req.query.city
    
    var count = 50
    var start = 0 
    if (page) {
        start = (page - 1) * count + 1    
    }
    request.get(
        {
            url: DOUBANHOST + "/v2/movie/in_theaters?city='" + city + "'&start=" + start + "&count=" + count,
            encoding:'utf8'
        },
        function(error, response, body){
            if (response) {
                 if(response.statusCode == 200){
                    res.json(JSON.parse(body))
                }else{
                    console.log(response.statusCode);
                }
            }else{
                res.json({title:"500",msg:"正在热映接口请求异常"});
            }
           
        }
    );
}