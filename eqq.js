var eqq = new function() {
	this.msgQueue = [];
	this.msgFilters = [];
	var tid = 0;
	var self = this;
	this.start = function(interval) {
		interval = interval || 2000;
		if (typeof EQQ == "undefined") {
			alert("login web qq first.");
		} else {
			attachQQMsgObserver(true);
			clearInterval(this.tid);
			tid = setInterval(checkMsg, interval);
		}
	};

	this.stop = function() {
		if (typeof EQQ == "undefined") {
			return;
		} else {
			attachQQMsgObserver(false);
			clearInterval(tid);
		}
	};
	function attachQQMsgObserver(attach) {
		EQQ.RPCService._$events.onPollSuccess[2] = (attach ? function() {
			if (arguments[0] && arguments[0][0]) self.msgQueue.unshift(arguments[0][0]);
		} : function() {});
	}
	function checkMsg() {
		if (self.msgQueue.length < 1) return;
		processMsg(self.msgQueue.pop());
	}

	function processMsg(msg) {
		var msgType = "single";
		switch (msg.poll_type) {
		case "message":
			msg = msg.value;
			break;
		case "sess_message":
			msg = msg.value;
			break;
		case "group_message":
			msg = msg.value;
			msgType = "group";
			break;
		case "discu_message":
			msg = msg.value;
			msgType = "discu";
			break;
		default:
			return;
		}
		var msgText = "";
		for (var i = 0; i < msg.content.length; i++) {
			if ((typeof msg.content[i] == "string") || (msg.content[i].constructor == String)) {
				msgText = msgText + " " + msg.content[i];
			}
		}

		if (msgType == "group") {
			var me = EQQ.Model.BuddyList.getSelf();
			var robotName = me.nick;
			if (me.usercard && me.usercard.hasOwnProperty(msg.group_code + "")) robotName = me.usercard[msg.group_code].title;
			if (msgText.indexOf("@" + robotName) < 0) return;
			msgText = msgText.replace(new RegExp("@" + robotName, "g"), "");
		}

		msgText = msgText.replace(/(^\s*)|(\s*$)/g, "");
		var reply = false;
		var msgx = {type:msgType, from:msg.from_uin, msgText:msgText}; // filter msg
		for (var f = 0; f < self.msgFilters.length && !reply; f++) {
			reply = self.msgFilters[f](msgx);
		}
		//console.log("reply " + msgx.from + "(" + msgx.type + "):" + msgx.msgText);
		if(reply)
			sendQQMsg(msgx);
	}
	function sendQQMsg(msgx) {
		EQQ.Model.ChatMsg.sendMsg({
			type: msgx.type,
			to: msgx.from,
			content: [msgx.msgText, ["font", {
				color: "000000",
				name: "微软雅黑",
				size: "10",
				style: [0, 0, 0]
			}]],
			face: EQQ.Model.BuddyList.getSelf().face
		});
	}
};