/**
 * 快应用广告能力层（华为快应用-webview 版）
 *
 * ⚠️ 平台能力差异（真机实证，2026-10-13）：
 *  - webview 版仅支持「原生广告（自渲染）」：qa.createNativeAd
 *  - 无插屏（createInterstitialAd）、无激励视频（createRewardedVideoAd）—— 仅原生快应用/元服务支持
 *  - 互推盒子（AppBox 系列）实测返回 errCode 2006，暂不可用
 *
 * ⚠️ 重要架构约束（真机实证）：
 *  - qa.createNativeAd 返回的广告实例含闭包/动态方法，【不可跨 chunk 传递】。
 *    fa-toolkit 将页面/组件分别打包为独立 pack.js；跨 chunk 传对象会破坏其闭包，
 *    调用 reportAdShow 时报 "l is not defined"（表现为曝光上报失败）。
 *  - 因此：广告实例的创建与全部方法调用（load/reportAdShow/reportAdClick）
 *    必须收敛在同一 chunk —— 本项目中由 components/ad-feed.vue 组件内聚完成。
 *  - 本模块只提供【纯函数与纯数据】：配置拉取（initAds）与读取（getAdConfig），跨 chunk 安全。
 *
 * 配置对齐《覆盖 HarmonyOS 4.x 元服务方案（v15）》S5 广告接入：
 *  - 总开关：jhdn_ad_enable（服务端 /settings/global 下发，'1' 开 / '0' 关）
 *  - 测试切位：jhdn_ad_test（'1'=用华为官方测试广告位）
 *  - 正式广告位：jhdn_ad_native
 */

import { getGlobalSettings } from '@/api'

// 华为官方测试广告位：原生大图文 1080x607
const TEST_NATIVE_AD_UNIT = 'testu7m3hc4gvm'

let _qa = null
let _qaProbed = false
let _cfg = {
	enabled: false,
	useTest: true,
	nativeId: TEST_NATIVE_AD_UNIT,
	supported: false,
	ready: false
}
let _initializing = null

function getQa() {
	if (_qaProbed) return _qa
	_qaProbed = true
	try {
		var g = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : null)
		if (g && g.qa) _qa = g.qa
	} catch (e) {}
	return _qa
}

export function isAdSupported() {
	var qa = getQa()
	return !!(qa && typeof qa.createNativeAd === 'function')
}

/**
 * 初始化：拉取服务端配置 + 探测环境能力（幂等，只执行一次）
 * @returns Promise<{enabled, useTest, nativeId, supported, ready}>
 */
export function initAds() {
	if (_initializing) return _initializing
	_initializing = new Promise(function(resolve) {
		var settle = function(d) {
			d = d || {}
			var qa = getQa()
			_cfg.supported = isAdSupported()
			// 服务端明确 '0' 才关闭；拿不到配置时默认开启（有广告位就展示）
			var enableFlag = d.jhdn_ad_enable
			_cfg.enabled = _cfg.supported && String(enableFlag) !== '0'
			_cfg.useTest = String(d.jhdn_ad_test) !== '0' // 默认测试位
			_cfg.nativeId = (!_cfg.useTest && d.jhdn_ad_native) ? d.jhdn_ad_native : TEST_NATIVE_AD_UNIT
			_cfg.ready = true
			console.log('[ads] init => ' + JSON.stringify({
				enabled: _cfg.enabled,
				supported: _cfg.supported,
				useTest: _cfg.useTest,
				nativeId: _cfg.nativeId,
				raw: { enable: enableFlag, test: d.jhdn_ad_test }
			}))
			resolve(_cfg)
		}
		var timer = setTimeout(function() { settle(null) }, 5000) // 配置请求超时保护
		getGlobalSettings().then(function(res) {
			clearTimeout(timer)
			settle((res && res.data && res.data.data) || {})
		}).catch(function(e) {
			clearTimeout(timer)
			console.log('[ads] settings failed => ' + (e && e.message))
			settle(null)
		})
	})
	return _initializing
}

export function getAdConfig() {
	return _cfg
}
