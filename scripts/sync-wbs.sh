#!/bin/bash
# BWD WBS を Google Sheets に同期するスクリプト
# 使い方: ./scripts/sync-wbs.sh
#
# 事前準備: Apps Script を Web アプリとしてデプロイし、
# 以下の WBS_API_URL にURLを設定してください。

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
WBS_FILE="$PROJECT_DIR/docs/bwd-wbs.json"

# Apps Script Web App URL（デプロイ後にここに設定）
WBS_API_URL="${WBS_API_URL:-}"

if [ -z "$WBS_API_URL" ]; then
  # .env から読み込み試行
  if [ -f "$PROJECT_DIR/.env.local" ]; then
    WBS_API_URL=$(grep '^WBS_API_URL=' "$PROJECT_DIR/.env.local" | cut -d= -f2-)
  fi
fi

if [ -z "$WBS_API_URL" ]; then
  echo "❌ WBS_API_URL が設定されていません"
  echo ""
  echo "Apps Script をデプロイ後、以下のいずれかで設定してください:"
  echo "  1) .env.local に WBS_API_URL=https://script.google.com/macros/s/xxx/exec を追加"
  echo "  2) export WBS_API_URL=https://script.google.com/macros/s/xxx/exec"
  exit 1
fi

if [ ! -f "$WBS_FILE" ]; then
  echo "❌ $WBS_FILE が見つかりません"
  exit 1
fi

echo "📊 BWD WBS を Google Sheets に同期中..."
RESPONSE=$(curl -sL -X POST \
  -H "Content-Type: application/json" \
  -d @"$WBS_FILE" \
  "$WBS_API_URL")

STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$STATUS" = "ok" ]; then
  TASKS=$(echo "$RESPONSE" | grep -o '"tasks":[0-9]*' | cut -d: -f2)
  echo "✅ 同期完了！（${TASKS}タスク）"
else
  echo "❌ 同期失敗: $RESPONSE"
  exit 1
fi
