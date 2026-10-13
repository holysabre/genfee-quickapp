<script>
	// #ifdef QUICKAPP-WEBVIEW-HUAWEI
	import {
		initAds
	} from '@/utils/ads.js'
	// #endif
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef QUICKAPP-WEBVIEW-HUAWEI
			// 预初始化广告（拉取服务端开关与广告位配置；失败静默降级，不阻塞启动）
			initAds()
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		background-color: #B0CBEB;
	}

	view,
	scroll-view,
	swiper,
	button,
	input,
	textarea,
	label,
	navigator,
	image {
		box-sizing: border-box;
	}

	image {
		max-width: 100%;
		display: inline-block;
		position: relative;
		z-index: 0;
	}

	.omit1 {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.omit2 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.navigater {
		margin-bottom: 28rpx;
	}


	.empty {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 800rpx;

		image {
			width: 260rpx;
			height: 260rpx;
			margin-bottom: 20rpx;
		}

		.text {
			font-size: 28rpx;
			color: #333;
		}
	}
</style>