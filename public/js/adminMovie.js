/* 
* @Author: Ron Chen
* @Date:   2016-02-17 17:57:19
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-17 18:15:12
*/

// 添加删除影片的功能
$(function(){
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		console.log(id)
		var tr = $('.item-id-' +　id)

		$.ajax({
			type : 'DELETE',
			url  : '/admin/list?id=' + id
		})
		.done(function(resaults){
			if (resaults.success == 1) {
				if (tr.length > 0) {
					tr.remove()
				}
			}
		})
	})
})