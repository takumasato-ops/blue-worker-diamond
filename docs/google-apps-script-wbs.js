/**
 * BWD WBS自動生成スクリプト
 *
 * 使い方:
 * 1. Google Sheetsを開く
 * 2. メニュー「拡張機能」→「Apps Script」を開く
 * 3. このコードを貼り付けて保存
 * 4. 関数「createWBS」を実行（初回は権限許可が必要）
 */

function createWBS() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // === シート1: WBSマスター ===
  var wbsSheet = ss.getSheetByName("WBS") || ss.insertSheet("WBS");
  wbsSheet.clear();

  // ヘッダー
  var headers = [
    "WBS番号", "フェーズ", "カテゴリ", "タスク名", "詳細",
    "担当", "開始予定日", "完了予定日", "ステータス", "進捗率(%)",
    "実績開始日", "実績完了日", "備考"
  ];
  wbsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // ヘッダースタイル
  var headerRange = wbsSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1a1a2e");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  wbsSheet.setFrozenRows(1);

  // WBSデータ
  var data = [
    // === プロダクト開発（5月） ===
    ["1.1.1", "Phase1", "プロダクト", "独自ドメイン取得・DNS設定", "blueworkerdiamond.jp等の取得", "AI CEO少年", "2026/05/01", "2026/05/03", "未着手", 0, "", "", ""],
    ["1.1.2", "Phase1", "プロダクト", "Supabaseプロジェクト作成", "DBスキーマ設計・テーブル作成", "AI CEO少年", "2026/05/01", "2026/05/04", "未着手", 0, "", "", "Free Tier使用"],
    ["1.1.3", "Phase1", "プロダクト", "ユーザー認証実装", "メール/Googleログイン", "AI CEO少年", "2026/05/05", "2026/05/10", "未着手", 0, "", "", "Supabase Auth"],
    ["1.1.4", "Phase1", "プロダクト", "localStorage → Supabase移行", "全データをDB永続化", "AI CEO少年", "2026/05/08", "2026/05/14", "未着手", 0, "", "", ""],
    ["1.1.5", "Phase1", "プロダクト", "Stripe決済実装", "プロプラン課金機能", "AI CEO少年", "2026/05/15", "2026/05/21", "未着手", 0, "", "", ""],
    ["1.1.6", "Phase1", "プロダクト", "Google Analytics 4導入", "アクセス解析設定", "AI CEO少年", "2026/05/15", "2026/05/17", "未着手", 0, "", "", ""],
    ["1.1.7", "Phase1", "プロダクト", "OGP画像・メタデータ最適化", "SNSシェア時の表示最適化", "AI CEO少年", "2026/05/22", "2026/05/25", "未着手", 0, "", "", ""],
    ["1.1.8", "Phase1", "プロダクト", "総合テスト・バグ修正", "ローンチ前QA", "AI CEO少年", "2026/05/26", "2026/05/31", "未着手", 0, "", "", "gstack /qa使用"],

    // === ローンチ（6月） ===
    ["1.2.1", "Phase1", "プロダクト", "正式ローンチ", "本番環境公開・告知", "AI CEO少年", "2026/06/01", "2026/06/01", "未着手", 0, "", "", ""],
    ["1.2.2", "Phase1", "プロダクト", "FAQ・ヘルプ記事作成", "ユーザーサポートページ", "AI CEO少年", "2026/06/01", "2026/06/10", "未着手", 0, "", "", ""],
    ["1.2.3", "Phase1", "プロダクト", "メール配信ツール導入", "Resend or SendGrid設定", "AI CEO少年", "2026/06/01", "2026/06/05", "未着手", 0, "", "", ""],
    ["1.2.4", "Phase1", "プロダクト", "ウェルカムメール設定", "登録時の自動メール", "AI CEO少年", "2026/06/05", "2026/06/08", "未着手", 0, "", "", ""],

    // === コンテンツ拡充（7-8月） ===
    ["1.3.1", "Phase1", "プロダクト", "学習コンテンツ追加（溶接・配管）", "新規レッスン10本", "AI CEO少年", "2026/07/08", "2026/07/18", "未着手", 0, "", "", ""],
    ["1.3.2", "Phase1", "プロダクト", "試験直前対策コンテンツ", "夏の資格試験サポート", "AI CEO少年", "2026/08/01", "2026/08/07", "未着手", 0, "", "", ""],

    // === 機能強化（9-10月） ===
    ["1.4.1", "Phase1", "プロダクト", "管理ダッシュボード（企業向け）設計", "ワイヤーフレーム", "AI CEO少年", "2026/09/08", "2026/09/14", "未着手", 0, "", "", ""],
    ["1.4.2", "Phase1", "プロダクト", "管理ダッシュボード実装", "企業向け進捗管理画面", "AI CEO少年", "2026/09/15", "2026/10/07", "未着手", 0, "", "", ""],
    ["1.4.3", "Phase1", "プロダクト", "模擬試験機能設計・実装", "各資格の模擬試験", "AI CEO少年", "2026/10/01", "2026/10/14", "未着手", 0, "", "", ""],
    ["1.4.4", "Phase1", "プロダクト", "PWA対応", "スマホアプリ感覚で利用", "AI CEO少年", "2026/10/15", "2026/10/25", "未着手", 0, "", "", ""],
    ["1.4.5", "Phase1", "プロダクト", "プッシュ通知実装", "学習リマインダー", "AI CEO少年", "2026/10/22", "2026/10/31", "未着手", 0, "", "", ""],

    // === マーケティング ===
    ["2.1.1", "Phase1", "マーケティング", "X公式アカウント開設", "ブランドアカウント作成", "AI CEO少年", "2026/05/01", "2026/05/01", "未着手", 0, "", "", ""],
    ["2.1.2", "Phase1", "マーケティング", "LinkedIn企業ページ作成", "B2B向け発信基盤", "AI CEO少年", "2026/05/01", "2026/05/01", "未着手", 0, "", "", ""],
    ["2.1.3", "Phase1", "マーケティング", "Google Search Console登録", "SEO基盤", "AI CEO少年", "2026/05/15", "2026/05/17", "未着手", 0, "", "", ""],
    ["2.2.1", "Phase1", "マーケティング", "SEO記事構成案10本作成", "キーワード選定・構成", "AI CEO少年", "2026/05/22", "2026/05/31", "未着手", 0, "", "", ""],
    ["2.2.2", "Phase1", "マーケティング", "SEO記事執筆・公開（10本）", "電気工事士・フォークリフト中心", "AI CEO少年", "2026/06/01", "2026/06/30", "未着手", 0, "", "", ""],
    ["2.2.3", "Phase1", "マーケティング", "SEO記事追加（5本/月×6ヶ月）", "継続的コンテンツ制作", "AI CEO少年", "2026/07/01", "2026/12/31", "未着手", 0, "", "", "累計40本目標"],
    ["2.3.1", "Phase1", "マーケティング", "ローンチプレスリリース作成", "PR TIMES用原稿", "AI CEO少年", "2026/05/25", "2026/05/31", "未着手", 0, "", "", ""],
    ["2.3.2", "Phase1", "マーケティング", "PR TIMES配信", "ローンチ告知", "オーナー", "2026/06/01", "2026/06/03", "未着手", 0, "", "", ""],
    ["2.3.3", "Phase1", "マーケティング", "SNS毎日投稿開始", "資格豆知識・更新情報", "AI CEO少年", "2026/06/08", "2026/12/31", "未着手", 0, "", "", "毎日1-2投稿"],
    ["2.4.1", "Phase1", "マーケティング", "Google検索広告テスト", "月2万円テスト運用", "AI CEO少年", "2026/07/15", "2026/07/31", "未着手", 0, "", "", "CPA500円以下目標"],
    ["2.4.2", "Phase1", "マーケティング", "X広告テスト", "月1万円テスト運用", "AI CEO少年", "2026/07/15", "2026/07/31", "未着手", 0, "", "", "CPA300円以下目標"],
    ["2.5.1", "Phase1", "マーケティング", "合格者体験記作成（3本）", "成功事例コンテンツ", "AI CEO少年", "2026/08/08", "2026/08/31", "未着手", 0, "", "", ""],
    ["2.5.2", "Phase1", "マーケティング", "ユーザーインタビュー5件", "フィードバック収集", "AI CEO少年", "2026/06/22", "2026/06/30", "未着手", 0, "", "", ""],
    ["2.5.3", "Phase1", "マーケティング", "NPSアンケート実施", "顧客満足度調査", "AI CEO少年", "2026/10/08", "2026/10/15", "未着手", 0, "", "", "目標NPS40以上"],
    ["2.6.1", "Phase1", "マーケティング", "年末プロモーション", "「冬こそ資格！」キャンペーン", "AI CEO少年", "2026/11/15", "2026/12/31", "未着手", 0, "", "", ""],
    ["2.6.2", "Phase1", "マーケティング", "メディア寄稿（AI×ブルーカラー）", "業界メディア向け記事", "AI CEO少年", "2026/09/01", "2026/09/15", "未着手", 0, "", "", ""],

    // === 営業（B2B） ===
    ["3.1.1", "Phase1", "営業", "セールスデック作成", "PDF/Webの営業資料", "AI CEO少年", "2026/07/01", "2026/07/07", "未着手", 0, "", "", ""],
    ["3.1.2", "Phase1", "営業", "ターゲット企業リスト30社", "建設・電気工事会社", "AI CEO少年", "2026/07/01", "2026/07/04", "未着手", 0, "", "", ""],
    ["3.1.3", "Phase1", "営業", "営業メールテンプレート", "初回アプローチ用", "AI CEO少年", "2026/07/05", "2026/07/07", "未着手", 0, "", "", ""],
    ["3.1.4", "Phase1", "営業", "ROI計算シート作成", "導入効果の可視化ツール", "AI CEO少年", "2026/07/01", "2026/07/07", "未着手", 0, "", "", ""],
    ["3.2.1", "Phase1", "営業", "メール営業開始（月40社）", "継続的なアプローチ", "AI CEO少年", "2026/07/08", "2026/12/31", "未着手", 0, "", "", "返信率10%目標"],
    ["3.2.2", "Phase1", "営業", "初回商談実施", "最低2件", "AI CEO少年", "2026/07/15", "2026/07/31", "未着手", 0, "", "", ""],
    ["3.2.3", "Phase1", "営業", "B2B初契約", "スターター or プロプラン", "AI CEO少年", "2026/08/01", "2026/08/31", "未着手", 0, "", "", ""],
    ["3.2.4", "Phase1", "営業", "CRM導入", "Notion or HubSpot Free", "AI CEO少年", "2026/09/01", "2026/09/07", "未着手", 0, "", "", ""],
    ["3.3.1", "Phase1", "営業", "成功事例集PDF作成", "導入企業の声", "AI CEO少年", "2026/11/01", "2026/11/14", "未着手", 0, "", "", ""],
    ["3.3.2", "Phase1", "営業", "ハローワーク・職業訓練校への営業", "B2G開拓", "AI CEO少年", "2026/09/15", "2026/09/30", "未着手", 0, "", "", ""],

    // === 法務・経営 ===
    ["4.1.1", "Phase1", "法務・経営", "合同会社設立準備", "定款作成・書類準備", "AI CEO少年", "2026/07/15", "2026/07/31", "未着手", 0, "", "", ""],
    ["4.1.2", "Phase1", "法務・経営", "合同会社設立（登記）", "法務局への届出", "オーナー", "2026/08/01", "2026/08/15", "未着手", 0, "", "", "費用約6万円"],
    ["4.1.3", "Phase1", "法務・経営", "法人口座開設", "ネット銀行推奨", "オーナー", "2026/08/15", "2026/08/31", "未着手", 0, "", "", ""],
    ["4.2.1", "Phase1", "法務・経営", "商標出願検討", "「Blue Worker Diamond」", "AI CEO少年", "2026/08/01", "2026/08/15", "未着手", 0, "", "", "費用3-5万円"],
    ["4.3.1", "Phase1", "法務・経営", "人材紹介業許認可調査", "申請要件の確認", "AI CEO少年", "2026/11/01", "2026/11/15", "未着手", 0, "", "", ""],
    ["4.4.1", "Phase1", "法務・経営", "月次経理（収支記録）", "毎月の収支管理", "AI CEO少年", "2026/05/01", "2026/12/31", "未着手", 0, "", "", "毎月末"],
    ["4.5.1", "Phase1", "法務・経営", "2027年事業計画策定", "Phase2計画の最終化", "AI CEO少年", "2026/12/08", "2026/12/20", "未着手", 0, "", "", ""],
    ["4.5.2", "Phase1", "法務・経営", "年間実績まとめ・振り返り", "Phase1レビュー", "AI CEO少年", "2026/12/22", "2026/12/28", "未着手", 0, "", "", ""],
  ];

  if (data.length > 0) {
    wbsSheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  }

  // ステータス列に条件付き書式
  var statusRange = wbsSheet.getRange(2, 9, data.length, 1);
  var rules = wbsSheet.getConditionalFormatRules();

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("完了").setBackground("#d4edda").setFontColor("#155724")
    .setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("進行中").setBackground("#cce5ff").setFontColor("#004085")
    .setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("未着手").setBackground("#f8f9fa").setFontColor("#6c757d")
    .setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("保留").setBackground("#fff3cd").setFontColor("#856404")
    .setRanges([statusRange]).build());

  wbsSheet.setConditionalFormatRules(rules);

  // 列幅調整
  wbsSheet.setColumnWidth(1, 80);   // WBS番号
  wbsSheet.setColumnWidth(2, 70);   // フェーズ
  wbsSheet.setColumnWidth(3, 100);  // カテゴリ
  wbsSheet.setColumnWidth(4, 250);  // タスク名
  wbsSheet.setColumnWidth(5, 200);  // 詳細
  wbsSheet.setColumnWidth(6, 100);  // 担当
  wbsSheet.setColumnWidth(7, 100);  // 開始予定日
  wbsSheet.setColumnWidth(8, 100);  // 完了予定日
  wbsSheet.setColumnWidth(9, 80);   // ステータス
  wbsSheet.setColumnWidth(10, 70);  // 進捗率
  wbsSheet.setColumnWidth(11, 100); // 実績開始日
  wbsSheet.setColumnWidth(12, 100); // 実績完了日
  wbsSheet.setColumnWidth(13, 200); // 備考

  // === シート2: 日次進捗ログ ===
  var dailySheet = ss.getSheetByName("日次進捗ログ") || ss.insertSheet("日次進捗ログ");
  dailySheet.clear();

  var dailyHeaders = [
    "日付", "作業内容（午前）", "作業内容（午後）", "成果物",
    "登録ユーザー数", "MAU", "MRR（円）", "合格者数（累計）",
    "B2B導入数", "ブロッカー", "明日の予定", "オーナー確認事項"
  ];
  dailySheet.getRange(1, 1, 1, dailyHeaders.length).setValues([dailyHeaders]);

  var dailyHeaderRange = dailySheet.getRange(1, 1, 1, dailyHeaders.length);
  dailyHeaderRange.setBackground("#0a2540");
  dailyHeaderRange.setFontColor("#ffffff");
  dailyHeaderRange.setFontWeight("bold");
  dailyHeaderRange.setHorizontalAlignment("center");
  dailySheet.setFrozenRows(1);

  dailySheet.setColumnWidth(1, 100);
  dailySheet.setColumnWidth(2, 250);
  dailySheet.setColumnWidth(3, 250);
  dailySheet.setColumnWidth(4, 200);
  dailySheet.setColumnWidth(10, 200);
  dailySheet.setColumnWidth(11, 200);
  dailySheet.setColumnWidth(12, 200);

  // === シート3: 月次KPI ===
  var kpiSheet = ss.getSheetByName("月次KPI") || ss.insertSheet("月次KPI");
  kpiSheet.clear();

  var kpiHeaders = [
    "月", "登録ユーザー数", "MAU", "合格者数（累計）",
    "B2B導入企業数", "MRR（万円）", "支出（万円）", "営業利益（万円）",
    "SEO記事数（累計）", "SNSフォロワー数", "NPS",
    "撤退基準進捗（100名まで残りX名）"
  ];
  kpiSheet.getRange(1, 1, 1, kpiHeaders.length).setValues([kpiHeaders]);

  var kpiHeaderRange = kpiSheet.getRange(1, 1, 1, kpiHeaders.length);
  kpiHeaderRange.setBackground("#635bff");
  kpiHeaderRange.setFontColor("#ffffff");
  kpiHeaderRange.setFontWeight("bold");
  kpiHeaderRange.setHorizontalAlignment("center");
  kpiSheet.setFrozenRows(1);

  // 月の行を事前作成
  var months = [
    ["2026/05", 0, 0, 0, 0, 0, 2, -2, 0, 0, "", 100],
    ["2026/06", 0, 0, 0, 0, 0, 5, -5, 10, 0, "", 100],
    ["2026/07", 0, 0, 0, 0, 0, 5, -5, 15, 0, "", 100],
    ["2026/08", 0, 0, 0, 0, 0, 6, -6, 20, 0, "", 100],
    ["2026/09", 0, 0, 0, 0, 0, 6, -6, 25, 0, "", 100],
    ["2026/10", 0, 0, 0, 0, 0, 6, -6, 30, 0, "", 100],
    ["2026/11", 0, 0, 0, 0, 0, 8, -8, 35, 0, "", 100],
    ["2026/12", 0, 0, 0, 0, 0, 6, -6, 40, 0, "", 100],
  ];
  kpiSheet.getRange(2, 1, months.length, months[0].length).setValues(months);

  SpreadsheetApp.getUi().alert(
    "WBS作成完了！\n\n" +
    "・WBS: " + data.length + "タスク\n" +
    "・日次進捗ログ: 準備完了\n" +
    "・月次KPI: 8ヶ月分\n\n" +
    "撤退基準: 2026年末で登録ユーザー100名未満なら撤退"
  );
}
