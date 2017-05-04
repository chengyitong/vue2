/*
 * 内部管理员模块 2017.04.21
 * author: chengyitong
 */
 var Admin = (function(){
 	var page = 1,
 		base_url = MS.getBaseUrl();
 	return {
 		// 获取管理员列表type:0直接获取；1根据姓名搜索
 		getAdminList:function(page,type){
 			if (!type) {
 				type = 0;
 			}
 			var adminname = $.trim($('#adminname').val());
            $('#adminname').val(adminname);
 			if (type == 1 && adminname == '') {
 				MS.showMsg('请输入管理员账号进行搜索');
 				$('#adminname').focus();
 				return false;
 			}
 			var dataStr = ['page','adminname'],
 			dataArr = [page,adminname];
 			MS.goAjax(base_url+'getAdminList',MS.dataToJson(dataStr,dataArr),Admin.getAdminListSuccess);
 		},
 		getAdminListSuccess:function(res){
 			if (res.errcode == 0){
 				var list = res.data.admin_list,
 					size = res.data.size;

 				if (size == 0) {
 					$('#list').html('<p class="nodata-tips">暂无相关管理员数据</p>');
 				} else {
 					var table = '<table class="table table-hover" id="list_table"><tr><td>管理员账号</td><td>添加时间</td><td width="115">操作</td></tr></table>',
 					tr = '';
 					$('#list').html(table);

 					$.each(list,function(i,item){
 						var id = item.id,
 						adminname = item.adminname,
                        addtime = item.addtime,
 						addtime_format = item.addtime_format;

                        var addtime_str = addtime_format == null ? MS.getLocalTime(addtime) : addtime_format;

 						tr += '<tr id="list_table_tr_' + id + '"><td>' + adminname
 							+ '</td><td>' + addtime_str
 							+ '</td><td>' + '<span class="label label-danger" onclick="Admin.delAdmin(' + id + ');">删除</span>' + '<span class="label label-primary" onclick="Admin.createModalForUpdatePwd(' + id + ');">修改密码</span>'
 							+ '</td></tr>';
 					});
 					$('#list_table').append(tr);
 				}
 				MS.pager(size,Admin.getAdminList);
 			} else {
 				MS.showMsg(res.info);
 			}
 		},
        // 点击“添加管理员”按钮
        createModalForAddAdmin:function(){
            var modal = '<div class="modal fade" id="addAdminModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                        + '<div class="modal-content">'
                            + '<div class="modal-header">'
                                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                + '<h4 class="modal-title" id="myModalLabel">添加管理员</h4>'
                            + '</div>'
                            + '<div class="modal-body">'
                                + '<form class="form-inline" action="">'
                                    + '<div class="form-group">'
                                        + '<input class="form-control" id="add_adminname" type="text" placeholder="请输入管理员账号" required>&nbsp;'
                                        + '<input class="form-control" id="add_password" type="password" placeholder="请输入登录密码" required>&nbsp;'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                            + '<div class="modal-footer">'
                                + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                + '<button type="button" class="btn btn-success" onclick="Admin.addAdmin();">确定</button>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
            $('body').append(modal);
            $('#addAdminModal').modal('show');
            $('#addAdminModal').on('hide.bs.modal',function(){
                this.remove();
            });
        },
        // 添加管理员
        addAdmin: function(){
            var adminname = $('#add_adminname').val(),
            password = $('#add_password').val();

            if (adminname == '') {
                MS.showMsg('请输入管理员账号');
                $('#add_adminname').focus();
                return false;
            }
            if (password == '') {
                MS.showMsg('请输入管理员登录密码');
                $('#add_password').focus();
                return false;
            }

            $.post(base_url + 'addAdmin',{
                adminname: adminname,
                password: md5(password)
            },function(res) {
                if (res.errcode == 0) {
                    Admin.getAdminList(1);
                    $('#addAdminModal').modal('hide');
                    $('#addAdminModal').on('hide.bs.modal',function(){
                        this.remove();
                    });
                    MS.showMsg('添加成功');
                } else {
                    MS.showMsg(res.info);
                }
            },'json');
        },
 		// 删除管理员
 		delAdmin:function(id){
 			if (confirm('确定删除该管理员吗？')) {
 				$.post(base_url + 'delAdmin',{
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
 						Admin.getAdminList(page);
 						MS.showMsg('删除成功');
 					} else {
 						MS.showMsg(res.info);
 					}
 				},'json');
 			} 
 		},
 		// 点击“修改密码”按钮
 		createModalForUpdatePwd:function(id){
 			var modal = '<div class="modal fade" id="updatePwdModal_' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                        + '<div class="modal-content">'
                            + '<div class="modal-header">'
                                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                + '<h4 class="modal-title" id="myModalLabel">修改密码</h4>'
                            + '</div>'
                            + '<div class="modal-body">'
                                + '<form class="form-inline" action="">'
                                    + '<div class="form-group">'
                                        + '<input class="form-control" id="password_' + id + '" type="password" placeholder="请输入新密码" required>&nbsp;'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                            + '<div class="modal-footer">'
                                + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                + '<button type="button" class="btn btn-success" onclick="Admin.updateAdminPassword(' + id + ');">确定</button>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
            $('body').append(modal);
            $('#updatePwdModal_' + id).modal('show');
            $('#updatePwdModal_' + id).on('hide.bs.modal',function(){
            	this.remove();
            });
 		},
 		// 修改密码
 		updateAdminPassword:function(id){
 			var password = $('#password_' + id).val();

 			if (password == '') {
 				MS.showMsg('请输入新密码');
 				return false;
 			}
 			$.post(base_url + 'updateAdminPassword',{
 				id: id,
 				password: md5(password)
 			},function(res){
 				if (res.errcode == 0) {
 					Admin.getAdminList(1);
                    $('#updatePwdModal_' + id).modal('hide');
                    $('#updatePwdModal_' + id).on('hide.bs.modal',function(){
                        this.remove();
                    });
					MS.showMsg('密码修改成功');
 				} else {
 					MS.showMsg(res.info);
 				}
 			},'json');
 		}
 	}
 }());