<template>
	<view class="content" :style="{ paddingTop: headTop + 'px' }">
		<view class="navigater" :style="{height: barHeight + 'px'}">
			<image src="../../static/images/back.png" mode="" class="icon"></image>
			<view class="title">
				我的
			</view>
		</view>
		<view class="main">
			<view class="top">
				<view class="info">
					<image src="../../static/images/avatar.png" mode="" class="avatar"></image>
					<view class="rBox">
						<view class="name">
							YVHKDUG
						</view>
						<view class="uuid">
							ID：126941246791254
						</view>
					</view>
				</view>
				<view class="btn">
					授权头像昵称
				</view>
			</view>
			<view class="bot">
				<text>查看记录</text>
				<image src="../../static/images/extend.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headHeight: 600,
				barHeight: 0,
				windowHeight: 0,
				headTop: 0,

			}
		},
		onShow() {
			// 计算页面尺寸
			let sys = this.$beeMin.beesys();
			console.log('sys===>', sys)
			this.headTop = sys.top;
			this.headHeight = sys.height + 60;
			this.windowHeight = sys.windowHeight;
			this.barHeight = sys.barHeight

		},
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
					width: 182rpx;
					height: 50rpx;
					border-radius: 26rpx;
					border: 2rpx solid #FFE37B;
					font-size: 24rpx;
					color: #FFC900;
					line-height: 50rpx;
					text-align: center;
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