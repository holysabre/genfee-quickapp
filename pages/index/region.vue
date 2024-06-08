<template>
	<view class="region">
		<view class="box">
			<view class="title">
				地区选择：
			</view>
			<view class="areaValue">
				<image src="../../static/images/region.png" mode="" class="icon"></image>
				<!-- <text v-if="address">{{address}}</text> -->
				<text v-if="!province&&province!==0">全国</text>
				<template v-else>
					<text v-if="province||province===0">{{districtsObj.provinces[province].name}}</text>

					<image v-if="city||city===0" src="../../static/images/extend.png" mode="" class="extend"></image>

					<text v-if="city||city===0">{{districtsObj.cities[city].name}}</text>

					<image v-if="area||area===0" src="../../static/images/extend.png" mode="" class="extend"></image>
					<text v-if="area||area===0">{{districtsObj.areas[area].name}}</text>
					<image v-if="street||street===0" src="../../static/images/extend.png" mode="" class="extend">
					</image>
					<text v-if="street||street===0">{{districtsObj.streets[street].name}}</text>
				</template>
				<image src="../../static/images/remove.png" mode="" class="remove" @click="close"
					v-if="province||province===0||address"></image>

			</view>
		</view>
		<view class="box" v-if="!address">
			<view class="title" :class="{active:!province&&province!==0}">
				全国
			</view>
		</view>
		<view class="box" v-if="districtsObj.provinces&&districtsObj.provinces.length>0">
			<view class="title">
				省份
			</view>
			<view class="areaList">
				<view class="areaItem" :class="{active:province===index}" v-for="(item,index) in districtsObj.provinces"
					:key="index" @click="changeItem(index,'province')">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="box" v-if="districtsObj.cities&&districtsObj.cities.length>0&&(province||province===0)">
			<view class="title">
				城市
			</view>
			<view class="areaList">
				<view class="areaItem" :class="{active:city===index}" v-for="(item,index) in districtsObj.cities"
					:key="index" @click="changeItem(index,'city')">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="box" v-if="districtsObj.areas&&districtsObj.areas.length>0&&(city||city===0)">
			<view class="title">
				区/县
			</view>
			<view class="areaList">
				<view class="areaItem" :class="{active:area===index} " v-for="(item,index) in districtsObj.areas"
					:key="index" @click="changeItem(index,'area')">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="box" v-if="districtsObj.streets&&districtsObj.streets.length>0&&(area||area===0)">
			<view class="title">
				街道/乡镇
			</view>
			<view class="areaList">
				<view class="areaItem" :class="{active:street===index} " v-for="(item,index) in districtsObj.streets"
					:key="index" @click="changeItem(index,'street')">
					{{item.name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import defaultConfig from '@/config/config.js'
	export default {
		data() {
			return {
				pickVal: [0, 0, 0],
				districtsObj: {
					provinces: [],
					cities: [],
					areas: [],
					streets: []
				},
				province: null,
				city: null,
				area: null,
				street: null,
				address: null
			}
		},
		watch: {
			// 如果地区发生变化，为了让picker联动起来，必须重置this.citys和this.areas
			// province(val) {
			// 	this.loadCities(this.districtsObj.provinces[this.province].id);
			// },
			// city(val) {
			// 	this.loadAreas(this.districtsObj.cities[this.city].id);
			// },
			// area(val) {
			// 	this.loadStreets(this.districtsObj.areas[this.area].id);
			// }
		},
		mounted() {
			if (uni.getStorageSync('streetName')) {
				this.address = uni.getStorageSync('streetName')
			}
			// setTimeout(() => {
			if (uni.getStorageSync('province') !== null) {
				this.province = uni.getStorageSync('province')
			}
			console.log('city==>', uni.getStorageSync('city'))
			if (uni.getStorageSync('city') !== null) {
				this.city = uni.getStorageSync('city')
			}
			if (uni.getStorageSync('area') !== null) {
				this.area = uni.getStorageSync('area')
			}
			if (uni.getStorageSync('street') !== null) {
				this.street = uni.getStorageSync('street')
			}
			// }, 500)

			setTimeout(() => {
				this.loadDistrict()
			}, 500)

		},
		methods: {
			close() {
				this.province = null;
				this.city = null;
				this.area = null;
				this.street = null;
				this.address = null
				uni.removeStorageSync('streetName');
				uni.removeStorageSync('streetId');
				uni.removeStorageSync('province');
				uni.removeStorageSync('city');
				uni.removeStorageSync('area');
				uni.removeStorageSync('street');
				// uni.redirectTo({
				// 	url: '/pages/index/index'
				// })
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
						this.loadCities(data.data[uni.getStorageSync('province') || 0].id)
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
						this.loadAreas(data.data[uni.getStorageSync('city') || 0].id)
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
						this.loadStreets(data.data[uni.getStorageSync('area') || 0].id)
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

			changeItem(id, type) {
				this.address = null
				this[type] = id;
				switch (type) {
					case 'province':
						this.city = null
						this.streetId = uni.setStorageSync('province', id)
						uni.setStorageSync('streetName', this.districtsObj.provinces[this.province].name);
						uni.setStorageSync('streetId', this.districtsObj.provinces[this.province].id);
						this.loadCities(this.districtsObj.provinces[this.province].id);
						this.city = null;
						this.area = null;
						this.street = null;
						uni.removeStorageSync('city');
						uni.removeStorageSync('area');
						uni.removeStorageSync('street');
						break;
					case 'city':
						this.area = null
						this.streetId = uni.setStorageSync('city', id)
						uni.setStorageSync('streetName', this.districtsObj.cities[this.city].name);
						uni.setStorageSync('streetId', this.districtsObj.cities[this.city].id);
						this.loadAreas(this.districtsObj.cities[this.city].id);
						this.area = null;
						this.street = null;
						uni.removeStorageSync('area');
						uni.removeStorageSync('street');
						break;
					case 'area':
						this.street = null
						this.streetId = uni.setStorageSync('area', id)
						uni.setStorageSync('streetName', this.districtsObj.areas[this.area].name);
						uni.setStorageSync('streetId', this.districtsObj.areas[this.area].id);
						this.loadStreets(this.districtsObj.areas[this.area].id);
						this.street = null;
						uni.removeStorageSync('street');
						break;
					default:
						this.streetId = uni.setStorageSync('street', id)
						uni.setStorageSync('streetName', this.districtsObj.streets[this.street].name);
						uni.setStorageSync('streetId', this.districtsObj.streets[this.street].id);
						break;
				}
			},
			getResult(event = null) {
				let result = {
					province: this.districtsObj.provinces[this.province],
					city: this.districtsObj.cities[this.city],
					area: this.districtsObj.areas[this.area],
					street: this.districtsObj.streets[this.street],
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	.region {
		box-sizing: border-box;
		padding: 0 30rpx 100rpx;
		min-height: 100vh;
		background-color: #fff;

		.extend {
			width: 28rpx;
			height: 28rpx;
		}

		.box {
			margin-bottom: 40rpx;

			.title {
				font-weight: 600;
				font-size: 28rpx;
				color: #222222;
			}

			.title.active {
				color: #FDD000;

			}

			.areaValue {
				font-weight: 400;
				font-size: 28rpx;
				color: #222222;
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.icon {
					width: 24rpx;
					height: 24rpx;
					margin-right: 5rpx;
				}

				.remove {
					width: 24rpx;
					height: 24rpx;
					margin-left: 5rpx;
				}
			}

			.areaList {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.areaItem {
					font-weight: 400;
					font-size: 28rpx;
					color: #999999;
					margin-right: 85rpx;
					margin-top: 40rpx;
				}

				.areaItem.active {
					color: #FDD000;
				}

				// .areaItem:nth-child(4n) {
				// 	margin-right: 0;
				// }
			}
		}
	}
</style>