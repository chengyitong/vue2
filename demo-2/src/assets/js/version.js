/*
 * 版本控制模块 2017.04.28
 * author: chengyitong
 */
 var Version = (function(){
 	var page = 1,
 		base_url = MS.getBaseUrl();
 	return {
 		// 获取版本列表
 		getVersionList:function(page){
 			$.post(base_url + 'getVersionList',{
                page: page
            },function(res){
                if (res.errcode == 0){
                    var list = res.data.version_list,
                        size = res.data.size;

                    if (size == 0) {
                        $('#list').html('<p class="nodata-tips">暂无相关版本控制数据</p>');
                    } else {
                        var table = '<table class="table table-hover" id="list_table"><tr><td>版本号</td><td>版本描述</td><td>下载链接</td><td>添加时间</td><td width="95">操作</td></tr></table>',
                        tr = '';
                        $('#list').html(table);

                        $.each(list,function(i,item){
                            var id = item.id,
                            version_num = item.version_num,
                            version_desc = item.version_desc,
                            version_url = item.url,
                            addtime_format = item.addtime_format;

                            tr += '<tr id="list_table_tr_' + id + '"><td>' + version_num
                                + '</td><td>' + version_desc
                                + '</td><td>' + version_url
                                + '</td><td>' + addtime_format
                                + '</td><td>' + '<span class="label label-danger" onclick="Version.delVersion(' + id + ');">删除</span>' + '<span data-num="' + version_num + '" data-desc=' + version_desc + ' data-url=' + version_url + ' class="label label-primary" id="updateVersionSpan_' + id + '" onclick="Version.createModalForUpdateVersion(' + id + ');">修改</span>'
                                + '</td></tr>';
                        });
                        $('#list_table').append(tr);
                    }
                    MS.pager(size,Version.getVersionList);
                } else {
                    MS.showMsg(res.info);
                }
            },'json');
 		},
 		// 删除版本信息
 		delVersion:function(id){
 			if (confirm('确定删除该版本信息吗？')) {
 				$.post(base_url + 'delVersion',{
 					id: id
 				},function(res){
 					if (res.errcode == 0) {
                        $('#list_table_tr_' + id).remove();
                        var page = window.localStorage.currPage,
                        tr = $('#list_table tr'),
                        tr_len = tr.length;
                        if (tr_len == 1 && page != 1) {
                            page = page - 1;
                        }
 						Version.getVersionList(page);
 						MS.showMsg('删除成功');
 					} else {
 						MS.showMsg(res.info);
 					}
 				},'json');
 			} 
 		},
 		// 点击“添加版本”或“修改”按钮
 		createModalForUpdateVersion:function(id){
 			var tips = id == 0 ? '添加' : '修改',
            version_num = '',
            version_desc = '',
            version_url = '';
            if (id > 0) { // 修改信息
                version_num = $('#updateVersionSpan_' + id).attr('data-num');
                version_desc = $('#updateVersionSpan_' + id).attr('data-desc');
                version_url = $('#updateVersionSpan_' + id).attr('data-url');
            } 
 			var modal = '<div class="modal fade" id="updateVersionModal_' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                        + '<div class="modal-content">'
                            + '<div class="modal-header">'
                                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                + '<h4 class="modal-title" id="myModalLabel">' + tips + '版本信息</h4>'
                            + '</div>'
                            + '<div class="modal-body">'
                                + '<form class="form-inline" action="">'
                                    + '<div class="form-group">'
                                        + '<input type="text" class="form-control" id="version_num_' + id + '" placeholder="请输入版本号" required value="' + version_num + '">&nbsp;'
                                    + '</div>&nbsp;'
                                    + '<div class="form-group">'
                                        + '<input type="text" class="form-control" id="version_desc_' + id + '" placeholder="请输入版本描述" required value="' + version_desc + '" style="width:265px;">&nbsp;'
                                    + '</div>&nbsp;'
                                    + '<div class="form-group">'
                                        + '<input type="url" class="form-control" id="version_url_' + id + '" placeholder="请输入下载链接" required value="' + version_url + '" style="width:265px;">&nbsp;'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                            + '<div class="modal-footer">'
                                + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                + '<button type="button" class="btn btn-success" id="updateVersionBtn_' + id + '" onclick="Version.updateVersion(' + id + ');">确定</button>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
            $('body').append(modal);
            $('#updateVersionModal_' + id).modal('show');
            $('#updateVersionModal_' + id).on('hide.bs.modal',function(){
            	this.remove();
            });
 		},
 		// 添加或修改版本,id:0添加；>0修改
 		updateVersion:function(id){
 			var version_num = $.trim($('#version_num_' + id).val()),
            version_desc = $('#version_desc_' + id).val(),
            version_url = $('#version_url_' + id).val();

 			if (version_num == '') {
 				MS.showMsg('请输入版本号');
                $('#version_num_' + id).focus();
 				return false;
 			}
 			if (version_desc == '') {
 				MS.showMsg('请输入版本描述');
                $('#version_desc_' + id).focus();
 				return false;
 			}
 			if (version_url == '') {
 				MS.showMsg('请输入下载链接');
                $('#version_url_' + id).focus();
 				return false;
 			}
            MS.setAttributeDisabled('updateVersionBtn_' + id,'正在处理...');
 			$.post(base_url + 'updateVersion',{
 				id: id,
 				version_num: version_num,
 				version_desc: version_desc,
 				url: version_url
 			},function(res) {
                MS.removeAttributeDisabled('updateVersionBtn_' + id,'确定');
 				if (res.errcode == 0) {
                    var page = id == 0 ? 1 : window.localStorage.currPage;
 					Version.getVersionList(page);
 					$('#updateVersionModal_' + id).modal('hide');
                    $('#updateVersionModal_' + id).on('hide.bs.modal',function(){
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