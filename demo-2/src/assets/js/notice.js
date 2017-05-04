/*
 * 广告管理模块 2017.04.21
 * author: chengyitong
 */
 var Advertisement = (function(){
 	var base_url = MS.getBaseUrl();
 	return {
 		// 获取广告列表type:0直接获取；1根据名称搜索
        getAdvertisementList:function(page,type){
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
            MS.goAjax(base_url + 'getAdvertisementList',MS.dataToJson(dataStr,dataArr),Advertisement.getAdvertisementListSuccess);
        },
        getAdvertisementListSuccess:function(res){
            if (res.errcode == 0){
                var list = res.data.advertisement_list,
                    size = res.data.size;

                if (size == 0) {
                    $('#list').html('<p class="nodata-tips">暂无相关标签数据</p>');
                } else {
                    var table = '<table class="table table-hover" id="list_table"><tr><td width="130">代理名称</td><td width="300">标题</td><td>学校名</td><td width="60">标签名</td><td>添加时间</td><td width="70">状态</td><td width="130">操作</td></tr></table>',
                    tr = '',
                    state_arr = ['审核中','已上架','已下架'],
                    state_color_arr = ['primary','success','danger'];
                    $('#list').html(table);

                    $.each(list,function(i,item){
                        var id = item.id,
                        username = item.username || '--',
                        title = item.title,
                        school_name = item.school_name || '--',
                        tag_name = item.tag_name,
                        state = item.state,//0:审核中；1：上架；2：下架
                        addtime_format = item.addtime_format;

                        var state_td_str = ['上架','下架','上架'],
                        state_td_arr = [1,2,1],
                        state_td_class = ['success','warning','success'],
                        state_td_txt = '<span class="label label-' + state_td_class[state] + '" onclick="Advertisement.updateAdvertisementState(' + id + ',' + state_td_arr[state] + ');">' + state_td_str[state] + '</span>';
                        
                        tr += '<tr id="list_table_tr_' + id + '"><td>' + username
                            + '</td><td>' + title
                            + '</td><td>' + school_name
                            + '</td><td>' + tag_name
                            + '</td><td>' + addtime_format
                            + '</td><td>' + '<span class="label label-' + state_color_arr[state] + '">' + state_arr[state] + '</span>'
                            + '</td><td>' + '<span class="label label-danger" onclick="Advertisement.updateAdvertisementState(' + id + ',3);">删除</span>' 
                            + state_td_txt
                            + '<span class="label label-info" onclick="Advertisement.getAdvertisementDetail(' + id + ');">详情</span>'
                            + '</td></tr>';
                    });
                    $('#list_table').append(tr);
                }
                MS.pager(size,Advertisement.getAdvertisementList);
            } else {
                MS.showMsg(res.info);
            }
        },
 		// 修改广告状态state:1:上架；2：下架；3：删除
        updateAdvertisementState: function(advertisement_id,state){
            if (state == 3) {
                if (!confirm('确定删除该广告吗？')) {
                    return false;
                }
            }
            
            $.post(base_url + 'updateAdvertisementState',{
                advertisement_id: advertisement_id,
                state: state
            },function(res){
                if (res.errcode == 0) {
                    $('#list_table_tr_' + advertisement_id).remove();
                    var page = window.localStorage.currPage,
                    tr = $('#list_table tr'),
                    tr_len = tr.length;
                    if (tr_len == 1 && page != 1) {
                        page = page - 1;
                    }
                    Advertisement.getAdvertisementList(page);
                    var tips_arr = ['','上架','下架','删除'];
                    MS.showMsg(tips_arr[state] + '成功');
                } else {
                    MS.showMsg(res.info);
                }
            },'json');
        },
 		// 获取广告详情
 		getAdvertisementDetail: function(advertisement_id){
            $.post(base_url + 'getAdvertisementDetail',{
                advertisement_id: advertisement_id
            },function(res) {
                if (res.errcode == 0) {
                    var detail = res.data.advertisement_detail,
                    id = detail.id,
                    username = detail.username || '--',
                    addtime_format = detail.addtime_format,
                    title = detail.title,
                    school_name = detail.school_name,
                    tag_name = detail.tag_name,
                    state = detail.state,
                    contact_type = detail.contact_type,//1微信2手机
                    weixin = detail.weixin,
                    cellphone = detail.cellphone,
                    content = detail.content,
                    imgurls = detail.imgurls,
                    state_arr = ['审核中','已上架','已下架'],
                    contact_type_arr = ['','微信','手机'],
                    contact_type_str = contact_type == 1 ? weixin : cellphone,
                    imgurls_arr = imgurls == null || imgurls == '' ? '--' : imgurls.split(','),
                    imgurls_str = '';

                    if (imgurls != null && imgurls !== '') {
                        for (var i = 0,len = imgurls_arr.length; i < len; i++) {
                            imgurls_str += '<a href="' + imgurls_arr[i] + '" target="_blank"><img src="' + imgurls_arr[i] + '"></a>';
                        }
                    } else {
                        imgurls_str = '暂无图片';
                    }

                    var modal = '<div class="modal fade" id="getAdvertisementDetailModal_' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                            + '<div class="modal-dialog" style="width: 880px;">'
                                + '<div class="modal-content">'
                                    + '<div class="modal-header">'
                                        + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                        + '<h4 class="modal-title" id="myModalLabel">广告详情</h4>'
                                    + '</div>'
                                    + '<div class="modal-body">'
                                        + '<ul class="row">'
                                        + '<li class="col-md-4"><label>代理名称：</label>' + username + '</li>'
                                        + '<li class="col-md-4"><label>联系方式：</label>' + contact_type_arr[contact_type] + '（' + contact_type_str + '）</li>'
                                        + '<li class="col-md-4"><label>学校名称：</label>' + school_name + '</li>'
                                        + '<li class="col-md-12"><label>广告标题：</label>' + title + '</li>'
                                        + '<li class="col-md-4"><label>添加时间：</label>' + addtime_format + '</li>'
                                        + '<li class="col-md-4"><label>标签名称：</label>' + tag_name + '</li>'
                                        + '<li class="col-md-4"><label>状态：</label>' + state_arr[state] + '</li>'
                                        + '<li class="col-md-12" style="margin-bottom: 20px;"><p><label>正文内容：</label></p><div class="ad-content">' + content + '</div></li>'
                                        + '<li class="col-md-12"><p><label>图片列表：</label></p><div class="ad-imgurl">' + imgurls_str + '</div></li>'
                                        + '</ul>'
                                    + '</div>'
                                    + '<div class="modal-footer">'
                                        + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                    + '</div>'
                                + '</div>'
                            + '</div>'
                        + '</div>';
                    $('body').append(modal);
                    $('#getAdvertisementDetailModal_' + id).modal('show');
                    $('#getAdvertisementDetailModal_' + id).on('hide.bs.modal',function(){
                        this.remove();
                    });
                } else {
                    MS.showMsg(res.info);
                }
            },'json');
 		}
 	}
 }());