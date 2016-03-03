/* 
* @Author: Ron Chen
* @Date:   2016-02-17 17:57:19
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-28 12:22:24
*/

// 添加删除影片的功能
$(function(){
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' +　id)
		
		$.ajax({
			type : 'DELETE',
			url  : '/admin/movie/del?id=' + id
		})
		.done(function(result){
			if (result.ok == 1) {
				if (tr.length > 0) {
					tr.remove()
				}
			}
		})
	})

	$(".syncmovie").click(function(e){
		var syncmovie = $(e.target)
		var source_id  = syncmovie.attr('data-source');
		var movie_id  = syncmovie.attr('data-id');
		var HOST  = "https://api.douban.com/v2/movie/subject/";

		if (source_id) {
			$.ajax({
	  			type: 'GET',
	  			url : '/admin/api/subject/' + source_id,
	  		})
	  		.done(function(data){
	  			//  更新当前行的浏览量
	  			if (data.code == 100) {
	  				$("tr.item-id-"+movie_id + " > th").html(data.pv)
	  			}
	  		});
		}else{
			console.log("数据绑定错误")
		}
	})
})