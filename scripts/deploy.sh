#!/usr/bin/env bash
# 在本机（远端服务器）上部署/更新 electron-memo 到 /opt/electron-memo 并重启服务
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET=/opt/electron-memo

# Node >= 17 需要 legacy provider（react-scripts 4 的 webpack 依赖旧 OpenSSL 哈希）
export NODE_OPTIONS=--openssl-legacy-provider

echo "[1/4] 类型检查 + 构建渲染层..."
(cd "$REPO_DIR" && npx tsc --noEmit && npm run build)

echo "[2/4] 同步到 $TARGET ..."
mkdir -p "$TARGET"
rsync -a --delete "$REPO_DIR/build" "$TARGET/"
install -m 644 "$REPO_DIR/main.js" "$REPO_DIR/package.json" "$REPO_DIR/ico.png" "$TARGET/"
rsync -a --delete "$REPO_DIR/node_modules" "$TARGET/"

echo "[3/4] 修正属主..."
chown -R m:m "$TARGET"

echo "[4/4] 重启服务..."
systemctl restart electron-memo.service
sleep 3
systemctl is-active electron-memo.service
echo "部署完成：$(DISPLAY=:0 XAUTHORITY=/run/user/1000/gdm/Xauthority xdotool search --name '小小备忘录' getwindowname %@ 2>/dev/null | head -1 || true)"
