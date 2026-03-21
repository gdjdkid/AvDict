# AvDict 🎬

> 一个命令行查询 AV 车牌号详细信息的工具

[![npm version](https://img.shields.io/badge/version-1.2.1-blue.svg)](https://github.com/gdjdkid/AvDict)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)]()

输入一个车牌号，即可获取女优、发售日期、制作商、时长、类别等完整信息。支持多数据源自动兜底，无需手动切换。

![示例](https://raw.githubusercontent.com/gdjdkid/AvDict/master/example.gif)

---

## 功能特点

- 🔍 **多数据源自动兜底** — 依次查询 JAVBUS → NJAV → JavLibrary → JAVDB，任意一个命中即返回
- 📋 **信息完整** — 女优、男优、发售日期、时长、制作商、发行商、导演、系列、类别、封面、评分
- 💾 **本地缓存** — 查询结果缓存 7 天，减少重复请求
- 🖥️ **跨平台** — 支持 Linux、Windows、macOS
- 🎨 **彩色输出** — 终端美化显示，字段分色，清晰易读
- ⚡ **查询快速** — 直接番号拼 URL，无需登录即可使用

---

## 系统要求

- Node.js >= 18.0.0
- npm >= 6.0.0
- curl（Linux/macOS 系统自带；Windows 请确认 Git Bash 环境下可用）

---

## 支持的平台

| 平台 | JAVBUS | NJAV | JavLibrary | JAVDB |
|------|--------|------|------------|-------|
| Linux / macOS | ✅ | ✅ | ✅ | ✅ |
| Windows | ✅ | ✅ | ✅ | ❌ |

> JAVDB 在 Windows 上因 Cloudflare TLS 指纹限制无法使用，其他三个数据源在 Windows 上完全正常。

---

## 安装方法

**方式一：通过 npm 安装（推荐）**
```bash
npm install -g javdict
```

**方式二：从 GitHub 克隆安装（开发者）**
```bash
git clone https://github.com/gdjdkid/AvDict.git
cd AvDict
npm install
npm install -g .
```

**验证安装成功：**

```bash
jav -v
```

---

## 使用说明

**查询车牌号：**

```bash
jav SSIS-001
jav ABF-331
jav JUR-067
```

**输出原始 JSON 数据：**

```bash
jav -r SSIS-001
```

**清空本地缓存：**

```bash
jav --clear-cache
```

**配置 JAVDB Cookie（可选）：**

```bash
jav --setup
```

**显示帮助信息：**

```bash
jav -h
```

---

## 命令行选项

```
Usage: jav [options] [番号]

Arguments:
  番号                   要查询的车牌号，例如: SSIS-001

Options:
  -v, --version         显示版本号
  -r, --raw             以原始 JSON 格式输出结果
  --setup               配置 JAVDB Cookie（可选，提高覆盖率）
  --clear-cache         清空本地缓存
  -h, --help            显示帮助信息
```

---

## 自定义设置

### JAVDB Cookie 配置（可选）

不配置也可以正常使用，配置后可提高部分冷门番号的查询覆盖率（仅 Linux/macOS 生效）。

**获取步骤：**

1. 用 Chrome 打开 [https://javdb.com](https://javdb.com) 并登录账号
2. 安装 Chrome 插件 [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
3. 在 JAVDB 页面点击插件图标，导出 Cookie 文件
4. 找到 `_jdb_session` 那一行，复制最后一列的值
5. 运行以下命令并粘贴：

```bash
jav --setup
```

Cookie 配置保存在本地 `~/.config/javinfo/config.json`，不会上传到任何地方。

**Cookie 有效期约 2 周**，过期后重新运行 `jav --setup` 更新即可。

---

## 缓存说明

查询结果自动缓存到 `~/.config/javinfo/cache.json`，有效期 7 天。缓存可以：

- 加快重复查询速度
- 减少对数据源网站的请求压力

如需强制刷新数据，运行：

```bash
jav --clear-cache
```

---

## 常见问题

**Q: 查询失败提示 `未找到番号`？**

A: 可能原因有三个：
1. 该番号在所有数据源均未收录（极小众内容）
2. JAVDB Cookie 已过期，运行 `jav --setup` 重新配置
3. 网络无法访问数据源，请检查代理设置

**Q: Windows 上部分番号查不到？**

A: Windows 上 JAVDB 数据源因 Cloudflare 限制无法使用，少数仅收录于 JAVDB 的番号在 Windows 上无法查询。建议在 Linux 环境（如树莓派）下使用以获得最完整的查询结果。

**Q: 提示 `Permission denied`？**

A: 全局安装时需要管理员权限：
```bash
sudo npm install -g .
```

**Q: Cookie 多久需要更新一次？**

A: 通常 2 周左右，当出现冷门番号突然查不到时，运行 `jav --setup` 更新即可。

**Q: 支持 FC2 素人番号吗？**

A: 支持，输入格式为 `031926-100`（连字符格式），工具会自动识别并转换格式查询。

---

## 数据来源

| 数据源 | 网站 | 特点 |
|--------|------|------|
| JAVBUS | [javbus.com](https://www.javbus.com) | 速度快，数据丰富 |
| NJAV | [njav.com](https://www.njav.com) | 覆盖率高，无需 Cookie |
| JavLibrary | [javlibrary.com](https://www.javlibrary.com) | 数据完整，评分信息 |
| JAVDB | [javdb.com](https://javdb.com) | 数据最全，需要 Cookie |

---

## 开源协议

本项目基于 [MIT License](LICENSE) 开源，你可以自由使用、修改和分发。

---

## 如何贡献代码

欢迎提交 PR 或 Issue！

1. Fork 这个仓库
2. 创建你的功能分支：`git checkout -b feat/your-feature`
3. 提交改动：`git commit -m "feat: 描述你的改动"`
4. 推送分支：`git push origin feat/your-feature`
5. 提交 Pull Request

**Commit 规范：**
- `feat:` 新增功能
- `fix:` 修复 bug
- `docs:` 修改文档
- `chore:` 杂项维护

---

## 请作者喝一杯咖啡 ☕

如果这个工具对你有帮助，欢迎打赏支持：

| 微信支付 | 支付宝 |
|---------|--------|
| *(二维码)* | *(二维码)* |

---

## 更新日志

- **v1.2.1** — 修复代码细节，稳定性优化
- **v1.2.0** — 新增 NJAV 第四数据源，调整数据源优先级
- **v1.1.x** — 三数据源兜底，JAVDB Cookie 改为可选配置，跨平台兼容优化
- **v1.0.0** — 初始版本发布
