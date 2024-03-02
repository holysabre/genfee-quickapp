<template>
	<view class="content" :style="{ paddingTop: headTop + 'px' }">
		<!-- #ifdef MP-WEIXIN -->
		<view class="navigater" @click="onBack" :style="{height: barHeight + 'px'}">
			<image src="../../static/images/back.png" mode="" class="icon"></image>
			<view class="title">
				我的
			</view>
		</view>
		<!-- #endif -->

		<view class="main">
			<view class="top">
				<view class="info">
					<image :src="avatar" mode="aspectFill" class="avatar" v-if="avatar"></image>
					<image src="../../static/images/avatar.png" mode="" class="avatar" v-else></image>
					<view class="rBox">
						<view class="name">
							{{nickname||'暂无'}}
						</view>
						<view class="uuid">
							ID：{{id}}
						</view>
					</view>
				</view>
				<!-- 	<view class="btn">
					授权头像昵称
				</view> -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权头像昵称</button>
				<!-- #endif -->

				<!-- #ifdef MP-TOUTIAO -->
				<button class="btn" data-eventsync="true" @click="douyinLogin">授权头像昵称</button>
				<!-- <view class="btn" @click="douyinLogin">
					授权头像昵称
				</view> -->
				<!-- #endif -->
			</view>
			<view class="bot" @click="toRecord">
				<text>查看记录</text>
				<image src="../../static/images/extend.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		loginByWeixin,
		loginByDouyin,
		getUserInfo
	} from "@/api/index.js"
	export default {
		data() {
			return {
				headHeight: 600,
				barHeight: 0,
				windowHeight: 0,
				headTop: 0,
				id: "",
				avatar: "",
				nickname: "",
				douyinCode: ""
			}
		},
		onLoad() {
			this.getInfo()
			// #ifdef MP-TOUTIAO
			if (!uni.getStorageSync('token')) {
				this.checkLogin()
			}
			// #endif
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
		methods: {
			onBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			getInfo() {
				getUserInfo().then(res => {
					if (res.data.data.id) {
						this.id = res.data.data.id;
						this.avatar = res.data.data.avatar;
						this.nickname = res.data.data.nickname;
					}
				}).catch(err => {})
			},
			toRecord() {
				uni.navigateTo({
					url: '/pages/my/record'
				})
			},
			checkLogin() {
				console.log('checkLogincheckLogin==>')
				var that=this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log('loginRes==>', loginRes)
						that.douyinCode = loginRes.code
					}
				})
			},
			douyinLogin() {
				var that = this
				console.log('douyinLogindouyinLogin')
				if (!uni.getStorageSync('token')) {
					uni.getUserProfile({
						desc: '獲取您的昵称、头像',
						success: infoRes => {
							console.log('infoRes==>', infoRes)
							if (infoRes.errMsg === 'getUserProfile:ok') {
								let dataPhone = {
									code: that.douyinCode,
									encrypted_data: infoRes.encryptedData,
									iv: infoRes.iv,
								}
								loginByDouyin(dataPhone).then((res) => {
									console.log('loginByDouyin==>', res)
									uni.setStorageSync('token', res.data.data
										.token)
									this.id = res.data.data.user.id;
									this.avatar = res.data.data.user.avatar;
									this.nickname = res.data.data.user.nickname;
									uni.showToast({
										title: '登录成功',
										icon: 'none'
									})
								}).catch(err => {

								})
								console.log('infoRes==>', infoRes)

							} else {
								uni.showToast({
									title: '授權失敗',
									icon: 'error'
								});
							}
						},
						fail: err => {
							console.log('userInfo-err', JSON.stringify(err));
						}
					});
				} else {
					// uni.navigateTo({
					// 	url: '/platforms/mp-weixin/register/registerVersion'
					// });
				}
			},


			//微信授权手机号
			getPhoneNumber(e) {
				let that = this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let dataPhone = {
							code: loginRes.code, //uni.login获取到的code 和getPhoneNumber（e）中的code 是不一样的
							encrypted_data: e.detail.encryptedData,
							iv: e.detail.iv,
						}
						loginByWeixin(dataPhone).then((res) => {
							console.log('loginByWeixin-res==>', res)
							uni.setStorageSync('token', res.data.data.token)
							this.id = res.data.data.user.id;
							this.avatar = res.data.data.user.avatar;
							this.nickname = res.data.data.user.nickname;
							uni.showToast({
								title: '登录成功',
								icon: 'none'
							})
						}).catch(err => {

						})
						console.log('dataPhone===>', dataPhone)
						//通过这些参数走后端接口获取手机号信息实现登录
					}
				});

			},

		}

	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0rpx 40rpx;

		.navigater {
			display: flex;
			align-items: center;
			padding: 0 20rpx;

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

		.main {
			background-color: white;
			border-radius: 16rpx;
			padding: 20rpx 20rpx 40rpx 20rpx;

			.top {
				display: flex;
				justify-content: space-between;
				margin-bottom: 45rpx;

				.info {
					display: flex;
					align-items: center;

					.avatar {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}

					.rBox {
						.name {
							font-size: 28rpx;
							color: #222222;
							margin-bottom: 8rpx;
						}

						.uuid {
							font-size: 24rpx;
							color: #222222;
						}
					}
				}

				.btn {
					width: 210rpx;
					height: 50rpx;
					border-radius: 26rpx;
					border: 2rpx solid #FFE37B;
					font-size: 24rpx;
					color: #FFC900;
					line-height: 50rpx;
					text-align: center;
					background-color: transparent;
					display: block;
					margin: 0;
				}

				.btn::after {
					border: none;
				}
			}

			.bot {
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					font-size: 24rpx;
					color: #222222;
				}

				image {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
</style>