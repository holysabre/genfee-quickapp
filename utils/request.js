import defaultConfig from '@/config/config.js'
import {
	loginByWeixin
} from '@/api'
import {
	debounce
} from '@/utils/tool'


export function requestFun(method, url, data = {}) {
	console.log('requestFun==>')
	let header = {
		'content-type': 'application/json',
		// 'User-Agent':'GenFee/3.1.9'
		// 'Content-Type': 'application/x-www-form-urlencoded'
	}

	// 不需要传token的api路径，如"/app/auth/captcha"
	let whiteList = [
		'/auth/login/wechat', '/topics',
	];
	// 用户已登录时需要传token，没登录时不需要传token的api路径
	let tokenList = [];
	let index = url.indexOf('?'),
		realUrl = url
	if (index >= 0) {
		realUrl = url.substr(0, index)
	}
	if (whiteList.indexOf(realUrl) < 0 || tokenList.indexOf(realUrl) >= 0) {
		let token = uni.getStorageSync('token') || ''
		if (token) {
			header['Authorization'] = token
		} else if (tokenList.indexOf(realUrl) < 0) {
			// uni.navigateTo({
			// 	url: '/packageA/login/login'
			// })
		}
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: defaultConfig.baseUrl + url,
			method: method,
			header: Object.assign({}, header),
			data,
			success: async (res) => {
				console.log('fullurl===>', defaultConfig.baseUrl + url)
				console.log('res===>', res)
				if (res.statusCode !== 200) {
					uni.showToast({
						icon: 'none',
						title: res.data.message,
						duration: 2000
					});
					resolve(res.data);
				} else {
					if (res.data.code !== 200) {
						if (res.data.code === 401) {
							// uni.navigateTo({
							// 	url: '/packageA/login/login'
							// })
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
								duration: 2000
							});
						}
					} else {
						resolve(res.data);
					}
					// 原样返回
					resolve({
						errno: 501
					});
				}
			},
			fail: (err) => {
				let str = '错误===>' + JSON.stringify(err)
				uni.showToast({
					icon: 'none',
					title: str,
					duration: 2000
				});
				// resolve({ errno: 1 });
				resolve(err);
			}
		})
	})
}



export function requestFunForJson(method, url, data = {}) {
	let header = {
		'content-type': 'application/json',
		// 'User-Agent':'GenFee/3.1.9'
		// 'Content-Type': 'application/x-www-form-urlencoded'
	}

	// 不需要传token的api路径，如"/app/auth/captcha"
	let whiteList = [
		'/auth/login/wechat', '/topics',
	];
	// 用户已登录时需要传token，没登录时不需要传token的api路径
	let tokenList = [];
	let index = url.indexOf('?'),
		realUrl = url
	if (index >= 0) {
		realUrl = url.substr(0, index)
	}
	if (whiteList.indexOf(realUrl) < 0 || tokenList.indexOf(realUrl) >= 0) {
		let token = uni.getStorageSync('token') || ''
		if (token) {
			header['Authorization'] = token
		} else if (tokenList.indexOf(realUrl) < 0) {
			// uni.navigateTo({
			// 	url: '/packageA/login/login'
			// })
		}
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: defaultConfig.baseUrl + url,
			method: method,
			header: Object.assign({}, header),
			data,
			success: async (res) => {
				if (res.statusCode !== 200) {
					uni.showToast({
						icon: 'none',
						title: res.data.message,
						duration: 2000
					});
					resolve(res.data);
				} else {
					if (res.data.errno !== 0) {
						if (res.data.errno === 501) {
							// uni.navigateTo({
							// 	url: '/packageA/login/login'
							// })
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.errmsg,
								duration: 2000
							});
						}
					}
					// 原样返回
					resolve(res.data);
				}
			},
			fail(err) {
				uni.showToast({
					icon: 'none',
					title: JSON.stringify(err),
					duration: 2000
				});
				resolve({
					errno: 1
				});
			}
		})
	})
}

function goLogin() {
	uni.navigateTo({
		url: '/pages/login/login'
	})
}