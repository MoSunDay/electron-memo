# 变更：备忘录窗口宽度自适应 / 输入与内容换行 / 滚动条交互

Commit: 1bb5756, 968ac32, 011b938, 9be4723, 0d46d17
关联: fce3b4b（窗口高度自适应，本次为其宽度侧补全）
验证: tsc --noEmit 零错；react-scripts build 通过；Xvfb 实测 DOM 几何（352 宽、左右留白 12/12、无横向溢出、无 DDL 黑 / 未来 DDL 黑 / 逾期红）

## 为什么
- 窗口内容宽 450 但可见内容最右仅到 x≈339，右侧近 100px 空白，观感"右边明显宽"。
- 输入为单行 Input（固定 320px），长内容无处换行；列表内容 div 固定 270px 且无断词，长 URL/连续英文直接撑破行容器。
- 滚动条经典模式挤占内容宽 6px，且与行尾删除按钮重叠；无 DDL 条目复用 TodoContent 后 1970 占位被误判逾期恒红。

## 做了什么
- WIN_W 450→352（内容最右 339.2 + 右内边距 12 取整）。
- 输入改 Input.TextArea：autoSize 1~4 行、回车创建（preventDefault 不落换行符）、撑满与列表右缘 340 齐平；输入区外层 Space 换 flex 纵向 + gap 8。
- TodoContent 固定 270 → flex:1 + minWidth:1 + word-break:break-all + pre-wrap；标题行 Space → 受限宽 flex 行 + gap 8。
- 逾期判红加 deadline.year()>1970 前置（1970=无截止日期占位）。
- .memo-scroll 改 overlay 悬浮滚动条（auto 兜底），边距带 -12/+12：滚动条贴窗口右缘，与删除按钮间隔 6px，内容右缘恒 340。
- deploy.sh 远端发布至 amos(192.168.31.196) systemd 服务，全流程已验证。

## 影响 / 迁移
- localStorage 数据结构未变，无迁移。
- 行为变化：回车=创建（不产生多行输入）；展示侧兼容历史数据中的 \n 与超长文本。
- 遗留：List/index.tsx sortList 的 filter 回调有 2 条既有 eslint array-callback-return 警告（历史遗留，非本次引入）；overflow: overlay 为 Chromium 废弃值，Electron 20 实测有效，升级被移除时回退 auto（滚动时右缘多 6px，不会坏）。
