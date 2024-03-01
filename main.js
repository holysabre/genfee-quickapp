import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif



/**
 * 获取系统信息
 * @author 深圳前海万联科技有限公司 <www.wanlshop.com>
 */
const beesys = () => {
	const sys = uni.getSystemInfoSync();
	// #ifdef MP-ALIPAY
	const {
		top,
		height
	} = uni.getMenuButtonBoundingClientRect();
	// #endif
	const data = {
		top: sys.statusBarHeight,
		height: sys.statusBarHeight + uni.upx2px(90),
		screenHeight: sys.screenHeight,
		platform: sys.platform,
		model: sys.model,
		windowHeight: sys.windowHeight,
		windowBottom: sys.windowBottom,
		deviceId: sys.deviceId,
		barHeight: 38,
	};
	// // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-WEIXIN
	// const custom = uni.getMenuButtonBoundingClientRect();
	// data.height = custom.bottom + custom.top - sys.statusBarHeight;
	// // #endif		
	// #ifdef MP-ALIPAY
	data.height = sys.statusBarHeight + sys.titleBarHeight;
	data.barHeight = height ? height + (top - data.top) * 2 : 38;
	// #endif
	return data;
}



Vue.prototype.$beeMin = {
	beesys
};