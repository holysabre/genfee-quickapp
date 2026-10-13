<template>
	<view class="content" :style="{paddingTop: barHeight+headTop+ 50 + 'px'}">
		<view class="headTop">
			<!-- #ifdef MP-WEIXIN -->
			<view class="navigater" :style="{height: barHeight+headTop + 'px',paddingTop: headTop + 'px'}">
				<image src="../../static/images/avatar.png" mode="" class="logo"></image>
				<view class="title">
					工蜂招工找活平台
				</view>
			</view>
			<!-- #endif -->
			<view class="header">
				<view class="area" @click="toAddress">
					<text class="omit1">{{address}}</text>
					<image src="../../static/images/more.png" mode=""></image>
				</view>
				<!-- <view class="tabList">
					<view class="tab tab1" @click="changeTab(2)">
						<image src="../../static/images/tabFind.png" mode="" v-if="tab!=2"></image>
						<image src="../../static/images/tabFindActive.png" mode="" v-if="tab==2"></image>
					</view>
					<view class="line"></view>
					<view class="tab tab2" @click="changeTab(1)">
						<image src="../../static/images/tabRecruit.png" mode="" v-if="tab!=1"></image>
						<image src="../../static/images/tabRecruitActive.png" mode="" v-if="tab==1"></image>
					</view>
				</view> -->

				<view class="tabs">
					<image src="../../static/images/zzrz.png" mode=""></image>
				</view>
				<image src="../../static/images/user.png" mode="" class="user" @click="toUser"></image>
			</view>
		</view>
		<view class="list" v-if="list&&list.length>0">
			<block v-for="(item,index) in list" :key="index">
				<!-- 广告位（ad-feed 组件自治加载，每 5 条招聘后一个位置） -->
				<ad-feed v-if="item.__isAd"></ad-feed>
				<!-- 招聘卡片 -->
				<view class="item" v-else-if="!item.__isAd" @click="changeItem(item)">
					<view class="top">
						<view class="lBox">
							<image src="../../static/images/find.png" mode="" v-if="tab===2"></image>
							<image src="../../static/images/recruit.png" mode="" v-if="tab===1"></image>
							<text>{{item._cat}}</text>
						</view>

						<view class="salary ">
							{{item._salary}}
						</view>
					</view>
					<view class="detail">
						{{item.content}}
					</view>
					<view class="company">
						{{item._company}}
						<!-- item.company_nameitem.company_nameitem.company_name -->
					</view>
					<view class="bot">
						<view class="lBox">

							<view class="address">
								<image src="../../static/images/address.png" mode=""></image>
								<text class="omit1">{{item.address}}</text>
							</view>
						</view>

						<view class="rBox" @click.stop="onPhone(item)">
							<!-- <image src="../../static/images/phone.png" mode=""></image> -->
							<text>立刻联系</text>
						</view>
					</view>
				</view>
			</block>
		</view>

		<view class="empty" v-else>
			<image src="../../static/images/empty.png" mode=""></image>
			<view class="text">
				暂无数据
			</view>
		</view>
		<!-- <pickerAddress v-model="addressShow" @confirm="addresspick" v-if="addressShow" /> -->

		<!-- 隐私政策弹窗（首次启动/未同意时展示；广告合规前置：未同意不请求广告） -->
		<view class="privacy-layer" v-if="showPrivacy">
			<view class="privacy-mask"></view>
			<view class="privacy-panel">
				<view class="privacy-title">隐私政策提示</view>
				<scroll-view class="privacy-body" scroll-y>
					<text class="privacy-text">{{privacyText}}</text>
				</scroll-view>
				<view class="privacy-btns">
					<view class="p-btn p-agree" @click="onPrivacyAgree">同意并继续</view>
					<view class="p-btn p-view" @click="onPrivacyView">查看政策</view>
					<view class="p-btn p-deny" @click="onPrivacyDeny">暂不同意</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getTopics,
		addContact
	} from "@/api/index.js"
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue'
	import adFeed from '@/components/ad-feed.vue'
	import {
		isPrivacyAccepted,
		acceptPrivacy,
		PRIVACY_SUMMARY
	} from '@/utils/privacy.js'
	export default {
		data() {
			return {
				headHeight: 600,
				barHeight: 0,
				windowHeight: 0,
				headTop: 0,
				tab: 1, //1:招工,2:找活

				page: 1,
				pageTotal: -1,
				list: [],
				rawJobs: [], // 纯招聘数据（不含广告位）

				showPrivacy: false, // 隐私政策弹窗
				privacyText: PRIVACY_SUMMARY,

				addressShow: false,
				address: '全国',
				provinceId: 0,
				cityId: 0,
				areaId: 0,
				streetId: 0,
			}
		},
		components: {
			pickerAddress,
			adFeed
		},
		onLoad() {
			// this.getList(false, true)
		},
		onPullDownRefresh() {
			this.page = 1
			this.getList(true, true)
		},
		onReachBottom() {
			console.log('reachBottom page=' + this.page + '/' + this.pageTotal)
			if (this.page < this.pageTotal) {
				this.page += 1
				this.getList(false, false)
			}
		},
		onShow() {
			// 隐私政策检查（本页面实例首次进入且未同意时展示弹窗；广告合规前置）
			if (!this._privacyChecked) {
				this._privacyChecked = true
				if (!isPrivacyAccepted()) {
					this.showPrivacy = true
				}
			}
			// 计算页面尺寸
			let sys = this.$beeMin.beesys();
			console.log('sys===>', sys)
			// #ifdef MP-WEIXIN
			this.headTop = sys.top;
			// #endif
			this.headHeight = sys.height + 60;
			this.windowHeight = sys.windowHeight;
			this.barHeight = sys.barHeight

			// #ifdef MP-TOUTIAO
			this.barHeight = 0
			// #endif
			if (uni.getStorageSync('streetId')) {
				this.streetId = uni.getStorageSync('streetId')
				this.address = uni.getStorageSync('streetName')
			} else {
				this.streetId = 0
				this.address = '全国'
			}
			this.page = 1
			this.getList(false, true)
		},
		methods: {
			// 隐私政策：同意并继续（广告组件将自动开始加载）
			onPrivacyAgree() {
				acceptPrivacy()
				this.showPrivacy = false
			},
			// 隐私政策：查看完整政策（弹窗保留，返回后可继续操作）
			onPrivacyView() {
				uni.navigateTo({
					url: '/pages/privacy'
				})
			},
			// 隐私政策：暂不同意（不请求/展示广告；基础浏览不受影响）
			onPrivacyDeny() {
				this.showPrivacy = false
				uni.showToast({
					icon: 'none',
					title: '暂不同意将不展示广告；建议同意以支持我们持续提供免费服务',
					duration: 3000
				})
			},
			addresspick(obj) {
				console.log('obj===>', obj)
				this.provinceId = obj.province.id;
				this.cityId = obj.city.id;
				this.areaId = obj.area.id;
				this.streetId = obj.street.id;
				this.address = obj.street.name
				this.page = 1
				this.getList(true, true)
			},
			toAddress() {
				uni.navigateTo({
					url: '/pages/index/region'
				})
			},
			toUser() {
				uni.navigateTo({
					url: '/pages/my/index'
				})
			},
			//拨打电话
			onPhone(item) {
				var phone = item._phone || item.phone || ''
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
			changeTab(val) {
				this.tab = val;
				this.page = 1
				this.getList(true, true)
			},
			changeItem(item) {
				console.log('item===>', item)
				// 详情数据传递（/topics/{id} 接口需登录态，详情页改用列表数据）
				try {
					uni.setStorageSync('topic_detail_' + item.id, JSON.stringify(item))
				} catch (e) {}
				uni.navigateTo({
					url: '/pages/index/detail?id=' + item.id
				})
			},
			async getList(refresh, replace) {
				let res = await getTopics({
					page: this.page,
					per_page: 10,
					party: this.tab,
					region_id: this.streetId
				})
				console.log('getList-res--->', res)
				if (res.code === 200) {
					let origin = this.rawJobs
					if (replace) {
						origin = []
					}
					// topics 接口字段适配（分类/公司/电话为嵌套或异名字段，平铺为模板可直接读取的字段）
					this.rawJobs = origin.concat((res.data.data || []).map(item => this.decorateTopic(item)))
					this.rebuildList()
					this.pageTotal = res.data.last_page
					// 修正页码（服务端实际页数少于请求页时，如空页回归）
					if (this.page > this.pageTotal && this.pageTotal > 0) {
						this.page = this.pageTotal
					}
				}
				if (refresh) {
					uni.stopPullDownRefresh()
				}
			},
			// topics 数据映射：_cat / _company / _phone / _salary（快应用模板表达式能力有限，统一在此平铺）
			decorateTopic(item) {
				var cats = ''
				try {
					if (item.topic_categories && item.topic_categories.length) {
						cats = item.topic_categories.map(function(c) {
							return c.category_name || (c.category && c.category.name) || ''
						}).filter(function(x) {
							return !!x
						}).join('、')
					}
				} catch (e) {}
				var salary = (item.salary && item.salary !== '-') ? item.salary : ''
				return Object.assign({}, item, {
					_cat: cats || '其他',
					_company: item.company || '',
					_phone: item.phone || '',
					_salary: salary
				})
			},
			// 重建列表：每 5 条招聘后插入一个广告位（广告由 ad-feed 组件自治加载）
			rebuildList() {
				const out = []
				const jobs = this.rawJobs
				for (let i = 0; i < jobs.length; i++) {
					out.push(jobs[i])
					if ((i + 1) % 5 === 0) {
						out.push({
							__isAd: true,
							key: 'ad_' + (i + 1)
						})
					}
				}
				this.list = out
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 100rpx;

		.headTop {
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			background-color: #B0CBEB;
			z-index: 999;
		}

		.navigater {
			display: flex;
			align-items: center;
			padding: 0 20rpx;

			.logo {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 16rpx;
			}

			.title {
				font-size: 28rpx;
				color: #222222;
				font-weight: 600;
			}
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// margin-bottom: 8rpx;
			padding: 0 20rpx;
			position: relative;

			.area {
				display: flex;
				align-items: center;

				text {
					margin-right: 8rpx;
					font-size: 24rpx;
					color: #222222;
					max-width: 150rpx;
				}

				image {
					width: 16rpx;
					height: 6rpx;
				}
			}

			.tabs {
				width: 354rpx;
				height: 48rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.tabList {
				width: 354rpx;
				height: 48rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				// margin-left: 75rpx;
				// margin-right: 130rpx;

				.tab {
					width: 48%;
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 63rpx;
						height: 30rpx;
					}
				}

				.tab1 {
					font-family: ZhenyanGB, ZhenyanGB;
					font-weight: 400;
					font-size: 32rpx;
					color: #7FC3FD;
				}

				.tab2 {
					font-family: ZhenyanGB, ZhenyanGB;
					font-weight: 400;
					font-size: 32rpx;
					color: rgba(136, 136, 136, 0.2);
				}

				.line {
					width: 2rpx;
					height: 32rpx;
					background: #FFE37B;
				}
			}

			.user {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.list {
			padding: 0 40rpx;

			.item {
				margin-bottom: 20rpx;
				background-color: white;
				border-radius: 16rpx;
				padding: 20rpx;

				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 16rpx;

					.lBox {
						display: flex;
						align-items: center;
						max-width: 500rpx;

						image {
							width: 50rpx;
							height: 50rpx;
							margin-right: 22rpx;
						}

						text {
							font-size: 36rpx;
							color: #222222;
							font-weight: 600;
							max-width: 400rpx;
						}
					}

					.salary {
						font-weight: 600;
						font-size: 24rpx;
						color: #FD7272;
					}
				}

				.detail {
					margin-bottom: 20rpx;
					font-size: 28rpx;
					color: #222222;
					line-height: 38rpx;
					word-break: break-all;
					word-wrap: break-word;
				}

				.bot {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;

					.rBox {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 130rpx;
						height: 50rpx;
						border-radius: 26rpx;
						border: 2rpx solid #FFE37B;
						// padding-left: 20rpx;

						image {
							width: 44rpx;
							height: 44rpx;
							margin-right: 2rpx;
						}

						text {
							font-size: 24rpx;
							color: #FFC900;
							line-height: 50rpx;
						}
					}
				}

				.company {
					width: 100%;
					margin-bottom: 15rpx;
					font-size: 24rpx;
					color: rgba(34, 34, 34, 0.3);
					word-break: break-all;
					word-wrap: break-word;
				}

				.address {
					display: flex;
					align-items: center;
					max-width: 450rpx;

					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 4rpx;
					}

					text {
						font-size: 24rpx;
						color: rgba(34, 34, 34, 0.3);
						line-height: 38rpx;
						width: calc(100% - 30rpx);
					}
				}
			}
		}

		// 隐私政策弹窗
		.privacy-layer {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 2000;
			display: flex;
			align-items: center;
			justify-content: center;

			.privacy-mask {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.6);
			}

			.privacy-panel {
				position: relative;
				width: 620rpx;
				max-height: 72vh;
				background: #FFFFFF;
				border-radius: 20rpx;
				padding: 32rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;

				.privacy-title {
					font-size: 34rpx;
					font-weight: 600;
					color: #222222;
					text-align: center;
					margin-bottom: 20rpx;
				}

				.privacy-body {
					flex: 1;
					max-height: 44vh;

					.privacy-text {
						font-size: 26rpx;
						color: #444444;
						line-height: 44rpx;
						word-break: break-all;
					}
				}

				.privacy-btns {
					margin-top: 24rpx;

					.p-btn {
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						border-radius: 12rpx;
						font-size: 28rpx;
						margin-bottom: 16rpx;
					}

					.p-agree {
						background: #FDD000;
						color: #000000;
						font-weight: 600;
					}

					.p-view {
						border: 2rpx solid #FDD000;
						color: #B8860B;
						background: #FFFFFF;
					}

					.p-deny {
						color: #888888;
						font-size: 26rpx;
						margin-bottom: 0;
					}
				}
			}
		}

	}
</style>