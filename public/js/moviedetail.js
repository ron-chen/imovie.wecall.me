/* 
* @Author: Ron Chen
* @Date:   2016-02-21 20:57:53
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-21 22:39:59
*/

$(function(){

	$(".comment").click(function(e){
		var target = $(this)
		var commentId   = target.data('cid');
		var toId   = target.data('tid');
		
		if ($("#toId").length > 0) {
			$("#toId").val(toId)
		}else{
			$('<input>').attr({
				id    : "toId",
				type  : 'hidden' ,
				name  : "comment[tid]",
				value : toId
			}).appendTo("#commentForm");
		}

		if ($("#commentId").length > 0) {
			$("#commentId").val(commentId)
		}else{
			$('<input>').attr({
				id    : "commentId",
				type  : 'hidden' ,
				name  : "comment[cid]",
				value : commentId
			}).appendTo("#commentForm");
		}
		
		
	})
})