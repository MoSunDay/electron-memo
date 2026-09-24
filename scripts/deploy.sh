#!/usr/bin/env bash
# 在本机（node04/ds）构建，部署到远端 amos（192.168.31.196）。
# 远端由 /etc/systemd/system/electron-memo.service 保证开机自启（首次部署需先安装该 unit，
# 模板见 scripts/electron-memo.service；该机为 LightDM，XAUTHORITY=/home/m/.Xauthority）。
# 注意：unit 内的 GTK_IM_MODULE/QT_IM_MODULE/XMODIFIERS 缺失会导致 Electron 接不到 fcitx5（中文输入失效）。
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${REMOTE:-root@192.168.31.196}"
TARGET=/opt/electron-memo

# Node >= 17 需要 legacy provider（react-scripts 4 的 webpack 依赖旧 OpenSSL 哈希）
export NODE_OPTIONS=--openssl-legacy-provider

echo "[1/4] 类型检查 + 构建渲染层..."
(cd "$REPO_DIR" && npx tsc --noEmit && npm run build)

echo "[2/4] 同步到 $REMOTE:$TARGET ..."
rsync -a --delete "$REPO_DIR/build" "$REMOTE:$TARGET/"
rsync -a "$REPO_DIR/main.js" "$REPO_DIR/package.json" "$REPO_DIR/ico.png" "$REMOTE:$TARGET/"
rsync -a --delete "$REPO_DIR/node_modules" "$REMOTE:$TARGET/"

echo "[3/4] 远端属主与日志..."
ssh "$REMOTE" "chown -R m:m $TARGET; touch /var/log/electron-memo.log; chown m:m /var/log/electron-memo.log"

echo "[4/4] 重启远端服务并验证..."
ssh "$REMOTE" 'systemctl restart electron-memo.service; sleep 5
systemctl is-active electron-memo.service
pid=$(pgrep -f "node_modules/.bin/electron \. --disable-gpu" | head -1)
tr "\0" "\n" < /proc/$pid/environ | grep -qx "GTK_IM_MODULE=fcitx" \
  || echo "警告: 服务缺少输入法环境变量，中文输入会失效（对照 scripts/electron-memo.service）" >&2
DISPLAY=:0 XAUTHORITY=/home/m/.Xauthority xdotool search --name "小小备忘录" getwindowname %@ 2>/dev/null | head -1'
echo "部署完成"
