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