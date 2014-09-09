(function(robotKey) {
	function loadjs(url, id, onload) {
		if (document.getElementById(id)) return;
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.id = id || ("script_" + Math.round(Math.random() * 100));
		s.src = url;
		document.getElementsByTagName("head")[0].appendChild(s);
		if (onload) {
			s.onload = onload;
			s.onreadystatechange = function() {
				if (s.readyState == "loaded" || s.readyState == "complete") {
					s.onreadystatechange = null;
					s.onload();
					s.onload = null;
				}
			}
		}
	}

	function robot(question) {
		if(typeof robot.robotUserId == "undefined") robot.robotUserId = 0;
		var robotUrl = "http://www.tuling123.com/openapi/api?key=" + robotKey + "&info=" + encodeURI(question) + "&userid=" + robot.robotUserId;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", robotUrl, false);
		xhr.send(null);
		var rtn = JSON.parse(xhr.responseText);
		if (!rtn) return;
		if (robot.robotUserId == 0) {
			robot.robotUserId = rtn.userid;
		}
		var text = rtn.text + "\n";
		switch (rtn.code) {
		case 100000:
			break;
		case 200000:
			return text + " " + rtn.url;
		case 301000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += rtn.list[i].name + " " + rtn.list[i].author + ": " + rtn.list[i].detailurl + " \n";
			}
			break;
		case 302000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += rtn.list[i].article + " " + rtn.list[i].source + " :" + rtn.list[i].detailurl + " \n";
			}
			break;
		case 304000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += + rtn.list[i].name + " " + rtn.list[i].count + " :" + rtn.list[i].detailurl + " \n";
			}
			break;
		case 305000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += " " + rtn.list[i].trainnum + rtn.list[i].start + "[" + rtn.list[i].starttime 
					+ "] => " + rtn.list[i].terminal + "[" + rtn.list[i].endtime + "] \n";
			}
			break;
		case 306000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += rtn.list[i].flight + " " + rtn.list[i].route + " " + rtn.list[i].starttime 
					+ " - " + rtn.list[i].endtime + " " + rtn.list[i].state + "\n";
			}
			break;
		case 308000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += rtn.list[i].name + " " + rtn.list[i].info + " :" + rtn.list[i].detailurl + " \n";
			}
			break;
		case 309000:
			for(var i=0; i<rtn.list.length && i<10; i++){
				text += rtn.list[i].name + " " + rtn.list[i].price + " " + rtn.list[i].satisfaction + ": " + rtn.list[i].detailurl + " \n";
			}
			break;
		case 310000:
			for(var i=0; i<rtn.list.length && i<10; i++){
				text += rtn.list[i].number + " " + rtn.list[i].info + ": " + rtn.list[i].detailurl + " \n";
			}
			break;
		case 307000:
		case 311000:
		case 312000:
			for(var i=0; i<rtn.list.length && i<5; i++){
				text += rtn.list[i].name + " " + rtn.list[i].price + ": " + rtn.list[i].detailurl + " \n";
			}
			break;
		default:
			return "error: " + rtn.code;
		}
		return text.substring(0, text.length - 1);
	};

	//var msg = {type:msgType, from:msg.from_uin, msgText:msgText};
	function telFilter(msg) {
		var reTel = /[\s|：]*?(.{2,4}?)(?:.老师)?的?(?:[电话|手机|联系])号??码??/gmi;
		if(msg.msgText.match(reTel))
			msg.msgText = RegExp.$1;
		return false;
	}

	function robotFilter(msg){
		msg.msgText = robot(msg.msgText);
		return true;
	}

	if (typeof EQQ == "undefined") {
		alert("请先登录webqq.");
		window.location.reload();
	} else {
		loadjs("http://js.chinacloudsites.cn/robot2/eqq.js", "eqqrobot",
		function() {
			if (typeof eqq == "undefined") {
				alert("QQ机器人加载失败! 刷新后重试。");
			} else {
				eqq.msgFilters.push(telFilter);
				eqq.msgFilters.push(robotFilter);
				eqq.start();
			}
		});
	}
})("yourkey_ontuling123_32bit");