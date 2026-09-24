# 变更：提交入口仅回车（移除“创建”按钮）/ 窗口与系统图标 / 单实例保护

Commit: 59842cf, aa65728
关联: 9be4723（回车创建）、cc4edcb（组合态回车不创建）
验证: tsc --noEmit 零错；react-scripts build 通过；远端实测——生产窗口 `_NET_WM_ICON` 已存在（此前 not found）、`/usr/share/applications/electron-memo.desktop` 通过 desktop-file-validate、二次启动退出码 1 且窗口数仍为 1、窗口 DOM 中 `button` 数 0 且正文不含“创建”、真实 X 键 `nihao`→「你好」→回车创建成功（验后已还原数据）

## 为什么
- 回车已是默认提交方式，右侧“创建”按钮是重复入口，还多占一行宽度。
- 应用在系统里没有身份：窗口未设 `_NET_WM_ICON`（任务栏/Alt-Tab 显示通用图标），也没有 .desktop 条目（系统菜单里找不到，只能靠 systemd 开机自启）。
- 补 .desktop 后即可从菜单拉起，但不加单实例保护就会与 systemd 常驻实例同时运行，两个进程争用同一 localStorage。

## 做了什么
- `src/components/TodoList/Input/index.tsx`：删除 `<Button>创建</Button>` 与 `Button` 导入，提交入口只保留 `onPressEnter`。
- `main.js`：BrowserWindow 增加 `icon: ico.png`（X11 `_NET_WM_ICON`，任务栏/Alt-Tab 图标）；`app.requestSingleInstanceLock()`，未取到锁则 `app.exit(1)`，`second-instance` 唤起并聚焦已有窗口。
- `scripts/electron-memo.desktop`：系统菜单条目（Name=小小备忘录、Icon=/opt/electron-memo/ico.png、StartupWMClass=electron-memo），由 `deploy.sh` 步骤 [4/5] 安装到 `/usr/share/applications` 并刷新 desktop 数据库。
- `scripts/deploy.sh`：新增桌面条目安装步骤，发布后仍校验输入法环境变量。

## 影响 / 迁移
- 行为变化：只能回车创建（鼠标无提交入口）；重复启动只唤起已有窗口，不再起第二个实例。
- 图标源 `ico.png` 仅 16x16，菜单/任务栏放大后会发虚；拿到更大尺寸素材时直接替换该文件即可（unit、desktop、BrowserWindow 都引用它）。
