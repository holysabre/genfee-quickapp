<template>
	<view class="content" :style="{ paddingTop: headTop + 'px' }">
		<!-- #ifdef MP-WEIXIN -->
		<view class="navigater" @click="onBack" :style="{height: barHeight + 'px' }">
			<image src="../../static/images/back.png" mode="" class="icon"></image>
			<view class="title">
				我的
			</view>
		</view>
		<!-- #endif -->
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="top">
					<view class="lBox">
						<image src="../../static/images/find.png" mode="" v-if="tab===2"></image>
						<image src="../../static/images/recruit.png" mode="" v-if="tab===1"></image>
						<text>{{item.topic.category_name}}</text>
					</view>
					<view class="rBox" @click="onPhone(item)">
						<image src="../../static/images/phone.png" mode=""></image>
						<text>立刻联系</text>
					</view>
				</view>
				<view class="detail">
					{{item.topic.content}}
				</view>
				<view class="bot">
					<image src="../../static/images/address.png" mode=""></image>
					<text>{{item.topic.address}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getContactHistory,
		addContact
	} from "@/api/index.js"
	export default {
		data() {
			return {
				headHeight: 600,
				barHeight: 0,
				windowHeight: 0,
				headTop: 0,

				page: 1,
				pageTotal: -1,
				list: []
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
		methods: {
			onBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//拨打电话
			onPhone(item) {
				addContact(item.contact_id).then(res => {
					uni.makePhoneCall({
						phoneNumber: res.data.data.mobile.toString(), //电话号码
						success: function(e) {
							console.log(e);
						},
						fail: function(e) {
							console.log(e);

						}
					})
				}).catch(err => {

				})
			},
			async getList(refresh, replace) {
				let res = await getContactHistory({
					page: this.page,
					per_page: 10,
				})
				console.log('getList-res--->', res)
				if (res.code === 200) {
					let origin = this.list
					if (replace) {
						origin = []
					}
					this.list = origin.concat(res.data.data)
					this.pageTotal = res.data.last_page
				}
				if (refresh) {
					uni.stopPullDownRefresh()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 100rpx;

		.navigater {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			position: sticky;
			z-index: 99;
			background-color: #FFE37B;

			.icon {
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
					}
				}
			}
		}
	}
</style>