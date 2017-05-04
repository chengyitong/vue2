/*
 * Copyright 2017 by chengyitong
 * Desc: 魔方校园管理系统通用方法,通过MS.引用
 * Date: 2017-04-19
 */
var MS = (function() {
	return {
		getBaseUrl: function() {
			var base_url = '/adminMFXY/';
			return base_url;
		},
		// 跳转到登录页面
		goToLogin:function(){
			window.location.href = MS.getBaseUrl() + '/login.html';
		},
		// 退出登录
		logout:function(){
			$.post(MS.getBaseUrl() + 'logout',{},function(res){
				if (res.errcode == 0) {
					MS.goToLogin();
				} else {
					MS.showMsg(res.info);
				}
			},'json');
		},
		// 获取管理员登录信息
		getAdminInfo:function(){
			$.post(MS.getBaseUrl() + 'getAdminInfo',{},function(res){
				if (res.errcode == 0){
					var adminname = res.data.adminname;
					$('.js_adminname').html(adminname);
				} else if (res.errcode == 2) {
					MS.goToLogin();
				} else {
					MS.showMsg(res.info);
				}
			},'json');
		},
		// 按下回车键
        enterKeyDown: function(func) {
            $(document).keydown(function(event) {
                if (event.keyCode == 13) {
                    func();
                }
            });
        },
        //生成分页
        pager: function(totalRecords, func) {
            var page = localStorage.currPage || 1;
            if (totalRecords >= 10) {
                var totalPage = Math.ceil(totalRecords / 10);
                kkpager.total = totalPage;
                kkpager.totalRecords = totalRecords;
                kkpager.isShowTotalPage = false;
                kkpager.isShowCurrPage = false;
                kkpager.generPageHtml({
                    pno: page,
                    total: totalPage,
                    totalRecords: totalRecords,
                    mode: 'click', //默认值是link，可选link或者click
                    click: function(n) {
                        this.selectPage(n);
                        func(n);
                        localStorage.currPage = n;
                        return false;
                    }
                }, true);
            } else {
                $('#kkpager').empty();
            }
        },
        // 设置按钮的不可点击状态
        setAttributeDisabled: function(id, msg) {
            document.getElementById(id).setAttribute('disabled', 'disabled');
            document.getElementById(id).innerHTML = msg;
        },
        // 去除按钮的不可点击状态
        removeAttributeDisabled: function(id, msg) {
            document.getElementById(id).removeAttribute('disabled');
            document.getElementById(id).innerHTML = msg;
        },
        // 将非空有效数据转为json格式,dataStr = ['name','age']和dataArr = ['cyt',23]均为数组
        // 与goAjax配合使用：
		// MS.goAjax(url, MS.dataToJson(dataStr, dataArr), fun);
        dataToJson: function(dataStr, dataArr) {
            var jsonObj = new Object();
            for (var i = 0, len = dataStr.length; i < len; i++) {
                if (dataArr[i] != 'null' && dataArr[i] != null && dataArr[i] != '' && dataArr[i] != undefined) {
                    var key = dataStr[i];
                    jsonObj[key] = dataArr[i];

                    if (dataStr[i] == 'page') {
                        localStorage.currPage = dataArr[i];
                    }
                }
            }
            return jsonObj;
        },
        // ajax请求方法
        goAjax: function(url, data, render, beforeSend) {
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                dataType: 'json',
                beforeSend: beforeSend || function() {
                    // MS.loadingDialogShow();
                },
                success: function(res) {
                    // MS.loadingDialogHide();
                    render(res);
                },
                error: function(res) {
                    MS.showMsg(res.info);
                }
            });
        },

        goAjax2: function(url, data, render, beforeSend) {
            $.ajax({
                type: 'GET',
                url: url,
                data: data,
                dataType: 'json',
                beforeSend: beforeSend || function() {
                    MS.loadingDialogShow();
                },
                success: function(res) {
                    MS.loadingDialogHide();
                    render(res);
                },
                error: function(data) {
                    console.log('error');
                }
            });
        },
        // 通用消息提示--加载中-显示
        loadingDialogShow: function(msg) {
            if (msg == '' || msg == undefined || msg == null) {
                msg = '正在加载';
            }
            $('.js-loading-dialog-wrap').remove();
            var dialog = '<div class="dialog-wrap js-loading-dialog-wrap" style="display: block">' + '<div class="dialog-white-inner">' + '<p><img src="/res/common/images/loading.gif" alt=""></p>' + '<p>' + msg + '</p>' + '</div></div>';
            $('body').append(dialog);
        },
        // 通用消息提示--加载中-隐藏
        loadingDialogHide: function() {
            $('.js-loading-dialog-wrap').remove();
        },

        // 时间转成时间戳
        humanToUnix: function(datetime) {
            var tmp_datetime = datetime.replace(/:/g, '-');
            tmp_datetime = tmp_datetime.replace(/ /g, '-');
            var arr = tmp_datetime.split("-");
            var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return parseInt(now.getTime() / 1000);
        },
        //将时间戳转换成年月日
        getLocalTime: function(nS, type) {
            /*
             * nS:为传进来的时间戳
             * type:时间显示模式.若传入12则为12小时制,不传入则为24小时制
             */
            //年月日时分秒
            var Y,M,D,H,I,S;
            //月日时分秒为单位时前面补零
            function fillZero(v) {
                if (v < 10) {
                    v = '0' + v;
                }
                return v;
            }
            var d = new Date(parseInt(nS / 1000) * 1000);
            var Week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            Y = d.getFullYear();
            M = fillZero(d.getMonth() + 1);
            D = fillZero(d.getDate());
            W = Week[d.getDay()];
            H = fillZero(d.getHours());
            I = fillZero(d.getMinutes());
            S = fillZero(d.getSeconds());
            //12小时制显示模式
            if (type && type == 12) {
                //若要显示更多时间类型诸如中午凌晨可在下面添加判断
                if (H <= 12) {
                    H = '上午&nbsp;' + H;
                } else if (H > 12 && H < 24) {
                    H -= 12;
                    H = '下午&nbsp;' + fillZero(H);
                } else if (H == 24) {
                    H = '下午&nbsp;00';
                }
            }
            var localTime = Y + '-' + M + '-' + D + ' ' + H + ':' + I + ':' + S;
            return localTime;
        },

        // 时间戳转时间，type-1:2016-06-05   2:2016/06/15
        unixToHuman: function(unix, type) {
            if (/^(-)?\d{1,10}$/.test(unix)) {
                unix = unix * 1000;
            } else if (/^(-)?\d{1,13}$/.test(v)) {
                unix = unix * 1;
            } else {
                return;
            }
            var dateObj = new Date(unix),
                unixToDate;

            switch (type) {
                case 1:
                    unixToDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
                    break;

                case 2:
                    unixToDate = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate();
                    break;

                default:
                    unixToDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
                    break;
            }

            return unixToDate;
        },
        // 十六进制校验
        isHexColor: function(str) {
            var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
            return hexcolor.test(str);
        },
        // 金额校验，正数金额
        moneyReg: function(money) {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            return reg.test(money);
        },
        // 金额格式化s:传入的float数字 ，n:希望返回小数点几位;调用：moneyFormat("12345.675910", 3)，返回12,345.676
        moneyFormat: function(s, n) {
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1],
                t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },
        // 金额恢复原来数字格式,moneyRecover(12,345.676) //返回结果为：12345.676  
        moneyRecover: function(s) {
            return parseFloat(s.replace(/[^\d\.-]/g, ""));
        },
        // 手机校验
        phoneReg: function(phone) {
            var reg = /^(1)[0-9]{10}$/;
            if (!reg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        // 通用消息提示
		showMsg: function(msg) {
			if (msg != '' && msg != null && msg != undefined) {
				var dialog = '<div class="dialog-wrap js-dialog-msg-warp" style="display: block"><div class="dialog-tips-inner">' + msg + '</div></div>';
				$('body').append(dialog);
				setTimeout("$('.js-dialog-msg-warp').fadeOut();", 1000);
				setTimeout("$('.js-dialog-msg-warp').remove();", 1500);
			}
		},

        // 从网址上获取参数，用于两个html页面间传递参数
        queryString: function(val) {
            var uri = window.location.search;
            var re = new RegExp("" + val + "=([^&?]*)", "ig");
            return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
        },

        // 获取url query参数，返回一个角色
        getQueries: function() {
            var search = location.search || '',
                params = search.slice(1).split('&'),
                length = params.length,
                i = 0,
                query = null,
                queryList = {};

            for (; i < length; i++) {
                query = params[i].split('=');
                queryList[query[0]] = query[1];
            }

            return queryList;
        },
        // 获取主机地址之后的目录,
        getPathName: function() {
            var pathName = window.document.location.pathname,
                projectName = pathName.substring(1, pathName.substr(1).indexOf('/') + 1), //获取带"/"的项目名
                ad_projectlist = 'imagesjscss'; //排除某些项目

            if (ad_projectlist.indexOf(projectName) > 0) {
                MS.showMsg('images,js,css几个目录代码不执行');
            } else {
                return pathName;
            }
        },
        // 获取省份
        getProvinceList: function(p_id, c_id, d_id) {
            var province = $('#' + p_id).find('option:selected').val();
            $.post(MS.getBaseUrl() + 'getProvinceList', {}, function(res) {
                if (res.errcode == 0) {
                    var province_list = res.data.province_list,
                        o = '';
                    $.each(province_list, function(i, item) {
                        if (province != item) {
                            o += '<option value="' + item + '">' + item + '</option>';
                        }
                    });
                    $('#' + p_id).append(o);
                    if (province != '') {
                        MS.getCityList(p_id, c_id, d_id);
                    }
                } else {
                    console.error(res.info);
                }
            }, 'json');
        },
        //获取城市,type:0:原来的省份，1：变换省份
        getCityList: function(p_id, c_id, d_id, type) {
            if (type == undefined || type == '') {
                type = 0;
            } else {
                $('#' + d_id).attr('style', 'display:none;');
            }
            var city = $('#' + c_id).find('option:selected').val(),
                province = $('#' + p_id).find('option:selected').val();
            $.post(MS.getBaseUrl() + 'getCityList', {
                province: province
            }, function(res) {
                $('#' + c_id).attr('style', 'display:inline-block;');
                if (res.errcode == 0) {
                    var city_list = res.data.city_list,
                        o = '';

                    $.each(city_list, function(i, item) {
                        if (city != item) {
                            o += '<option value="' + item + '">' + item + '</option>';
                        }
                    });
                    if (type == 1) { //变换省份
                        $('#' + c_id).html('<option value="">城市</option>');
                    } else {
                        if (city != '') {
                            $('#' + c_id).html('<option value="' + city + '">' + city + '</option>');
                            MS.getDistrictList(c_id, d_id, type);
                        } else {
                            $('#' + c_id).html('<option value="">城市</option>');
                        }
                    }
                    $('#' + c_id).append(o);
                } else {
                    console.error(res.info);
                }
            }, 'json');
        },
        //获取区县type:0:原来的城市，1：变换城市
        getDistrictList: function(c_id, d_id, type) {
            if (type == undefined || type == '') {
                type = 0;
            }
            var district = $('#' + d_id).find('option:selected').val() || '',
                city = $('#' + c_id).find('option:selected').val();
            $.post(MS.getBaseUrl() + 'getDistrictList', {
                city: city
            }, function(res) {
                $('#' + d_id).attr('style', 'display:inline-block;');
                if (res.errcode == 0) {
                    var district_list = res.data.district_list,
                        o = '';

                    $.each(district_list, function(i, item) {
                        if (district != item) {
                            o += '<option value="' + item + '">' + item + '</option>';
                        }
                    });
                    if (type == 1) { //变换城市
                        $('#' + d_id).html('<option value="">区县</option>');
                    } else {
                        if (district != '') {
                            $('#' + d_id).html('<option value="' + district + '">' + district + '</option>');
                        } else {
                            $('#' + d_id).html('<option value="">区县</option>');
                        }
                    }
                    $('#' + d_id).append(o);
                } else {
                    console.error(res.info);
                }
            }, 'json');
        },
        //初始化七牛上传控件
        initQiniuUpload: function(btn_ids) {
            var btn_id_arr = btn_ids.toString().split(',');
            var qn = [];
            for (var i = 0, len = btn_id_arr.length; i < len; i++) {
                var Qiniu_n = new QiniuJsSDK();
                qn[i] = Qiniu_n.uploader({
                    runtimes: 'html5,flash,html4', //上传模式,依次退化
                    browse_button: 'imgUrlBtn_' + btn_id_arr[i], //上传选择的点选按钮，**必需**
                    container: 'imgContainer_' + btn_id_arr[i], //上传区域DOM ID，默认是browser_button的父元素，
                    drop_element: 'imgContainer_' + btn_id_arr[i], //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    max_file_size: '10mb', //最大文件体积限制
                    flash_swf_url: '/res/common/qiniu/plupload/Moxie.swf', //引入flash,相对路径
                    dragdrop: true, //开启可拖曳上传
                    chunk_size: '4mb', //分块上传时，每片的体积
                    uptoken_url: '/adminMFXY/getUploadToken', //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    // uptoken: $('#uptoken_' + type).val(), //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    domain: 'http://oowyv4t3c.bkt.clouddn.com/', //domain 为七牛空间（bucket)对应的域名，**必需**，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
                    get_new_uptoken: true, //设置上传文件的时候是否每次都重新获取新的token
                    unique_names: false, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,    // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    multi_selection: true, // 设置一次只能选择一个文件
                    auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    // 限制上传文件的类型
                    filters: {
                        mime_types: [{
                            title: "图片",
                            extensions: "jpg,jpeg,JPG,JPEG,gif,png,PNG" //限定jpg,gif,png
                        }, {
                            title: "文档",
                            extensions: "doc,DOC,docx,DOCX" //限定jpg,gif,png
                        }, {
                            title: "压缩文件",
                            extensions: "zip,ZIP,rar,RAR" //限定jpg,gif,png
                        }]
                    },
                    init: {
                        'FilesAdded': function(up, files) {
                            plupload.each(files, function(i, file) {
                                up.start();
                            });
                        },
                        'BeforeUpload': function(up, file) {
                            // 每个文件上传前,处理相关的事情
                            var fileName = file.name;
                            if (!Qiniu.isImage(fileName)) {
                                MS.showMsg('图片类型必须是.gif,jpeg,jpg,png中的一种');
                                return false;
                            }
                        },
                        'UploadProgress': function(up, file) {
                            // 每个文件上传时,处理相关的事情
                            MS.loadingDialogShow('正在上传');
                        },
                        'UploadComplete': function() {
                            //队列文件处理完毕后,处理相关的事情
                            MS.loadingDialogHide();
                        },
                        'FileUploaded': function(up, file, info) {
                            MS.loadingDialogHide();

                            var domain = up.getOption('domain'),
                                res = $.parseJSON(info),
                                sourceLink = domain + res.key; //获取上传成功后的文件的Url
                            var icon_id = up.getOption('container').substr(13);
                            var icon_str = '<div style="margin-top: 20px;"><p style="margin-bottom: 10px;">重新上传图标即可替换已上传的图标</p><a href="' + sourceLink + '" target="_blank"><img src="' + sourceLink + '"></a></div>';
                            $('#icon_str_' + icon_id).html(icon_str);
                            $('#icon_' + icon_id).val(sourceLink);
                        },
                        'Error': function(up, err, errTip) {
                            //上传出错时,处理相关的事情
                            MS.loadingDialogHide();
                            MS.showMsg(errTip);
                        },
                        'Key': function(up, file) {
                            var fileName = file.name,
                                fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1),
                                key = "";
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            var myDate = new Date(),
                                Y = myDate.getFullYear(), //获取完整的年份(4位,1970-????)
                                M = myDate.getMonth() + 1, //获取当前月份(0-11,0代表1月)
                                D = myDate.getDate(), //获取当前日(1-31)
                                H = myDate.getHours(), //获取当前小时数(0-23)
                                m = myDate.getMinutes(), //获取当前分钟数(0-59)
                                s = myDate.getSeconds(), //获取当前秒数(0-59)
                                mytime = '';

                            M = M < 10 ? '0' + M : M;
                            D = D < 10 ? '0' + D : D;
                            H = H < 10 ? '0' + H : H;
                            m = m < 10 ? '0' + m : m;
                            s = s < 10 ? '0' + s : s;
                            mytime = Y.toString() + M.toString() + D.toString() + H.toString() + m.toString() + s.toString();

                            key = md5(mytime + fileName) + '.' + fileExtension;
                            return key;
                        }
                    }
                });
            }
        }
	}
}());