<template>
	<view class="detail">
		<!-- <view class="form-item form-item1">
			<view class="label">
				名称：
			</view>
			<view class="value">
				{{info.title||'暂无'}}
			</view>
		</view> -->
		<view class="form-item form-item1">
			<view class="label">
				需求职业：
			</view>
			<view class="tags">
				<view class="tag" v-for="(item,index) in (info._cat||'其他').split('、')" :key="index">
					{{item}}
				</view>
			</view>
		</view>


		<view class="form-item">
			<view class="top form-item2">
				<view class="label">
					要求：
				</view>
				<view class="gary">
					发布时间：{{info.created_at||'暂无'}}
				</view>
			</view>
			<view class="matter">
				{{info.content}}
			</view>
			<view class="address">
				<image src="../../static/images/address2.png" mode=""></image>
				<text class="">{{info.address}}</text>
			</view>
		</view>

		<view class="form-item form-item2" v-if="info.party!=2">
			<view class="label">
				薪酬范围：
			</view>
			<view class="yellow">
				{{info._salary||'暂无'}}
			</view>
		</view>
		<view class="form-item form-item2" v-if="info.party!=2">
			<view class="label">
				企业单位：
			</view>
			<view class="value">
				{{info._company||'暂无'}}
			</view>
		</view>
		<view class="form-item form-item2" v-if="info.party!=2">
			<view class="label">
				岗位收费要求：
			</view>
			<view class="gray">
				该岗位招聘不涉及收费
			</view>
		</view>

		<view class="footer">
			<view class="warn">
				<image src="../../static/images/warn.png" mode="" class="warn-img"></image>
				<text>温馨提示</text>
			</view>
			<view class="note">
				联系之前请您注意辨别信息真伪，核实岗位实情及实际情况，谨防上当受骗。平台不参与招聘事宜，相关招聘及履约问题由招聘双方确认并担责。
			</view>
			<view class="btn" @click="onPhone">
				免费联系
			</view>
		</view>

		<!-- 联系前广告弹层（ad-feed 组件自治加载；v-show 常驻以便提前加载） -->
		<view class="ad-layer" v-show="showAdLayer">
			<view class="ad-mask" @click="closeAdLayer"></view>
			<view class="ad-panel">
				<view class="ad-panel-head">
					<text class="ad-panel-title">赞助商广告</text>
					<view class="ad-close" @click="closeAdLayer">✕</view>
				</view>
				<ad-feed @ready="onAdReady" @fail="onAdFail"></ad-feed>
				<view class="ad-loading" v-if="!adReady && !adFail">
					<text>广告加载中，可继续操作</text>
				</view>
				<view class="ad-tip">
					点击上方广告支持我们，或直接继续联系
				</view>
				<view class="ad-continue" @click="onAdContinue">
					继续联系
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import adFeed from '@/components/ad-feed.vue'
	import {
		getTopicsDetail
	} from '@/api/index.js'
	import {
		decorateTopic
	} from '@/utils/tool.js'
	export default {
		data() {
			return {
				id: 0,
				info: {},
				adReady: false, // 弹层广告是否已就绪
				adFail: false, // 广告加载失败
				showAdLayer: false, // 联系前广告弹层
				contactUnlocked: false // 本次进入详情页是否已放行联系
			}
		},
		components: {
			adFeed
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.loadInfo()
			}
		},
		onUnload() {
			if (this._adWaitTimer) clearTimeout(this._adWaitTimer)
		},
		onPullDownRefresh() {
			this.loadInfo(true)
		},
		methods: {
			// 详情数据来自 /topics/public/{id}（公开接口，无需登录态）
			async loadInfo(refresh = false) {
				try {
					let res = await getTopicsDetail(this.id)
					console.log('detail-res--->', res)
					if (res.code === 200) {
						let d = (res.data && res.data.data) || res.data || {}
						this.info = decorateTopic(d)
					}
				} catch (e) {
					console.log('detail load err => ' + (e && e.message))
				}
				if (refresh) {
					uni.stopPullDownRefresh()
				}
			},
			//弹层广告就绪
			onAdReady() {
				this.adReady = true
				console.log('[ad] layer ad ready')
			},
			// 弹层广告加载失败
			onAdFail() {
				this.adFail = true
				console.log('[ad] layer ad fail')
			},
			// 拨打电话
			doCall() {
				var phone = this.info._phone || ''
				if (!phone) {
					uni.showToast({
						icon: 'none',
						title: '该信息未提供联系电话',
						duration: 2000
					})
					return
				}
				uni.makePhoneCall({
					phoneNumber: String(phone), //电话号码
					success: function(e) {
						console.log(e);
					},
					fail: function(e) {
						console.log(e);

					}
				})
			},
			//「免费联系」：首次点击弹广告层（广告不可用时自动降级放行）
			onPhone() {
				if (this.contactUnlocked || this.adFail) {
					this.doCall()
					return
				}
				this.showAdLayer = true
				if (this.adReady) {
					// 广告已就绪，等用户操作
					return
				}
				// 广告未就绪：最多等 3 秒，超时自动放行（不阻塞核心功能）
				if (this._adWaitTimer) clearTimeout(this._adWaitTimer)
				this._adWaitTimer = setTimeout(() => {
					if (this.showAdLayer && !this.adReady) {
						console.log('[ad] wait timeout, pass through')
						this.onAdContinue()
					}
				}, 3000)
			},
			//「继续联系」/ 等待超时：放行拨号
			onAdContinue() {
				this.showAdLayer = false
				if (this._adWaitTimer) {
					clearTimeout(this._adWaitTimer)
					this._adWaitTimer = null
				}
				this.contactUnlocked = true
				this.doCall()
			},
			// 关闭弹层（不拨号）
			closeAdLayer() {
				this.showAdLayer = false
				if (this._adWaitTimer) {
					clearTimeout(this._adWaitTimer)
					this._adWaitTimer = null
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		min-height: 100vh;
		background-color: #fff;
		padding: 28rpx 32rpx 300rpx;

		.form-item {
			margin-bottom: 20rpx;

			.label {
				font-size: 28rpx;
				color: rgba(34, 34, 34, 0.5);
			}

			.value {
				font-size: 28rpx;
				color: #222222;
				max-width: 550rpx;
			}

			.tags {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				margin-right: -20rpx;
				margin-bottom: -20rpx;
				max-width: 550rpx;

				.tag {
					margin-right: 20rpx;
					padding: 0 25rpx;
					text-align: center;
					line-height: 40rpx;
					height: 40rpx;
					background: #FFFFFF;
					border-radius: 26rpx;
					border: 2rpx solid #FAC23C;
					font-size: 26rpx;
					color: #FAC23C;
					margin-bottom: 20rpx;
				}
			}

			.matter {
				font-size: 28rpx;
				color: #222222;
				line-height: 48rpx;
				margin-top: 16rpx;
				margin-bottom: 20rpx;
			}

			.address {
				display: flex;
				align-items: center;

				image {
					width: 24rpx;
					height: 24rpx;
					margin-right: 8rpx;
				}

				text {
					max-width: 750rpx;
					font-size: 28rpx;
					color: rgba(34, 34, 34, 0.5);
				}
			}
		}

		.gary {
			font-size: 24rpx;
			color: rgba(34, 34, 34, 0.5);
		}

		.yellow {
			font-weight: 600;
			font-size: 28rpx;
			color: #FFC900;
			max-width: 550rpx;
		}

		.gray {
			font-weight: 400;
			font-size: 28rpx;
			color: #222222;
		}

		.form-item1 {
			display: flex;
		}

		.form-item2 {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.footer {
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			box-sizing: border-box;
			padding: 20rpx 35rpx 30rpx;
			background-color: #FFFFFF;

			.warn {
				margin-bottom: 6rpx;
				display: flex;
				align-items: center;

				.warn-img {
					width: 48rpx;
					height: 48rpx;
				}

				text {
					font-size: 24rpx;
					color: #FDD000;
				}
			}

			.note {
				width: 678rpx;
				font-size: 20rpx;
				color: #666666;
				margin-bottom: 28rpx;
			}

			.btn {
				width: 686rpx;
				height: 88rpx;
				background: #FDD000;
				border-radius: 16rpx;
				font-size: 30rpx;
				color: #000000;
				line-height: 88rpx;
				text-align: center;
			}
		}

		// 联系前广告弹层
		.ad-layer {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1000;
			display: flex;
			align-items: center;
			justify-content: center;

			.ad-mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.6);
			}

			.ad-panel {
				position: relative;
				width: 640rpx;
				max-height: 80vh;
				overflow: hidden;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 24rpx;
				box-sizing: border-box;

				.ad-panel-head {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 16rpx;

					.ad-panel-title {
						font-size: 26rpx;
						color: rgba(34, 34, 34, 0.5);
					}

					.ad-close {
						width: 48rpx;
						height: 48rpx;
						line-height: 48rpx;
						text-align: center;
						font-size: 32rpx;
						color: rgba(34, 34, 34, 0.4);
					}
				}

				.ad-loading {
					height: 280rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					text {
						font-size: 26rpx;
						color: rgba(34, 34, 34, 0.4);
					}
				}

				.ad-tip {
					margin: 16rpx 0;
					font-size: 22rpx;
					color: rgba(34, 34, 34, 0.4);
					text-align: center;
				}

				.ad-continue {
					width: 100%;
					height: 88rpx;
					background: #FDD000;
					border-radius: 16rpx;
					font-size: 30rpx;
					color: #000000;
					line-height: 88rpx;
					text-align: center;
				}
			}
		}
	}
</style>