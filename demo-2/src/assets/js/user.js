/*
 * 代理管理模块 2017.04.20
 * author: chengyitong
 */
 var User = (function(){
 	var page = 1,
 		base_url = MS.getBaseUrl();
 	return {
 		// 获取代理列表type:0直接获取；1根据昵称搜索
 		getUserInfo:function(page,type){
 			if (!type) {
 				type = 0;
 			}
 			
 			var username = $.trim($('#username').val());
            $('#username').val(username);
 			if (type == 1 && username == '') {
 				MS.showMsg('请输入代理名称进行搜索');
 				$('#username').focus();
 				return false;
 			}
 			var dataStr = ['page','username'],
 			dataArr = [page,username];
 			MS.goAjax(base_url+'getUserInfo',MS.dataToJson(dataStr,dataArr),User.getUserInfoSuccess);
 		},
 		getUserInfoSuccess:function(res){
 			if (res.errcode == 0){
 				var list = res.data.user_list,
 					size = res.data.size;

 				if (size == 0) {
 					$('#list').html('<p class="nodata-tips">暂无相关代理数据</p>');
 				} else {
 					var table = '<table class="table table-hover" id="list_table"><tr><td>代理名称</td><td>微信openid</td><td>注册时间</td><td>总充值金额</td><td>状态</td><td width="80">操作</td></tr></table>',
 					tr = '',
 					state_arr = ['正常','冻结'],
 					update_state_str = ['冻结','解冻'],
 					update_state_arr = [1,0],
 					update_state_class_arr = ['danger','success']
 					$('#list').html(table);

 					$.each(list,function(i,item){
 						var id = item.id,
 						username = item.username,
 						openid = item.openid,
 						addtime_format = item.addtime_format,
 						total_recharge = item.total_recharge,
 						state = item.state;//0正常1冻结

 						tr += '<tr><td>' + username
 							+ '</td><td>' + openid
 							+ '</td><td>' + addtime_format
 							+ '</td><td>' + MS.moneyFormat(total_recharge)
 							+ '</td><td>' + state_arr[state]
 							+ '</td><td>' + '<span class="label label-' + update_state_class_arr[state] + '" onclick="User.updateUserState(' + id + ',' + update_state_arr[state] + ')">' + update_state_str[state] + '</span>'
 							+ '</td></tr>';
 					});
 					$('#list_table').append(tr);
 				}
 				MS.pager(size,User.getUserInfo);
 			} else {
 				MS.showMsg(res.info);
 			}
 		},
 		// 修改代理状态
 		updateUserState:function(user_id,state){
 			var update_state_str = ['解冻','冻结'],
 			tips = '确定'+update_state_str[state]+'该代理吗？';
 			if (confirm(tips)) {
			$.post(base_url + 'updateUserState',{
	 				user_id:user_id,
	 				state:state
	 			},function(res){
	 				if (res.errcode == 0) {
	 					User.getUserInfo(1);
	 				} else {
	 					MS.showMsg(res.info);
	 				}
	 			},'json');
 			}
 		}
 	}
 }());