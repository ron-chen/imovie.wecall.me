/* 
* @Author: Ron Chen
* @Date:   2016-02-25 09:56:10
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 17:55:05
*/

$(function(){
	var ROW  = 45
	var HOST = "https://api.douban.com/v2"
	// 切换城市
	$(".togglecity").on("click",function(e){
		var target = e.target
		$("#defaultcity").attr("target",$(target).attr("data-id")).html($(target).attr("data-target"));
		$('#togglecityModal').modal('hide');
	})

	// 正在热映
	$("#theaters").on('click',function(){
		// get_in_theaters();
		var city  = $("#defaultcity").attr("target");
		var URL   = HOST + "/movie/in_theaters";
		
		$.ajax({
			url: URL + "?city="+city+"&start=0&count="+ROW,
			cache: true,
			type : 'get',
			dataType : "jsonp",
			crossDomain:true,
			jsonp:'callback',
			success:function(data){
				// 加载模板
				$("#in_theaters").html(loadtemplate(data));
				// 绑定同步事件
				bindsyncmovie();
				// 请求完成之后绑定事件
				if (data.total > ROW && data.start <= ROW) {
					loadsurplus("in_theaters");
				}
			}
		})
	});


	// 即将上映 的接口
	$("#coming").on('click',function(){
		var city  = $("#defaultcity").attr("target");
		var URL   = HOST + "/movie/coming_soon";
		$.ajax({
			url: URL + "?city="+city+"&start=0&count="+ROW,
			cache: true,
			type : 'get',
			dataType : "jsonp",
			crossDomain:true,
			jsonp:'callback',
			success:function(data){
				// 加载模板
				$("#coming_soon").html(loadtemplate(data));
				// 绑定同步事件
				bindsyncmovie();
				// 请求完成之后绑定事件
				loadsurplus("coming_soon");
			}
		})
	})



	// 绑定同步电影按钮
	var bindsyncmovie = function(){
		$(".syncmovie").on("click",function(e){
			var syncmovie = $(e.target)
			var _btn = syncmovie.button('...')
			var movie_id  = syncmovie.attr('data-id');
			var HOST  = "https://api.douban.com/v2/movie/subject/";

			if (movie_id) {
				$.ajax({
		  			type: 'GET',
		  			url : '/admin/api/subject/' + movie_id,
		  		})
		  		.done(function(data){
		  			console.log(data)
		  			_btn.button(data.msg)
		  		});
			}else{
				console.log("数据绑定错误")
			}

		})
	}

	// 加载剩余数据
	var loadsurplus = function(action){
		var city  = $("#defaultcity").attr("target");
		var HOST  = "https://api.douban.com/v2/movie/" + action;

		$('.showall').on('click',function(e){
			$("#coming_soon").html("<h3>正在同步数据...</h3>");
			var lastnum  = $(e.target).attr("data-num")
			var start    = ROW + 1;
			$.ajax({
				url: HOST + "?city="+city+"&start="+start+"&count="+lastnum,
				cache: true,
				type : 'get',
				dataType : "jsonp",
				crossDomain:true,
				jsonp:'callback',
				success:function(data){
					switch(action){
						case "coming_soon":
							$("#coming_soon").html(loadtemplate(data));
							bindsyncmovie();
							break;
						default:
							break;
					}
				}
			})
		})

	}



	// 请求正在热映接口
	var get_in_theaters = function(){
		var city = $("#defaultcity").attr("target");
		var currentpage = $("#defaultcity").attr("page");

		$.ajax({
  			type: 'GET',
  			url : '/admin/api/theater?city=' + city + '&page=' + currentpage ,
  		})
  		.done(function(data){
  			// 加载渲染模板
  			var htmldata = loadtemplate(data);
  			$("#in_theaters").html(htmldata);
  		});
  	}

	// 加载模板数据
	function loadtemplate(data){
		var template = "";
		if (data.title == "500") {
			template = "<h3>" + data.msg + "</h3>";
		}else{
			var item = null;
			if (data.total > ROW && data.start <= ROW) {
				template  = "<p>"+ data.title +  "&nbsp; 数据: "+ data.start + " / "+ data.total +"条 <a class='btn btn-default showall' data-num='"+ data.total +"' role='button'>显示剩余数据</a> </p> ";
			}else{
				template  = "<p>"+ data.title +  "&nbsp; 数据: "+ data.start + " / "+ data.total +"条 </p> ";
		    }
		    template += "<table class='table table-striped table-hover'>";
		    template += "  <thead> ";
		    template += "  	<tr> ";
		    template += "  		<th> #   </th>";
		    template += "  		<th> 名称 </th>";
		    template += "  		<th> 类型 </th>";
		    template += "  		<th> 评分 </th>";
		    template += "  		<th> 导演 </th>";
		    template += "  		<th> 演员 </th>";
		    template += "  		<th> 图片 </th>";
		    template += "  	</tr> ";
		    template += "  </thead> ";
		    template += "  <tbody> ";
		   if (data.subjects && data.subjects.length > 0) {
		       for (var i = 0; i < data.subjects.length; i++) {
		       		item = data.subjects[i];
		       		template += "<tr>";
		       		template += "	<th scope='row' > <button type='button' data-id='" + item.id + "' data-loading-text='同步中...' class='btn btn-primary syncmovie' autocomplete='on'> 同步 </button></th>";
		       		template += "	<td>" + item.title + "</td>";
		       		template += "	<td>" + item.genres.join("/") + "</td>";
		       		if (item.rating) {
		       			template += "	<td>最高:<strong>" + item.rating.max + "分</strong>&nbsp; 最低:<strong>"+ item.rating.min + "分</strong>&nbsp; 均分:<strong>" + item.rating.average + "</strong>&nbsp; 星级:<strong>" + item.rating.stars + "</strong></td>";
		       		}else{
		       			template += "<td></td>";
		       		}
		       		// 导演
		       		if (item.directors && item.directors.length > 0) {
						template += "	<td>";
		       			for (var j = 0; j < item.directors.length; j++) {
		       				if (j < 3) {
		       					template += "<a href='"+ item.directors[j].alt +"' target='_blank' > " + item.directors[j].name + "</a> &nbsp; "
		       				}else{
		       					break;
		       				}
		       			}
		       			template += "	</td>";
		       		}else{
		       			template += "	<td></td>";	
		       		}
		       		// 演员
		       		if (item.casts && item.casts.length > 0) {
					template += "	<td>";
		       			for (var k = 0; k < item.casts.length; k++) {
		       				if (k < 3) {
		       					template += "<a href='"+ item.casts[k].alt +"' target='_blank' > " + item.casts[k].name + "</a> &nbsp; "
		       				}else{
		       					break;
		       				}
		       			}
		       			template += "	</td>";
		       		}else{
		       			template += "	<td></td>";	
		       		}
		       		template += "	<td> <a href='"+ item.alt +"' ><img src='"+item.images.small+"'></a></td>";
		       		template += "</tr>";
	       		}	
			}
		    template += "  </tbody> ";
		}

		return template;
	}
})