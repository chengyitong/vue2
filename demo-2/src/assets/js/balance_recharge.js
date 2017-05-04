/*
 * 设置余额充值选项模块 2017.04.21
 * author: chengyitong
 */
 var BalanceRecharge = (function(){
 	var base_url = MS.getBaseUrl();
 	return {
 		// 获取余额充值选项列表
        getRechargeOptionList:function(){
            $.post(base_url + 'getRechargeOptionList',{},function(res){
                if (res.errcode == 0){
                    var list = res.data.option_list;

                    if (list == '' || list == null) {
                        $('#list').html('<p class="nodata-tips">暂无相关余额充值选项</p>');
                    } else {
                        var table = '<table class="table table-hover" id="list_table"><tr><td>排序ID</td><td>充值金额</td><td>优惠金额</td><td>添加时间</td><td width="130">操作</td></tr></table>',
                        tr = '',
                        list_len = list.length;
                        $('#list').html(table);

                        $.each(list,function(i,item){
                            var id = item.id,
                            sort_id = item.sort_id,
                            money = item.money,
                            offer_money = item.offer_money,
                            addtime_format = item.addtime_format;

                            var sort_str = '<span class="label label-primary" id="sort_span_0_' + i + '" data-id="' + id + '" onclick="BalanceRecharge.sortRechargeOption(' + i + ',0);">下移</span><span class="label label-success" id="sort_span_1_' + i + '" data-id="' + id + '" onclick="BalanceRecharge.sortRechargeOption(' + i + ',1);">上移</span>';

                            if (i == 0) {
                                sort_str = '<span class="label label-primary" id="sort_span_0_' + i + '" data-id="' + id + '" onclick="BalanceRecharge.sortRechargeOption(' + i + ',0);">下移</span><span class="fn-hide" id="sort_span_1_' + i + '" data-id="' + id + '"></span>';
                            }
                            if (i == list_len - 1) {
                                sort_str = '<span class="label label-success" id="sort_span_1_' + i + '" data-id="' + id + '" onclick="BalanceRecharge.sortRechargeOption(' + i + ',1);">上移</span><span class="fn-hide" id="sort_span_0_' + i + '" data-id="' + id + '"></span>';
                            }

                            tr += '<tr><td>' + sort_id
                                + '</td><td>' + MS.moneyFormat(money)
                                + '</td><td>' + MS.moneyFormat(offer_money)
                                + '</td><td>' + addtime_format
                                + '</td><td>' + sort_str
                                + '<span class="label label-danger" onclick="BalanceRecharge.delRechargeOption(' + id + ');">删除</span>'
                                + '</td></tr>';
                        });
                        $('#list_table').append(tr);
                    }
                } else {
                    MS.showMsg(res.info);
                }
            },'json');
        },
 		// 删除余额充值选项
        delRechargeOption:function(id){
            if (confirm('确定删除该充值选项吗？')) {
                $.post(base_url + 'delRechargeOption',{
                    id: id
                },function(res){
                    if (res.errcode == 0) {
                        BalanceRecharge.getRechargeOptionList();
                        MS.showMsg('删除成功');
                    } else {
                        MS.showMsg(res.info);
                    }
                },'json');
            } 
        },
 		// 点击“添加充值选项”或“修改”按钮
 		createModalForUpdateRechargeOption:function(id){
 			var tips = id == 0 ? '添加' : '修改';
 			var modal = '<div class="modal fade" id="updateRechargeOptionModal_' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                        + '<div class="modal-content">'
                            + '<div class="modal-header">'
                                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                + '<h4 class="modal-title" id="myModalLabel">' + tips + '余额充值选项</h4>'
                            + '</div>'
                            + '<div class="modal-body">'
                                + '<form class="form-inline" action="">'
                                    + '<div class="input-group">'
                                        + '<span class="input-group-addon">￥</span>'
                                        + '<input class="form-control" id="money_' + id + '" type="text" placeholder="输入充值金额,如:100.5">'
                                    + '</div>&nbsp;'
                                    + '<div class="input-group">'
                                        + '<span class="input-group-addon">￥</span>'
                                        + '<input class="form-control" id="offer_money_' + id + '" type="text" placeholder="输入优惠金额,如:10.5">'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                            + '<div class="modal-footer">'
                                + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                + '<button type="button" class="btn btn-success" onclick="BalanceRecharge.updateRechargeOption(' + id + ');">确定</button>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
            $('body').append(modal);
            $('#updateRechargeOptionModal_' + id).modal('show');
            $('#updateRechargeOptionModal_' + id).on('hide.bs.modal',function(){
            	this.remove();
            });
 		},
 		// 添加或修改余额充值选项,id:0添加；>0修改
 		updateRechargeOption:function(id){
 			var money = $('#money_' + id).val(),
            offer_money = $('#offer_money_' + id).val();

 			if (!MS.moneyReg(money)) {
 				MS.showMsg('请输入合法的充值金额，非负正数，可精确到小数点后两位');
                $('#money_' + id).focus();
 				return false;
 			}
            if (!MS.moneyReg(offer_money)) {
                MS.showMsg('请输入合法的优惠金额，非负正数，可精确到小数点后两位');
                $('#offer_money_' + id).focus();
                return false;
            }
 			$.post(base_url + 'updateRechargeOption',{
 				id: id,
                money: money,
                offer_money: offer_money
 			},function(res){
 				if (res.errcode == 0) {
 					BalanceRecharge.getRechargeOptionList();
 					$('#updateRechargeOptionModal_' + id).modal('hide');
                    $('#updateRechargeOptionModal_' + id).on('hide.bs.modal',function(){
                        this.remove();
                    });
 					var tips = id == 0 ? '添加' : '修改';
					MS.showMsg(tips + '成功');
 				} else {
 					MS.showMsg(res.info);
 				}
 			},'json');
 		},
        // 移动余额充值选项排序type:0下移；1上移
        sortRechargeOption: function(i,type){
            var id_this = $('#sort_span_' + type + '_' + i).attr('data-id'),
            next_sort_i = type == 0 ? parseInt(i + 1) : parseInt(i - 1),
            id_that = $('#sort_span_' + type + '_' + next_sort_i).attr('data-id');

            $.post(base_url + 'sortRechargeOption',{
                id_this: id_this,//要移动的选项ID
                id_that: id_that//另一个选项ID
            },function(res) {
                if (res.errcode == 0) {
                    BalanceRecharge.getRechargeOptionList();
                } else {
                    MS.showMsg(res.info);
                }
            },'json');
        }
 	}
 }());