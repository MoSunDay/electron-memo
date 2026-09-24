# 变更：中文（输入法）输入修复 / 远端 systemd 输入法环境变量

Commit: cc4edcb, c6605bb
关联: 9be4723（输入框改 TextArea 并改为回车创建）
验证: tsc --noEmit 零错；react-scripts build 通过；本地 CDP `Input.imeSetComposition` 造组合态回车不创建；远端 amos(192.168.31.196) A/B（同一构建，仅差三个环境变量）：control 组落字面量 `nihao `、fcitx 组上屏「你好」；线上生产窗口用真实 X 键实测 `nihao`→空格上屏「你好」→回车创建成功（验后已还原 localStorage）

## 为什么
- 应用侧：`onPressEnter` 只判断 `key === "Enter"`，输入法上屏的那次回车同样命中，于是 `preventDefault()` + 创建 + 清空，拼音串被当成条目，上屏也被打断。Chromium 在候选上屏时给出的仍是 `key:"Enter", keyCode:13`，只能靠组合态信息区分。
- 环境侧：应用由 systemd 服务拉起，unit 里只有 DISPLAY/XAUTHORITY/XDG_RUNTIME_DIR/DBUS_SESSION_BUS_ADDRESS/HOME，缺 `GTK_IM_MODULE`/`QT_IM_MODULE`/`XMODIFIERS`，Electron 因而接不上 fcitx5（同机 XFCE 会话里有这三个变量）。代码修好也仍打不出中文，两层都要修。

## 做了什么
- `src/components/TodoList/Input/index.tsx`：新增 `composingRef` 与 `onCompositionStart/End`；`onPressEnter` 遇到 `composingRef.current || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229` 直接 return（同时覆盖 React 合成事件与原生事件）。
- `scripts/electron-memo.service`：仓库收录远端 unit 模板并保留三个输入法环境变量；远端 `/etc/systemd/system/electron-memo.service` 已同步补齐（与 XFCE 会话一致）。
- `scripts/deploy.sh`：发布后校验运行进程 env 是否含 `GTK_IM_MODULE=fcitx`，缺失即告警。

## 影响 / 迁移
- 行为变化：组合中的回车=输入法上屏，不创建条目；普通回车仍然创建（不落换行符）。
- 运维：重建远端 unit 必须保留三个输入法环境变量，否则中文输入静默失效（deploy.sh 会告警；模板见 `scripts/electron-memo.service`）。
- 环境提示（非本应用问题）：该机 fcitx5 默认即为中文，正常打字无需触发键；`Ctrl+Space` 会让按键被吞（切到无输入法状态：无预编辑、无上屏），用 `fcitx5-remote -e` 或重启 fcitx5 复位。排查输入法问题时不要用 `Ctrl+Space` 试探。
