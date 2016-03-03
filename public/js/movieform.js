/* 
* @Author: Ron Chen
* @Date:   2016-02-23 13:14:18
* @Last Modified by:   Ron Chen
* @Last Modified time: 2016-02-24 13:03:25
*/

$(function(){
	Dropzone.autoDiscover = false;
	// 海报上传
	$("#stilldropzone").dropzone({
		url: "/upload/still",
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
      		var myDropzone = this;
      		
      		// 初始化已经上传的图片
      		if($("#movieId").val()){
      			var ids = $("#stillfile").val();

	      		$.ajax({
	      			type: 'POST',
	      			url : '/file/findbymaster',
	      			data: {ids:ids}
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
      		}

      		this.on("success", function(file,data) {
      			file._removeLink.id = data.id
      			var stillValue = $("#stillfile").val();
      			if (stillValue) {
      				$("#stillfile").val(stillValue + "," + data.id);	
      			}else{
      				$("#stillfile").val(data.id);
      			}
	        });
      		this.on("removedfile", function(file) {
      			var id = file._removeLink.id
	            var stillValue = $("#stillfile").val();
      			var stillArr   = stillValue.split(",");
      			var index      = $.inArray(id, stillArr)
      			
      			if ( index >= 0) {
      				stillArr.splice(index,1);
      				$("#stillfile").val(stillArr.join(","));
      				
      				$.ajax({
						type : 'DELETE',
						url  : '/upload/del?id=' + id
					})
					.done(function(res){
						if (res.success == 1) {
							// location.reload();
						}
					})
      			}
	        });
      	}
	});

	// 影片发行国家
	$("#selCountry").select2({
		tags: true,
		placeholder: "请选择"
	});

	// 影片语言
	$("#selLanguage").select2({
		tags: true,
		placeholder: "请选择"
	});
	
	// 影片格式
	$("#selformat").select2({
		tags: true,
		placeholder: "请选择"
	});

	// 影片类型
	$("#selCategory").select2({
		tags: true,
		placeholder: "请选择"
	});

	//  数据正确性验证
	$('#movieForm').bootstrapValidator({
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh'
		},
		fields : {
			"movie[name]" : {
				group : '.col-md-8',
				validators : {
					notEmpty : {
						message : '电影名称不能为空'
					},
					stringLength : {
						max : 500,
						message : '电影名称太长'
					}
				}
			},

		}
	})

})