#!/usr/bin/env bash
# 在本机（node04/ds）构建，部署到远端 node02（192.168.31.57）。
# 远端由 /etc/systemd/system/electron-memo.service 保证开机自启（首次部署需先安装该 unit）。
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${REMOTE:-root@node02}"
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
DISPLAY=:0 XAUTHORITY=/run/user/1000/gdm/Xauthority xdotool search --name "小小备忘录" getwindowname %@ 2>/dev/null | head -1'
echo "部署完成"
