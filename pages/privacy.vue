<template>
	<view class="privacy-page">
		<view class="privacy-header">
			<text class="privacy-title">隐私政策</text>
			<text class="privacy-date">更新日期：2026年10月13日</text>
		</view>
		<view class="privacy-content">
			<view class="p-section" v-for="(sec, i) in sections" :key="i">
				<view class="p-h">{{sec.h}}</view>
				<view class="p-p">{{sec.p}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sections: [{
						h: '1. 我们收集与使用的信息',
						p: '本应用为招聘信息浏览平台，招聘信息为公开展示内容。使用过程中，您选择的地区筛选偏好等数据仅保存在您的设备本机，用于为您展示对应区域的招聘信息。我们不收集您的姓名、身份证号、精确位置、通讯录、相册等个人信息，浏览内容无需注册账号。'
					},
					{
						h: '2. 信息的存储',
						p: '上述数据全部保存在您的设备本机。卸载应用或清除应用数据后，相关数据将被删除且不可恢复。'
					},
					{
						h: '3. 广告服务说明',
						p: '应用内广告由第三方广告服务（华为鲸鸿动能）提供。为完成广告投放与效果统计，广告服务会使用匿名设备标识（OAID）等设备信息。您的浏览数据不会提供给广告服务，广告内容与您的浏览记录无关。'
					},
					{
						h: '4. 您的权利与选择',
						p: '您可以在首次启动时选择是否同意本政策。未同意时，应用不会请求或展示任何广告；您仍可浏览基础内容。您也可以随时通过清除应用数据的方式删除本机保存的全部信息。'
					},
					{
						h: '5. 未成年人保护',
						p: '本应用面向求职用工需求人群。若您是未成年人，请在监护人陪同下阅读本政策并决定是否使用本应用。'
					},
					{
						h: '6. 政策的更新',
						p: '我们可能适时更新本政策。更新后将在应用内以显著方式提示，继续使用即表示您接受更新后的政策。'
					},
					{
						h: '7. 联系我们',
						p: '如您对本政策有任何疑问或建议，请通过应用内的联系方式与我们沟通。'
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.privacy-page {
		min-height: 100vh;
		background-color: #FFFFFF;
		padding: 36rpx 40rpx 80rpx;

		.privacy-header {
			margin-bottom: 32rpx;

			.privacy-title {
				display: block;
				font-size: 40rpx;
				font-weight: 600;
				color: #222222;
			}

			.privacy-date {
				display: block;
				margin-top: 12rpx;
				font-size: 24rpx;
				color: rgba(34, 34, 34, 0.4);
			}
		}

		.privacy-content {
			.p-section {
				margin-bottom: 32rpx;

				.p-h {
					font-size: 30rpx;
					font-weight: 600;
					color: #222222;
					margin-bottom: 12rpx;
				}

				.p-p {
					font-size: 28rpx;
					color: #444444;
					line-height: 48rpx;
					word-break: break-all;
				}
			}
		}
	}
</style>
