/*
 * 登录 2017.04.18
 * author: chengyitong
 */
var base_url = MS.getBaseUrl();

function login() {
	var adminname = $('#adminname').val(),
		password = $('#password').val();

	var params = {
		adminname:adminname,
		password:md5(password)
	}

	if (adminname == '') {
		MS.showMsg('账号不能为空');
		$('#adminname').focus();
		return false;
	}
	if (password == '') {
		MS.showMsg('密码不能为空');
		$('#password').focus();
		return false;
	}
	MS.setAttributeDisabled('adminname');
	MS.setAttributeDisabled('password');
	MS.setAttributeDisabled('loginBtn','正在登录...');
	$.post(base_url + 'login', {
		adminname: adminname,
		password: md5(password)
	}, function(res) {
		MS.removeAttributeDisabled('adminname');
		MS.removeAttributeDisabled('password');
		MS.removeAttributeDisabled('loginBtn','登录');
		if (res.errcode == 0) {
			$('#loginForm')[0].reset();
			window.location.href = MS.getBaseUrl() + '/index.html';
		} else {
			MS.showMsg(res.info);
		}
	}, 'json');
}