/*
 * 充值记录模块 2017.04.20
 * author: chengyitong
 */
 var Recharge = (function(){
 	var page = 1,
 		base_url = MS.getBaseUrl();
 	return {
 		// 获取代理列表type:0直接获取；1根据昵称搜索
 		getRechargeList:function(page,type){
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
 			MS.goAjax(base_url+'getRechargeList',MS.dataToJson(dataStr,dataArr),Recharge.getRechargeListSuccess);
 		},
 		getRechargeListSuccess:function(res){
 			if (res.errcode == 0){
 				var list = res.data.recharge_list,
 					size = res.data.size;

 				if (size == 0) {
 					$('#list').html('<p class="nodata-tips">暂无相关充值记录</p>');
 				} else {
 					var table = '<table class="table table-hover" id="list_table"><tr><td>代理名称</td><td>微信openid</td><td>充值时间</td><td>总充值金额</td><td>状态</td></tr></table>',
 					tr = '',
 					state_arr = ['成功','失败'];
 					$('#list').html(table);

 					$.each(list,function(i,item){
 						var id = item.id,
 						username = item.username,
 						openid = item.openid,
 						addtime_format = item.addtime_format,
 						recharge_money = item.recharge_money,
 						state = item.state;//0成功1失败

 						tr += '<tr><td>' + username
 							+ '</td><td>' + openid
 							+ '</td><td>' + addtime_format
 							+ '</td><td>' + MS.moneyFormat(recharge_money)
 							+ '</td><td>' + state_arr[state]
 							+ '</td></tr>';
 					});
 					$('#list_table').append(tr);
 				}
 				MS.pager(size,Recharge.getRechargeList);
 			} else {
 				MS.showMsg(res.info);
 			}
 		}
 	}
 }());