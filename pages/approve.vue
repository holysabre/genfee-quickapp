<template>
	<view class="approve">
		<view class="title">
			请扫描身份证的正反面
		</view>
		<view class="note">
			正面为头像面，反面为国徽面
		</view>
		<view class="haed" @click="choosePic">
			<view class="info">
				<view class="t1">
					头像面
				</view>
				<view class="t2">
					上传身份证头像面
				</view>
			</view>
			<image :src="img" mode="aspectFit" class="imgs" v-if="img"></image>
			<image src="../static/images/img.png" mode="" class="imgs" v-else></image>
		</view>

		<view class="btn" @click="onSubmit">
			提交申请
		</view>
	</view>
</template>

<script>
	import {
		getIdentify,
	} from "@/api/index.js"
	import {
		uploadFilePath
	} from "@/utils/request.js"
	export default {
		data() {
			return {
				img: ''
			}
		},
		methods: {
			onSubmit() {
				console.log('onSubmitonSubmit=')
				if (!this.img) {
					uni.showToast({
						title: '请选择身份证头像页',
						icon: 'none'
					})
				} else {
					getIdentify({
						certificate_avatar: this.img
					}).then(res => {
						uni.showToast({
							title: '审核提交成功，请等待平台审核',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					}).catch(err => {})
				}

			},
			choosePic() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: async (res) => {
						let response = await uploadFilePath(res.tempFilePaths[0])
						if (response.code === 200) {
							this.img = response.data.data
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.approve {
		min-height: 100vh;
		background-color: #ffffff;
		padding: 20rpx 32rpx 100rpx;

		.title {
			color: #222222;
			font-size: 32rpx;
			margin-bottom: 24rpx;
		}

		.note {
			color: #666666;
			font-size: 24rpx;
			margin-bottom: 60rpx;
		}

		.haed {
			width: 686rpx;
			height: 284rpx;
			background: #F9F9F9;
			border-radius: 16rpx;
			padding: 18rpx 16rpx 18rpx 24rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 148rpx;

			.info {
				padding-top: 22rpx;
			}

			.t1 {
				color: #222222;
				font-size: 30rpx;
				font-weight: 600;
				margin-bottom: 24rpx;
			}

			.t2 {
				color: #666666;
				font-size: 26rpx;
			}

			.imgs {
				width: 372rpx;
				height: 248rpx;
			}
		}

		.btn {
			width: 686rpx;
			height: 88rpx;
			background: #FFE37B;
			border-radius: 16rpx;
			font-weight: 500;
			font-size: 30rpx;
			color: #222222;
			line-height: 88rpx;
			text-align: center;
		}
	}
</style>