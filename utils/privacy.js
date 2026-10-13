/**
 * 隐私政策同意状态（快应用-webview 版）
 *
 * 广告合规要求（鲸鸿动能自检项）：调用广告请求前，必须已展示并取得用户对隐私政策的同意。
 * 未同意前：不创建广告实例、不发起广告请求（闸门在 utils/ads.js 的 canRequestAds()）。
 */

const KEY = 'ggfee-privacy-accepted'

let _listeners = []

export function isPrivacyAccepted() {
	try {
		return uni.getStorageSync(KEY) === 'yes'
	} catch (e) {
		return false
	}
}

export function acceptPrivacy() {
	try {
		uni.setStorageSync(KEY, 'yes')
	} catch (e) {}
	// 通知等待中的广告组件（同意后允许发起请求）
	var ls = _listeners.slice()
	_listeners = []
	ls.forEach(function(cb) {
		try {
			cb()
		} catch (e) {}
	})
}

/**
 * 注册"已同意隐私政策"回调（供广告组件在未同意时挂起等待，同意后重新加载）
 */
export function onPrivacyAccepted(cb) {
	if (isPrivacyAccepted()) {
		try {
			cb()
		} catch (e) {}
		return
	}
	_listeners.push(cb)
}

// 隐私政策要点（弹窗简版；完整文本见 pages/privacy）
export const PRIVACY_SUMMARY = '本应用为招聘信息浏览平台。您在使用过程中的地区筛选偏好等数据仅保存在本机；应用内广告由第三方广告服务（华为鲸鸿动能）提供，为广告投放与统计会使用匿名设备标识（OAID）等设备信息，您的浏览数据不会提供给广告服务。请阅读并同意《隐私政策》后继续使用。'
