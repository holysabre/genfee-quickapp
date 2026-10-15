# 工蜂招工找活 — AGC（AppGallery Connect）上架操作指南

> 生成时间：2026-10-14　适用包名：`com.genfee.quickapp`　版本：1.0.0（versionCode 1）

---

## 一、发布包与素材（已就绪）

| 项目 | 位置/值 |
|---|---|
| **上架 RPK 包** | `unpackage/dist/build/quickapp-webview-huawei/.quickapp/dist/com.genfee.quickapp.rpk`（约 155KB，正式签名+压缩）|
| **签名证书 SHA256 指纹（去冒号）** | `A0A03635B9477CBCB0B26D88D79835C674E13F664853B2934D819494175D21DA` |
| 证书文件（**务必备份！**） | `sign/release/private.pem` + `sign/release/certificate.pem` |
| 应用图标（512×512） | `store/icon-512.png` |
| 应用图标（216×216） | `store/icon-216.png` |
| 应用截图 | `store/screenshot-*.png`（⏳ 待截取，需手机连接 USB）|
| 商店文案 | `store/listing.md` |
| 隐私政策 URL | `https://gongfeng-privacy.app.workbuddy.host/` |

> ⚠️ **证书安全警告**：`sign/release/` 下是应用的"身份"（已加入 .gitignore 不会提交）。
> **请立即备份到安全位置**（如私密网盘/加密U盘）。**上架后签名不可更换，丢失将无法升级应用！**

---

## 二、AGC 网站操作步骤（需要你登录操作）

### 第 1 步：确认快应用已创建

1. 打开 https://developer.huawei.com/consumer/cn/service/josp/agc/index.html 登录开发者账号
2. 「我的项目」→ 检查是否有「工蜂招工找活」快应用
   - **没有** → 创建快应用，**包名必须填 `com.genfee.quickapp`**（与 rpk 包名一致，不可更改）
   - **已有** → 进入该项目

### 第 2 步：配置证书指纹（重要，先于上传）

- 「项目设置」→「常规」→「SHA256 证书指纹」→ 点击「添加证书指纹」
- 粘贴指纹（⚠️ **必须去掉冒号**，AGC 会校验格式，带冒号会提示"无效"）：
  `A0A03635B9477CBCB0B26D88D79835C674E13F664853B2934D819494175D21DA`

### 第 3 步：上传版本

- 「版本管理」→「上传 RPK」→ 选择文件：
  `unpackage/dist/build/quickapp-webview-huawei/.quickapp/dist/com.genfee.quickapp.rpk`
- 版本号填写：`1.0.0`（versionCode 1）

### 第 4 步：填写上架资料

- 应用图标：上传 `store/icon-512.png`
- 应用截图：上传 `store/screenshot-*.png`（待截取后补充）
- 应用简介/描述：复制 `store/listing.md` 中对应文案
- 分类：生活服务 / 求职招聘
- 隐私政策：填 `https://gongfeng-privacy.app.workbuddy.host/`
- **隐私标签/数据安全**：按实际情况勾选（本应用仅本地存储浏览偏好 + 华为广告 SDK）

### 第 5 步：提交审核

- 核对无误 → 提交审核（通常 1-3 个工作日）
- 审核通过后**手动发布上架**

---

## 三、功能自检清单（提审前建议确认）

- [ ] 首页列表正常展示、可下拉刷新、可上滑加载更多
- [ ] 点击卡片可查看详情，展示正常
- [ ] 「立刻联系 / 免费联系」可拨打（未提供电话时有提示）
- [ ] 首次启动弹出隐私政策，同意后才会出现广告
- [ ] 广告卡片有「广告」标识、来源、可关闭
- [ ] 无「测试」「Demo」等字样

---

## 四、常见问题

**Q：为什么上传的 rpk 只有 155KB？**
A：release 构建启用了代码压缩（uglify），且静态资源已优化，属正常大小。

**Q：审核被驳回要求补充材料？**
A：常见要求为"广告合规说明"——广告位信息已有（原生广告：信息流卡片），可向鲸鸿动能侧补充自测材料。

**Q：如何更新版本？**
A：改动后同步递增 `manifest.json` 的 `versionName`/`versionCode` → 重新执行 release 构建 → 上传新 rpk。
（构建命令已固化在 `.workbuddy/fa_build_release.js`，可复用）

---

## 五、技术备注（供后续维护）

| 环节 | 方式 |
|---|---|
| release 编译 | HBuilderX uniapp-cli（NODE_ENV=production）→ 输出 `unpackage/dist/build/quickapp-webview-huawei` |
| release 打包+签名 | `node .workbuddy/fa_build_release.js`（sign=release + uglifyjs）|
| 签名证书查找 | fa-toolkit 自动读 `项目/sign/release/` 下证书 |
