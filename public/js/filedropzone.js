/* 
* @Author: Ron Chen
* @Date:   2016-02-17 21:47:52
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-25 09:24:13
*/
$(function(){
	Dropzone.autoDiscover = false;
	// 海报上传
	$("#stilldropzone").dropzone({
		url: "/upload",
		paramName: "stills",
		maxFiles : 20,
		thumbnailWidth :120,
		thumbnailHeight:120,
		addRemoveLinks : true,
		dictRemoveFile : "删除",
		dictDefaultMessage :"",
		dictResponseError  : '上传失败！',
		dictFallbackMessage: "你的浏览器不支持！",
		dictFileTooBig  : "上传文件大小不能超过256MB",
		dictCancelUpload: "取消上传",
        dictCancelUploadConfirmation: "你确定要取消上传操作吗？",
      	dictMaxFilesExceeded: "文件数量超过上限",
      	init : function(){
      		// 初始化已经上传的图片
      		var myDropzone = this;
      		$.ajax({
      			type: 'POST',
      			url : '/file/findbymaster'
      		})
      		.done(function(res){
      			if (res.length > 0) {
      				for (var i = 0; i < res.length; i++) {
      					var mockFile = res[0];
      					myDropzone.emit("addedfile", mockFile);
      					mockFile._removeLink.id = res[0].id;
      					myDropzone.emit("thumbnail", mockFile, mockFile.url);
      					myDropzone.files.push(mockFile);
      				}
      				$("div.dz-image > img").css({"width":"120px","height":"120px"});
      			}
      		});
      		
      		this.on("success", function(file,data) {
      			file._removeLink.id = data.id
      			
      			// 添加海报的隐藏域
      			if ($("#stillfile").length > 0) {
      				var stillValue = $("#stillfile").val();
      				$("#stillfile").val(stillValue + "," + data.id);
				}else{
					$('<input>').attr({
						id    : "stillfile",
						type  : 'hidden' ,
						name  : "movie[still]",
						value : data.id
					}).appendTo("#movieForm");
				}

	        });
      		this.on("removedfile", function(file) {
      			var id = file._removeLink.id
	            $.ajax({
					type : 'DELETE',
					url  : '/upload/still/del?id=' + id
				})
				.done(function(res){
					if (res.success == 1) {
						location.reload();
					}
				})
	        });
      	}
	});

	var data = [{ id: 0, text: '中国' }, { id: 1, text: '韩国' }, { id: 2, text: '日本' }, { id: 3, text: '美国' }, { id: 4, text: '英国' }];
	
	// 影片发行国家
	$("#selcountry").select2({
		data: data
	});

	// 影片格式
	$("#selformat").select2({
		tags: true,
		placeholder: "请选择",
		allowClear: true
	});

	// 影片类型
	$("#seltype").select2({
		tags: true,
		placeholder: "请选择",
		allowClear: true
	});
})