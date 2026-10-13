import {
	requestFun
} from '@/utils/request'

// 微信登录
export const loginByWeixin = (params) => {
	return requestFun('post', '/auth/login/wechat', params)
}

// 抖音登录
export const loginByDouyin = (params) => {
	return requestFun('post', '/auth/login/douyin', params)
}

// 获得话题列表
export const getTopics = (params) => {
	return requestFun('get', '/topics', params)
}

// 获得话题详情
// 注意：/topics/{id} 接口需要登录态（未登录返回 401），当前应用未接入登录；
// 详情页改为使用列表页传入的数据（storage 缓存），此接口保留备用。
export const getTopicsDetail = (tId) => {
	return requestFun('get', `/topics/${tId}`)
}

// 我的
export const getUserInfo = () => {
	return requestFun('get', `/users/mine`)
}

// 修改资料
export const editUser = () => {
	return requestFun('put', `/users`)
}

// 发起沟通
export const addContact = (contact_id) => {
	return requestFun('put', `/users/${contact_id}/contact`)
}

// 沟通历史
export const getContactHistory = () => {
	return requestFun('get', `/users/contact_history`)
}

// 个人认证
export const getIdentify = (params) => {
	return requestFun('post', `/users/identify/personal`, params)
}

// 全局设置（含广告开关 jhdn_ad_*）
export const getGlobalSettings = () => {
	return requestFun('get', `/settings/global`)
}