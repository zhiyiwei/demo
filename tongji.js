var _mtac = {};

	(function() {

		var mta = document.createElement("script");
		mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
		mta.setAttribute("name", "MTAH5");
		mta.setAttribute("sid", "500710076");
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(mta, s);


		// 时间格式化
		Date.prototype.Format = function(fmt) { // author: 
			var o = {
				"M+": this.getMonth() + 1, // 月份
				"d+": this.getDate(), // 日
				"h+": this.getHours(), // 小时
				"m+": this.getMinutes(), // 分
				"s+": this.getSeconds(), // 秒
				"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
				"S": this.getMilliseconds() // 毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +
					o[k]).substr(("" + o[k]).length)));
			return fmt;
		}


		// ft：'2020-01-25 20:50:06',用户开始阅读时间
		// lt：'2020-01-25 20:55:19',用户结束阅读时间
		// duration：'12959',用户阅读时间 单位为ms
		// url:链接地址
		// lot:‘114.30683’，经度
		// lat:‘30.6089’，纬度
		// networkType:；‘4G’，网络状态
		var $data = {};
		$data.url = location.href;

		// 调用微信jssdk
		$.post('http://wenhai.wengegroup.com/analysis_al/mod2/getJSSDKConfig', {
			url: $data.url
		}, function(data) {
			wx.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: ['getNetworkType']
				}),
				wx.ready(function() {
					wx.getNetworkType({
						success: function(res) {
							$data.networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
						}
					});
					// wx.getLocation({
					//   type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					//   success: function (res) {
					//     $data.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					//     $data.lot = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					//   }
					// });

				}),
				wx.error(function(res) {
					console.log("微信验证失败!");
				})
		});
		$data.ft = new Date().getTime()
		// $data.ft = new Date(ft).Format("yyyy-MM-dd hh:mm:ss");

		// 监听关闭事件
		window.onbeforeunload = function(e) {
			e = e || window.event;
			$data.lt = new Date().getTime();
			$data.duration = $data.lt - $data.ft;
			//$data.lt = new Date(lt).Format("yyyy-MM-dd hh:mm:ss");
			$.post('http://userlog.wengegroup.com:10018/yl_api/behaviorData', $data, function(data) {
				console.log(data)
			})
			return 1;
		};


	})()
