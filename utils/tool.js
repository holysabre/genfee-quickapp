// 日期格式化
export function parseTime(time, pattern, noZero = false) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	let year = date.getFullYear().toString()
	const formatObj = {
		Y: year,
		y: year.substr(2, 4),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(Y|y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10 && !noZero) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// export function checkPhone(phone: string): boolean {
//     if (!phone || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
//         return false;
//     } else {
//         return true;
//     }
// }

/**
 * @param {Function} fn 需要执行的方法，因this指向问题，建议不使用箭头函数，
 * @param {Number} delay 间隔时间，默认值100
 * @param {Boolean} promptly 是否立即执行，默认false
 * **/
export function debounce(fn, delay = 1000, promptly) {
	let timer = null;
	return function(...args) {
		// 立即执行
		if (promptly) {
			// 当timer为null时执行
			if (!timer) fn.apply(this, args);
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				timer = null;
			}, delay)
		} else {
			if (timer) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				fn.apply(this, args);
			}, delay)
		}
	}
}



//dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
export function timeago(dateTimeStamp) {
	console.log('dateTimeStamp==》', dateTimeStamp)
	var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
	var hour = minute * 60;
	var day = hour * 24;
	var week = day * 7;
	var halfamonth = day * 15;
	var month = day * 30;
	var now = new Date().getTime(); //获取当前时间毫秒
	console.log(now)
	var diffValue = now - dateTimeStamp; //时间差

	if (diffValue < 0) {
		return;
	}
	var minC = diffValue / minute; //计算时间差的分，时，天，周，月
	var hourC = diffValue / hour;
	var dayC = diffValue / day;
	var weekC = diffValue / week;
	var monthC = diffValue / month;
	var result = null
	if (monthC >= 1 && monthC <= 3) {
		result = " " + parseInt(monthC) + "月前"
	} else if (weekC >= 1 && weekC <= 3) {
		result = " " + parseInt(weekC) + "周前"
	} else if (dayC >= 1 && dayC <= 6) {
		result = " " + parseInt(dayC) + "天前"
	} else if (hourC >= 1 && hourC <= 23) {
		result = " " + parseInt(hourC) + "小时前"
	} else if (minC >= 1 && minC <= 59) {
		result = " " + parseInt(minC) + "分钟前"
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = "刚刚"
	} else {
		var datetime = new Date();
		datetime.setTime(dateTimeStamp);
		var Nyear = datetime.getFullYear();
		var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
		var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
		var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
		var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
		var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
		result = Nyear + "-" + Nmonth + "-" + Ndate
	}
	console.log('result==>', result)
	return result;
}


/**
 * @Description: 判断用户是否有操作权限
 * @author lynnel
 * @createTime: 2022-09-02 09:42:31
 */
// userPermits=['','']，needPermits=['','']
export function hasPermit(userPermits = [], needPermits = []) {
	let result = needPermits && needPermits.length > 0 ? false : true
	if (!result && userPermits && userPermits.length > 0) {
		for (let i = 0; i < userPermits.length; i++) {
			if (needPermits.indexOf(userPermits[i]) !== -1) {
				result = true
				break
			}
		}
	}
	return result
}

/**
 * @Description: 附件下载
 * @author lynnel
 * @createTime: 2022-09-04 13:48:26
 */
export function downloadFile(url, type) {
	uni.showLoading({
		title: '加载中'
	})
	uni.downloadFile({
		url: url,
		success: res => {
			if (res.statusCode === 200) {
				wx.saveFile({
					tempFilePath: res.tempFilePath,
					success: res => {
						var savedFilePath = res.savedFilePath;
						if (['image/png', 'image/jpeg'].indexOf(type) > -1) {
							uni.previewImage({
								urls: [savedFilePath],
								success: () => {
									console.log('打开图片成功')
								},
								fail: (err) => {
									console.log('err==>', err)
									uni.showToast({
										title: err.errMsg,
										icon: "none"
									})

								},
							})
						} else {
							console.log('12312321===>', url.substring(url.lastIndexOf(".") + 1))
							// 打开文档
							uni.openDocument({
								fileType: url.substring(url.lastIndexOf(".") + 1),
								filePath: savedFilePath,
								success: function(res) {
									console.log('打开文档成功')
								},
								fail: function(err) {
									console.log('err==>', err)
									uni.showToast({
										title: err.errMsg,
										icon: "none"
									})
								},
							})
						}
						uni.hideLoading()
					}
				})
			}
		}
	})
}