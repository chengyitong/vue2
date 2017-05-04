/*
 * 学校管理模块 2017.04.20
 * author: chengyitong
 */
 var School = (function(){
 	var page = 1,
 		base_url = MS.getBaseUrl();
 	return {
 		// 获取代理列表type:0直接获取；1根据昵称搜索
 		getSchoolList:function(page,type){
 			if (!type) {
 				type = 0;
 			}
 			var school_name = $.trim($('#school_name').val());
            $('#school_name').val(school_name);
 			if (type == 1 && school_name == '') {
 				MS.showMsg('请输入学校名称进行搜索');
 				$('#school_name').focus();
 				return false;
 			}
 			var dataStr = ['page','school_name'],
 			dataArr = [page,school_name];
 			MS.goAjax(base_url+'getSchoolList',MS.dataToJson(dataStr,dataArr),School.getSchoolListSuccess);
 		},
 		getSchoolListSuccess:function(res){
 			if (res.errcode == 0){
 				var list = res.data.school_list,
 					size = res.data.size;

 				if (size == 0) {
 					$('#list').html('<p class="nodata-tips">暂无相关学校数据</p>');
 				} else {
 					var table = '<table class="table table-hover" id="list_table"><tr><td>学校名称</td><td>所在地区</td><td>添加时间</td><td width="60">操作</td></tr></table>',
 					tr = '';
 					$('#list').html(table);

 					$.each(list,function(i,item){
 						var id = item.id,
 						school_name = item.school_name,
 						province = item.province,
 						city = item.city,
 						district = item.district,
 						addtime_format = item.addtime_format;

 						tr += '<tr id="list_table_tr_' + id + '"><td>' + school_name
 							+ '</td><td>' + province + ' ' + city + ' ' + district
 							+ '</td><td>' + addtime_format
 							+ '</td><td>' + '<span data-school="' + school_name + '" data-province=' + province + ' data-city=' + city + ' data-district=' + district + ' class="label label-primary" id="updateSchoolSpan_' + id + '" onclick="School.createModalForUpdateSchool(' + id + ');">修改</span>'
 							+ '</td></tr>';
 					});
 					$('#list_table').append(tr);
 				}
 				MS.pager(size,School.getSchoolList);
 			} else {
 				MS.showMsg(res.info);
 			}
 		},
 		// 点击“添加学校”或“修改学校”按钮
 		createModalForUpdateSchool:function(id){
 			var tips = id == 0 ? '添加' : '修改',
            school_name = '',
            province_str = '<option value="">省份</option>',
            city_str = '<option value="">城市</option>',
            district_str = '<option value="">区县</option>';
            if (id > 0) { // 修改学校信息
                var province = '',
                city = '',
                district = '';
                school_name = $('#updateSchoolSpan_' + id).attr('data-school');
                province = $('#updateSchoolSpan_' + id).attr('data-province');
                city = $('#updateSchoolSpan_' + id).attr('data-city');
                district = $('#updateSchoolSpan_' + id).attr('data-district');
                province_str = '<option value="' + province + '">' + province + '</option>';
                city_str = '<option value="' + city + '">' + city + '</option>';
                district_str = '<option value="' + district + '">' + district + '</option>';
            } 
 			var modal = '<div class="modal fade" id="updateSchoolModal_' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                    + '<div class="modal-dialog">'
                        + '<div class="modal-content">'
                            + '<div class="modal-header">'
                                + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                                + '<h4 class="modal-title" id="myModalLabel">' + tips + '学校</h4>'
                            + '</div>'
                            + '<div class="modal-body">'
                                + '<form class="form-inline" action="">'
                                    + '<div class="form-group">'
                                        + '<input type="text" class="form-control" id="school_name_' + id + '" placeholder="请输入学校名称" required value="' + school_name + '" style="width:265px;">&nbsp;'
                                    + '</div>'
                                    + '<div class="form-group">'
                                        + '<select class="form-control" name="province" id="province_' + id + '"  onchange="MS.getCityList(\'province_' + id + '\',\'city_' + id + '\',\'district_' + id + '\',1)">'
                                            + province_str
                                        + '</select>&nbsp;'
                                        + '<select class="form-control fn-hide" name="city" id="city_' + id + '" onchange="MS.getDistrictList(\'city_' + id + '\',\'district_' + id + '\',1)">'
                                           + city_str
                                        + '</select>&nbsp;'
                                        + '<select class="form-control fn-hide" name="district" id="district_' + id + '">'
                                            + district_str
                                        + '</select>'
                                    + '</div>'
                                + '</form>'
                            + '</div>'
                            + '<div class="modal-footer">'
                                + '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                                + '<button type="button" class="btn btn-success" id="updateSchoolBtn_' + id + '" onclick="School.updateSchool(' + id + ');">确定</button>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>';
            $('body').append(modal);
            $('#updateSchoolModal_' + id).modal('show');
            $('#updateSchoolModal_' + id).on('hide.bs.modal',function(){
            	this.remove();
            });
            MS.getProvinceList('province_' + id,'city_' + id,'district_' + id);
 		},
 		// 添加或修改学校,id:0添加；>0修改
 		updateSchool:function(id){
 			var school_name = $.trim($('#school_name_' + id).val()),
 			province = $('#province_' + id).find('option:selected').val(),
 			city = $('#city_' + id).find('option:selected').val(),
 			district = $('#district_' + id).find('option:selected').val();

 			if (school_name == '') {
 				MS.showMsg('请填写学校名称');
 				return false;
 			}
 			if (province == '') {
 				MS.showMsg('请选择学校所在省份');
 				return false;
 			}
 			if (city == '') {
 				MS.showMsg('请选择学校所在城市');
 				return false;
 			}
 			if (district == '') {
 				MS.showMsg('请选择学校所在区县');
 				return false;
 			}
            MS.setAttributeDisabled('updateSchoolBtn_' + id,'正在处理...');
 			$.post(base_url + 'updateSchool',{
 				id: id,
 				school_name: school_name,
 				province: province,
 				city: city,
 				district: district
 			},function(res) {
                MS.removeAttributeDisabled('updateSchoolBtn_' + id,'确定');
 				if (res.errcode == 0) {
                    var page = id == 0 ? 1 : window.localStorage.currPage;
 					School.getSchoolList(page);
 					$('#updateSchoolModal_' + id).modal('hide');
                    $('#updateSchoolModal_' + id).on('hide.bs.modal',function(){
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