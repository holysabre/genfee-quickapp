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
				<view class="area" @click="addressShow = true">
					<text>{{address}}</text>
					<image src="../../static/images/more.png" mode=""></image>
				</view>
				<view class="tabList">
					<view class="tab tab1" @click="changeTab(2)">
						<image src="../../static/images/tabFind.png" mode="" v-if="tab!=2"></image>
						<image src="../../static/images/tabFindActive.png" mode="" v-if="tab==2"></image>
					</view>
					<view class="line"></view>
					<view class="tab tab2" @click="changeTab(1)">
						<image src="../../static/images/tabRecruit.png" mode="" v-if="tab!=1"></image>
						<image src="../../static/images/tabRecruitActive.png" mode="" v-if="tab==1"></image>
					</view>
				</view>
				<image src="../../static/images/user.png" mode="" class="user" @click="toUser"></image>
			</view>
		</view>
		<view class="list" v-if="list&&list.length>0">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="top">
					<view class="lBox">
						<image src="../../static/images/find.png" mode="" v-if="tab===2"></image>
						<image src="../../static/images/recruit.png" mode="" v-if="tab===1"></image>
						<text>{{item.category_name}}</text>
					</view>
					<view class="rBox" @click="onPhone(item)">
						<image src="../../static/images/phone.png" mode=""></image>
						<text>立刻联系</text>
					</view>
				</view>
				<view class="detail">
					{{item.content}}
				</view>
				<view class="bot">
					<image src="../../static/images/address.png" mode=""></image>
					<text class="omit1">{{item.address}}</text>
				</view>
			</view>
		</view>

		<view class="empty" v-else>
			<image src="../../static/images/empty.png" mode=""></image>
			<view class="text">
				暂无数据
			</view>
		</view>
		<pickerAddress v-model="addressShow" @confirm="addresspick" v-if="addressShow" />
	</view>
</template>

<script>
	import {
		getTopics,
		addContact
	} from "@/api/index.js"
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue'
	export default {
		data() {
			return {
				headHeight: 600,
				barHeight: 0,
				windowHeight: 0,
				headTop: 0,
				tab: 2, //1:招工,2:找活

				page: 1,
				pageTotal: -1,
				list: [],


				addressShow: false,
				address: '宁波市',
				provinceId: 0,
				cityId: 0,
				areaId: 0,
			}
		},
		components: {
			pickerAddress
		},
		onLoad() {
			this.getList(false, true)
		},
		onPullDownRefresh() {
			this.page = 1
			this.getList(true, true)
		},
		onReachBottom() {
			if (this.page < this.pageTotal) {
				this.page += 1
				this.getList(false, false)
			}
		},
		onShow() {
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
		},
		methods: {
			addresspick(obj) {
				console.log('obj===>', obj)
				this.provinceId = obj.province.id;
				this.cityId = obj.city.id;
				this.areaId = obj.area.id;
				this.address = obj.area.name
				this.page = 1
				this.getList(true, true)
			},
			toUser() {
				uni.navigateTo({
					url: '/pages/my/index'
				})
			},
			//拨打电话
			onPhone(item) {
				addContact(item.user_id).then(res => {
					console.log(res)
					if (res.code == 40010) {
						uni.showModal({
							title: '提示',
							content: '联系用户需在实名之后才能使用',
							cancelText: '取消',
							confirmText: '去实名',
							success: async res2 => {
								if (res2.confirm) {
									uni.navigateTo({
										url: '/pages/approve'
									})
								}
							},

						});
						return
					}


				}).catch(err => {})
			},
			changeTab(val) {
				this.tab = val;
				this.page = 1
				this.getList(true, true)
			},

			async getList(refresh, replace) {
				let res = await getTopics({
					page: this.page,
					per_page: 10,
					party: this.tab,
					region_id: this.areaId
				})
				console.log('getList-res--->', res)
				if (res.code === 200) {
					let origin = this.list
					if (replace) {
						origin = []
					}
					this.list = origin.concat(res.data)
					this.pageTotal = res.last_page
				}
				if (refresh) {
					uni.stopPullDownRefresh()
				}
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
			background-color: #FFE37B;
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
			margin-bottom: 8rpx;
			padding: 0 20rpx;

			.area {
				display: flex;
				align-items: center;

				text {
					margin-right: 16rpx;
					font-size: 24rpx;
					color: #222222;
				}

				image {
					width: 16rpx;
					height: 6rpx;
				}
			}

			.tabList {
				width: 354rpx;
				height: 48rpx;
				background: #FFFFFF;
				border-radius: 24rpx 24rpx 24rpx 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;

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

						image {
							width: 50rpx;
							height: 50rpx;
							margin-right: 22rpx;
						}

						text {
							font-size: 36rpx;
							color: #222222;
							font-weight: 600;
						}

					}

					.rBox {
						display: flex;
						align-items: center;
						width: 182rpx;
						height: 50rpx;
						border-radius: 26rpx;
						border: 2rpx solid #FFE37B;
						padding-left: 20rpx;

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

				.detail {
					margin-bottom: 20rpx;
					font-size: 28rpx;
					color: #222222;
					line-height: 38rpx;
				}

				.bot {
					display: flex;
					align-items: center;

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

	}
</style>