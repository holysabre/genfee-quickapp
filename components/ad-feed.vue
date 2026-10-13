<template>
	<!-- 原生广告（自渲染）卡片
	     合规要点（鲸鸿动能自检项）：
	     - 广告卡片根节点不可点击，仅图片/标题/按钮可点击跳转落地页
	     - 展示广告标识、广告来源、关闭按钮（≥32dp 且与周边底色有区分）
	     - 无填充/失败不显示广告位；请求失败不做循环重试
	     架构约束：广告实例必须在本组件内创建与调用（跨 chunk 传递会破坏闭包） -->
	<view class="ad-feed" v-if="data && !closed">
		<view class="ad-media" v-if="imgUrl" @click="onAdClick">
			<image class="ad-img" :src="imgUrl" mode="aspectFill"></image>
		</view>
		<view class="ad-body">
			<view class="ad-row">
				<image class="ad-icon" v-if="data.icon" :src="data.icon" mode="aspectFill" @click="onAdClick"></image>
				<view class="ad-info">
					<view class="ad-title omit2" @click="onAdClick">{{data.title}}</view>
					<view class="ad-desc" v-if="data.desc">{{data.desc}}</view>
				</view>
			</view>
			<view class="ad-foot">
				<view class="ad-tag">
					<text class="ad-tag-txt">广告</text>
					<text class="ad-src">{{data.source||'赞助商'}}</text>
				</view>
				<view class="ad-btn" @click="onAdClick">{{data.clickBtnTxt||'查看详情'}}</view>
			</view>
		</view>
		<!-- 关闭按钮：64rpx(≥32dp)，灰底圆与白色卡片/图片有区分
		     注意：不可用 @click.stop（catchtap 在快应用-webview 渲染层不触发），父节点无点击处理无需阻止冒泡 -->
		<view class="ad-close" @click="onClose">✕</view>
	</view>
</template>

<script>
	import {
		initAds,
		canRequestAds
	} from '@/utils/ads.js'
	import {
		onPrivacyAccepted
	} from '@/utils/privacy.js'

	export default {
		name: 'ad-feed',
		data() {
			return {
				ad: null, // 原生广告实例（仅本组件chunk内使用）
				data: null, // 广告数据 adList[0]
				closed: false // 用户是否关闭了本广告位
			}
		},
		computed: {
			imgUrl() {
				var d = this.data
				if (!d) return ''
				if (d.imgUrlList && d.imgUrlList.length) return d.imgUrlList[0]
				return ''
			}
		},
		mounted() {
			this.load()
		},
		beforeDestroy() {
			try {
				if (this.ad && this.ad.destroy) this.ad.destroy()
			} catch (e) {}
		},
		methods: {
			getQa() {
				try {
					var g = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : null)
					if (g && g.qa) return g.qa
				} catch (e) {}
				return null
			},
			load() {
				if (this._loaded || this._failed || this._waiting) return
				initAds().then(cfg => {
					// 合规闸门：未同意隐私政策前不发起广告请求（等待同意后自动加载）
					if (!canRequestAds()) {
						console.log('[adfeed] wait privacy')
						this._waiting = true
						onPrivacyAccepted(() => {
							this._waiting = false
							this.load()
						})
						return
					}
					if (!cfg || !cfg.enabled) {
						console.log('[adfeed] skip: disabled')
						this.$emit('fail')
						return
					}
					var qa = this.getQa()
					if (!qa || typeof qa.createNativeAd !== 'function') {
						console.log('[adfeed] skip: no api')
						this.$emit('fail')
						return
					}
					var ad
					try {
						ad = qa.createNativeAd({
							adUnitId: cfg.nativeId
						})
					} catch (e) {
						console.log('[adfeed] create err => ' + (e && e.message))
						this.$emit('fail')
						return
					}
					this._loaded = true
					ad.onError(e => {
						// 失败即隐藏广告位，不做重试（合规：请求失败禁止频繁重试）
						this._failed = true
						console.log('[adfeed] onError => ' + JSON.stringify(e))
						this.$emit('fail')
					})
					ad.onLoad(res => {
						var item = res && res.adList && res.adList[0]
						if (!item || !item.adId) {
							this._failed = true
							console.log('[adfeed] empty ad')
							this.$emit('fail')
							return
						}
						this.ad = ad
						this.data = item
						console.log('[adfeed] ready => ' + item.adId)
						this.$emit('ready')
						// 曝光上报（同环境调用；一个广告仅一次有效）
						if (!this._shown) {
							this._shown = true
							setTimeout(() => {
								try {
									this.ad.reportAdShow({
										adId: this.data.adId
									})
									console.log('[adfeed] show => ' + this.data.adId)
								} catch (e) {
									console.log('[adfeed] show err => ' + (e && (e.stack || e.message)))
								}
							}, 2000)
						}
					})
					ad.load()
					console.log('[adfeed] load called')
				}).catch(e => {
					console.log('[adfeed] init fail => ' + (e && e.message))
					this.$emit('fail')
				})
			},
			onAdClick() {
				// 点击上报（SDK 随后自动打开广告落地页）
				try {
					if (this.ad && this.data) {
						this.ad.reportAdClick({
							adId: this.data.adId
						})
						console.log('[adfeed] click => ' + this.data.adId)
					}
				} catch (e) {
					console.log('[adfeed] click err => ' + (e && (e.stack || e.message)))
				}
			},
			// 用户关闭广告：隐藏并销毁，本广告位不再展示（合规：必须有可关闭能力）
			onClose() {
				this.closed = true
				try {
					if (this.ad && this.ad.destroy) this.ad.destroy()
				} catch (e) {}
				console.log('[adfeed] closed by user')
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ad-feed {
		position: relative;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 20rpx;
		overflow: hidden;

		.ad-media {
			width: 100%;
			height: 378rpx;
			border-radius: 12rpx;
			overflow: hidden;
			margin-bottom: 20rpx;

			.ad-img {
				width: 100%;
				height: 100%;
				display: block;
			}
		}

		.ad-body {
			.ad-row {
				display: flex;
				align-items: flex-start;
				margin-bottom: 20rpx;

				.ad-icon {
					width: 64rpx;
					height: 64rpx;
					border-radius: 12rpx;
					margin-right: 16rpx;
					flex-shrink: 0;
				}

				.ad-info {
					flex: 1;
					overflow: hidden;

					.ad-title {
						font-size: 30rpx;
						color: #222222;
						font-weight: 600;
						line-height: 40rpx;
						word-break: break-all;
						/* 标题至少预留两行（≥22个汉字位置） */
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.ad-desc {
						margin-top: 6rpx;
						font-size: 24rpx;
						color: rgba(34, 34, 34, 0.4);
						line-height: 34rpx;
					}
				}
			}

			.ad-foot {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.ad-tag {
					display: flex;
					align-items: center;
					max-width: 400rpx;
					overflow: hidden;

					.ad-tag-txt {
						font-size: 20rpx;
						color: rgba(34, 34, 34, 0.35);
						border: 2rpx solid rgba(34, 34, 34, 0.15);
						border-radius: 6rpx;
						padding: 0 8rpx;
						line-height: 28rpx;
						margin-right: 10rpx;
						flex-shrink: 0;
					}

					.ad-src {
						font-size: 20rpx;
						color: rgba(34, 34, 34, 0.35);
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}

				.ad-btn {
					flex-shrink: 0;
					padding: 0 26rpx;
					height: 50rpx;
					line-height: 50rpx;
					background: #FDD000;
					border-radius: 25rpx;
					font-size: 24rpx;
					color: #000000;
				}
			}
		}

		// 关闭按钮：64rpx(≥32dp)，灰底圆、颜色可区分
		.ad-close {
			position: absolute;
			top: 12rpx;
			right: 12rpx;
			width: 64rpx;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			font-size: 30rpx;
			color: #8a8a8a;
			background: rgba(240, 240, 240, 0.92);
			border-radius: 32rpx;
		}
	}
</style>
