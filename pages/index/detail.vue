<template>
	<view class="detail">
		<view class="form-item form-item1">
			<view class="label">
				名称：
			</view>
			<view class="value">
				{{info.title||'暂无'}}
			</view>
		</view>
		<view class="form-item form-item1">
			<view class="label">
				需求职业：
			</view>
			<view class="tags">
				<view class="tag" v-for="(item,index) in info.topic_categories" :key="index">
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
					发布时间：{{info.published_at||'暂无'}}
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
				{{info.salary||'暂无'}}
			</view>
		</view>
		<view class="form-item form-item2" v-if="info.party!=2">
			<view class="label">
				企业单位：
			</view>
			<view class="value">
				{{info.company||'暂无'}}
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
	</view>
</template>

<script>
	import {
		addContact,
		getTopicsDetail
	} from "@/api/index.js"
	export default {
		data() {
			return {
				id: 0,
				info: {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getInfo()
			}
		},
		onPullDownRefresh() {
			this.getInfo(true)
		},
		methods: {
			async getInfo(refresh = false) {
				let res = await getTopicsDetail(this.id)
				console.log('getInfo-res--->', res)
				if (res.code === 200) {
					this.info = res.data.data
				}
				if (refresh) {
					uni.stopPullDownRefresh()
				}
			}, //拨打电话
			onPhone() {
				addContact(this.info.user_id).then(res => {
					console.log(res)
					if (res.code == 40010) {
						uni.showModal({
							title: '温馨提示',
							content: '联系对方前需要您完成实名认证。',
							cancelText: '取消',
							confirmText: '立即认证',
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

					uni.makePhoneCall({
						phoneNumber: res.data.data.mobile.toString(), //电话号码
						success: function(e) {
							console.log(e);
						},
						fail: function(e) {
							console.log(e);

						}
					})
				}).catch(err => {})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		min-height: 100vh;
		background-color: #fff;
		padding: 28rpx 32rpx;

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
			bottom: 30rpx;
			left: 35rpx;

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
	}
</style>