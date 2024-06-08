<template>
	<u-popup :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto"
		:safeAreaInsetBottom="safeAreaInsetBottom" @close="close" z-index="999">
		<view class="u-picker-header" @touchmove.stop.prevent="stop" catchtouchmove="stop">
			<view class="u-btn-picker u-btn-picker--tips" hover-class="u-opacity" :hover-stay-time="150"
				@tap="getResult('cancel')">取消</view>
			<view class="u-btn-picker u-btn-picker--primary" hover-class="u-opacity" :hover-stay-time="150"
				@touchmove.stop="" @tap.stop="getResult('confirm')">确定</view>
		</view>
		<view class="u-picker-body">
			<picker-view :value="pickVal" @change="bindChange" class="u-picker-view">
				<picker-view-column>
					<view class="u-column-item" v-for="(item,index) in districtsObj.provinces" :key="index">
						<view class="u-line-1">
							{{item.name}}
						</view>
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="u-column-item" v-for="(item,index) in districtsObj.cities" :key="index">
						<view class="u-line-1">
							{{item.name}}
						</view>
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="u-column-item" v-for="(item,index) in districtsObj.areas" :key="index">
						<view class="u-line-1">
							{{item.name}}
						</view>
					</view>
				</picker-view-column>
				<picker-view-column>
					<view class="u-column-item" v-for="(item,index) in districtsObj.streets" :key="index">
						<view class="u-line-1">
							{{item.name}}
						</view>
					</view>
				</picker-view-column>
			</picker-view>
		</view>
	</u-popup>
</template>

<script>
	import defaultConfig from '@/config/config.js'
	import uPopup from './u-popup'
	export default {
		props: {
			safeAreaInsetBottom: {
				type: Boolean,
				default: false
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				pickVal: [0, 0, 0],
				districtsObj: {
					provinces: [],
					cities: [],
					areas: [],
					streets: []
				},
				province: 0,
				city: 0,
				area: 0,
				street: 0,
			}
		},
		watch: {
			// 如果地区发生变化，为了让picker联动起来，必须重置this.citys和this.areas
			province(val) {
				this.loadCities(this.districtsObj.provinces[this.province].id);
			},
			city(val) {
				this.loadAreas(this.districtsObj.cities[this.city].id);
			},
			area(val) {
				this.loadStreets(this.districtsObj.areas[this.area].id);
			}
		},
		mounted() {
			this.loadDistrict()
		},
		methods: {
			close() {
				this.$emit('input', false);
			},
			async loadDistrict() {
				this.loadProvinces()
			},
			loadProvinces() { // 加载省份
				console.log('loadProvinces==>')
				uni.request({
					url: defaultConfig.baseUrl + '/tools/regions',
					data: {
						pid: 0,
						level: 0
					},
					method: 'get',
					success: async (res) => {
						let {
							data
						} = res.data
						console.log('data==>', data)
						this.districtsObj.provinces = data.data
						this.loadCities(data.data[0].id)
					},
					fail: async (res) => {}
				})
			},
			loadCities(AreaId) {
				uni.request({
					url: defaultConfig.baseUrl + '/tools/regions',
					data: {
						pid: AreaId,
						level: 1,
					},
					method: 'get',
					success: async (res) => {
						let {
							data
						} = res.data
						this.districtsObj.cities = data.data
						this.loadAreas(data.data[0].id)
					},
					fail: async (res) => {}
				})
			},
			loadAreas(AreaId) {
				uni.request({
					url: defaultConfig.baseUrl + '/tools/regions',
					data: {
						pid: AreaId,
						level: 2,
					},
					method: 'get',
					success: async (res) => {
						let {
							data
						} = res.data
						this.districtsObj.areas = data.data
						this.loadStreets(data.data[0].id)
					},
					fail: async (res) => {}
				})
			},
			loadStreets(StreetId) {
				uni.request({
					url: defaultConfig.baseUrl + '/tools/regions',
					data: {
						pid: StreetId,
						level: 3,
					},
					method: 'get',
					success: async (res) => {
						let {
							data
						} = res.data
						this.districtsObj.streets = data.data
					},
					fail: async (res) => {}
				})
			},


			bindChange(event) {
				this.pickVal = event.detail.value;
				let i = 0;
				this.province = this.pickVal[i++];
				this.city = this.pickVal[i++];
				this.area = this.pickVal[i++];
				this.street = this.pickVal[i++];
			},
			getResult(event = null) {
				let result = {
					province: this.districtsObj.provinces[this.province],
					city: this.districtsObj.cities[this.city],
					area: this.districtsObj.areas[this.area],
					street: this.districtsObj.streets[this.street],
				}
				if (event) this.$emit(event, result);
				this.close();
			}
		},
		components: {
			uPopup
		}
	}
</script>
<style lang="scss" scoped>
	.u-datetime-picker {
		position: relative;
		z-index: 999;
	}

	.u-picker-view {
		height: 100%;
		box-sizing: border-box;
	}

	.u-picker-header {
		// border-radius: 16rpx 16rpx 0 0;
		width: 100%;
		height: 90rpx;
		padding: 0 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		font-size: 32rpx;
		// background: #ddd;
		position: relative;
	}

	.u-picker-header::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.u-picker-body {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
		background-color: #fff;
	}

	.u-column-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		padding: 0 8rpx;
	}

	.u-text {
		font-size: 24rpx;
		padding-left: 8rpx;
	}

	.u-btn-picker {
		padding: 16rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
	}

	.u-opacity {
		opacity: 0.5;
	}

	.u-btn-picker--primary {
		color: #FEC900;
		font-size: 28rpx;
	}

	.u-btn-picker--tips {
		color: #FEC900;
		font-size: 28rpx;
	}
</style>