<template>
	<view class="content" :style="{ paddingTop: headTop + 'px' }">
		<view class="navigater" :style="{height: barHeight + 'px',top:headTop + 'px' }">
			<image src="../../static/images/back.png" mode="" class="icon"></image>
			<view class="title">
				我的
			</view>
		</view>
		<view class="list">
			<view class="item" v-for="(item,index) in 13" :key="index">
				<view class="top">
					<view class="lBox">
						<image src="../../static/images/find.png" mode="" v-if="tab===1"></image>
						<image src="../../static/images/recruit.png" mode="" v-if="tab===2"></image>
						<text>泥瓦工</text>
					</view>
					<view class="rBox">
						<image src="../../static/images/phone.png" mode=""></image>
						<text>立刻联系</text>
					</view>
				</view>
				<view class="detail">
					本人承接很多政府项目，项目想做长期的，而且稳定靠谱的，目前有长房的商业楼项目，万达的民主楼的项目在做，队伍想扩充，有兴趣的一起…
				</view>
				<view class="bot">
					<image src="../../static/images/address.png" mode=""></image>
					<text>浙江省宁波市鄞州区东吴镇</text>
				</view>
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

				tab: 1, //1:找活  2:招工
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