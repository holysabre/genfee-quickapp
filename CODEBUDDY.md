# CODEBUDDY.md

本文件为在此仓库工作的 AI 助手提供指引。

## 项目概览

「工蜂招工找活平台」uni-app 客户端，**Vue 2**。核心发布目标是**华为快应用-webview 版**（`quickapp-webview-huawei`，包名 `com.genfee.quickapp`），同时兼容微信小程序（appid `wx3d729ba6e18f2280`）与抖音小程序。

- **无 package.json / npm / 构建脚本**，使用 **HBuilderX** 打开项目运行与发布（发行 → 快应用-webview / 微信小程序等）
- 构建产物在 `unpackage/`（已 gitignore）；`.workbuddy/` 同样忽略
- 后端接口：正式 `https://api.ggfee.cn/mini`，测试 `http://dev.ggfee.cn/mini`（见 `config/config.js`，切换时注意注释）

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `pages.json` | 页面注册、导航栏样式（部分页面 `navigationStyle: custom`，开启下拉刷新） |
| `main.js` | Vue 2 初始化；挂载全局 `this.$beeMin.beesys()`（状态栏/自定义导航尺寸计算） |
| `App.vue` | 全局 scss：页面底色 `#B0CBEB`、`.omit1/.omit2/.empty` 公共类；华为快应用端 `onLaunch` 调 `initAds()` |
| `api/index.js` | 全部接口函数（统一走 `requestFun`），新增接口在此追加 |
| `utils/request.js` | `uni.request` 封装（token、免登录白名单、错误 toast）；`uploadFilePath` 文件上传 |
| `utils/ads.js` | 广告配置层（只放纯函数/纯数据，跨 chunk 安全）：`initAds / getAdConfig / canRequestAds` |
| `utils/privacy.js` | 隐私政策同意状态与监听器（广告合规闸门数据源） |
| `utils/tool.js` | 工具函数：`parseTime / timeago / debounce / downloadFile` 等 |
| `components/ad-feed.vue` | 原生广告（自渲染）卡片，首页信息流与详情页联系前弹层共用 |
| `config/config.js` | baseUrl |
| `components/liudx-pickerAddress/` | 第三方省市区街道选择器（已注册但模板中未启用，首页地区选择用 `pages/index/region`） |

页面：
- `pages/index/index` 首页列表（分页 + 下拉刷新、地区筛选、隐私政策弹窗、每 5 条插入信息流广告）
- `pages/index/detail` 详情（调用 `/topics/public/{id}` 公开接口）
- `pages/index/region` 地区选择（结果写 storage `streetId` / `streetName`）
- `pages/my/index` 我的（微信/抖音授权登录）
- `pages/my/record` 沟通记录
- `pages/approve` 实名认证（上传身份证头像面）
- `pages/privacy` 隐私政策全文

## 编码约定

1. Vue 2 Options API + scss + rpx 单位 + Tab 缩进；注释用中文。
2. **条件编译是常态**：`// #ifdef MP-WEIXIN`、`MP-TOUTIAO`、`QUICKAPP-WEBVIEW-HUAWEI` 等。修改代码/样式时必须确认平台分支，跨端差异用条件编译隔离，不要破坏现有分支。
3. **快应用-webview 模板能力受限**：模板中避免复杂表达式/方法调用。列表数据在 JS 中平铺为 `_cat / _company / _phone / _salary` 等字段（见 `decorateTopic`）后再绑定。
4. **广告实例不可跨 chunk**：`qa.createNativeAd` 返回实例含闭包，创建与 `load / reportAdShow / reportAdClick / destroy` 调用必须收敛在 `components/ad-feed.vue` 内；`utils/ads.js` 不得持有广告实例。
5. **广告合规红线（鲸鸿动能自检项）**：发起广告请求前必须 `canRequestAds()`（环境可用 + 服务端未关闭 + 用户已同意隐私政策）；广告卡片根节点不可点击、必须有 ≥32dp 可区分的关闭按钮、无填充/失败即隐藏且不循环重试。改动广告相关代码时不得破坏这些约束。
6. 接口返回统一 `{ code, msg, data }`，业务成功判断 `res.code === 200`；分页取 `res.data.data` 与 `res.data.last_page`。`requestFun` 对错误也 resolve（不 reject）。
7. 登录态：token 存 storage `token`，请求头 `Authorization`；免登录白名单见 `utils/request.js`（`/auth/login/wechat`、`/topics`）。当前应用**未接入登录**；列表与详情分别使用 `/topics`、`/topics/public/{id}` 公开接口（后者无需登录态，勿改回 `/topics/{id}`）。
8. 新增页面需同步更新 `pages.json`。
9. 广告开关/广告位由服务端 `/settings/global` 下发（`jhdn_ad_enable`、`jhdn_ad_test`、`jhdn_ad_native`），默认用华为测试广告位。

## 验证方式

仓库内没有测试 / lint / 构建脚本，改动后验证途径：

- 用 HBuilderX 运行到目标端（华为快应用-webview、微信小程序模拟器）并真机自测
- 广告、隐私弹窗、拨打电话、上传等功能需真机验证
- 无法自动验证时，明确说明未验证项，不要声称已验证
