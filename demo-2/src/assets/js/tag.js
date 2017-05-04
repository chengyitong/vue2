/*
 * 标签管理模块 2017.04.21
 * author: chengyitong
 */
 var Tag = (function(){
 	var base_url = MS.getBaseUrl();
 	return {
 		// 获取标签列表type:0直接获取；1根据名称搜索
        getTagList:function(page,type){
            if (!type) {
                type = 0;
            }
            
            var tag_name = $.trim($('#tag_name').val());
            $('#tag_name').val(tag_name);
            if (type == 1 && tag_name == '') {
                MS.showMsg('请输入标签名称进行搜索');
                $('#tag_name').focus();
                return false;
            }
            var dataStr = ['page','tag_name'],
            dataArr = [page,tag_name];
            MS.goAjax(base_url + 'getTagList',MS.dataToJson(dataStr,dataArr),Tag.getTagListSuccess);
        },
        getTagListSuccess:function(res){
            if (res.errcode == 0){
                var list = res.data.tag_list,
                    size = res.data.size;

                if (size == 0) {
                    $('#list').html('<p class="nodata-tips">暂无相关标签数据</p>');
                } else {
                    var table = '<table class="table table-hover" id="list_table"><tr><td>标签名称</td><td>标签图标链接</td><td>标签背景颜色</td><td>添加时间</td><td width="60">操作</td></tr></table>',
                    tr = '';
                    $('#list').html(table);

                    $.each(list,function(i,item){
                        var id = item.id,
                        tag_name = item.tag_name,
                        icon = item.icon,
                        tag_color = item.tag_color,
                        addtime_format = item.addtime_format;

                        tr += '<tr><td>' + tag_name
                            + '</td><td>' + '<a href="' + icon + '" target="_blank">' + icon + '</a>'
                            + '</td><td>' + tag_color
                            + '</td><td>' + addtime_format
                            + '</td><td>' + '<span data-name="' + tag_name + '" data-color="' + tag_color + '" data-icon="' + icon + '" class="label label-primary" id="updateTagSpan_' + id + '" onclick="Tag.createModalForUpdateTag(' + id + ');">修改</span>'
                            + '</td></tr>';
                    });
                    $('#list_table').append(tr);
                }
                MS.pager(size,Tag.getTagList);
            } else {
                MS.showMsg(res.info);
            }
        },
 		// 点击“添加标签”或“修改”按钮
 		createModalForUpdateTag:function(id){
 			var tips = id == 0 ? '添加' : '修改';
            // 修改
            var tag_name = '',
            tag_color = '',
            icon = '',
            icon_str = '';
            if (id > 0) {
                tag_name = $('#updateTagSpan_' + id).attr('data-name');
                tag_color = $('#updateTagSpan_' + id).attr('data-color');
                icon = $('#updateTagSpan_' + id).attr('data-icon'),
                icon_str = '<div style="margin-top: 20px;"><p style="margin-bottom: 10px;">重新上传图标即可替换已上传的图标</p><a href="' + icon + '" target="_blank"><img src="' + icon + '"></a></div>';
            }
 			var modal = '<div class="modal fade" id="updateTagModal_' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                        + '<div class="modal-content">'
                            + '<div class="modal-header">'
                                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                + '<h4 class="modal-title" id="myModalLabel">' + tips + '标签</h4>'
                            + '</div>'
                            + '<div class="modal-body">'
                                + '<form class="form-inline" action="">'
                                    + '<div class="form-group">'
                                        + '<input class="form-control" id="tag_name_' + id + '" type="text" placeholder="请输入标签名称" value="' + tag_name + '">&nbsp;'
                                        + '<input class="form-control" id="tag_color_' + id + '" type="text" placeholder="标签背景颜色,十六进制" value="' + tag_color + '">&nbsp;'
                                        + '<input class="form-control" id="icon_' + id + '" type="hidden" placeholder="请上传标签图标" value="' + icon + '">&nbsp;'
                                        + '<span id="imgContainer_' + id + '">'
                                            + '<span id="imgUrlBtn_' + id + '">'
                                                + '<span class="btn btn-primary">上传标签图标</span>'
                                            + '</span>'
                                        + '</span>'
                                        + '<div id="icon_str_' + id + '">' + icon_str + '</div>'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                            + '<div class="modal-footer">'
                                + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                + '<button type="button" class="btn btn-success" id="updateTagBtn_' + id + '" onclick="Tag.updateTag(' + id + ');">确定</button>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
            $('body').append(modal);
            $('#updateTagModal_' + id).modal('show');
            $('#updateTagModal_' + id).on('hide.bs.modal',function(){
            	this.remove();
            });
            MS.initQiniuUpload(id);
 		},
 		// 添加或修改标签,id:0添加；>0修改
 		updateTag:function(id){
 			var tag_name = $('#tag_name_' + id).val(),
            icon = $('#icon_' + id).val(),
            tag_color = $('#tag_color_' + id).val();

 			if (tag_name == '') {
 				MS.showMsg('请输入标签名称');
                $('#tag_name_' + id).focus();
 				return false;
 			}
            if (!MS.isHexColor(tag_color)) {
                MS.showMsg('请输入十六进制的标签背景颜色');
                $('#tag_color_' + id).focus();
                return false;
            }
            if (icon == '') {
                MS.showMsg('请上传标签图标');
                return false;
            }
            
            MS.setAttributeDisabled('updateTagBtn_' + id,'正在处理...');
 			$.post(base_url + 'updateTag',{
 				id: id,
                tag_name: tag_name,
                icon: icon,
                tag_color: tag_color
 			},function(res){
                MS.removeAttributeDisabled('updateTagBtn_' + id,'确定');
 				if (res.errcode == 0) {
                    var page = id == 0 ? 1 : window.localStorage.currPage;
 					Tag.getTagList(page);
 					$('#updateTagModal_' + id).modal('hide');
                    $('#updateTagModal_' + id).on('hide.bs.modal',function(){
                        this.remove();
                    });
 					var tips = id == 0 ? '添加' : '修改';
					MS.showMsg(tips + '成功');
 				} else {
 					MS.showMsg(res.info);
 				}
 			},'json');
 		}
 	}
 }());