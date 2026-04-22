var SPREADSHEET_ID = "1W2DlZYofoReo5wEN8EgrDaqNVSSIbgSsUl4UQZdbqIg";

function createBWD_WBS() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var json = JSON.parse(UrlFetchApp.fetch("https://raw.githubusercontent.com/placeholder/bwd-wbs.json").getContentText() || "null") || getDefaultData_();
  writeWBS_(ss, json);
  writeDashboard_(ss, json);
  Logger.log("BWD WBS 作成完了！（" + json.tasks.length + "タスク）");
}

function createBWD_WBS_local() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var json = getDefaultData_();
  writeWBS_(ss, json);
  writeDashboard_(ss, json);
  Logger.log("BWD WBS 作成完了！（" + json.tasks.length + "タスク）");
}

function doPost(e) {
  try {
    var json = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    writeWBS_(ss, json);
    writeDashboard_(ss, json);
    return ContentService.createTextOutput(JSON.stringify({status:"ok",tasks:json.tasks.length})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:"error",message:err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({status:"ok",message:"BWD WBS API ready"})).setMimeType(ContentService.MimeType.JSON);
}

function writeWBS_(ss, json) {
  var sheetName = "BWD WBS";
  var existing = ss.getSheetByName(sheetName);
  if (existing) ss.deleteSheet(existing);
  var sheet = ss.insertSheet(sheetName);
  var tasks = json.tasks;

  // 4/17〜4/30 = 14日間
  var totalDays = 14;
  var numCols = 8 + totalDays;

  var row1 = ["", "BWD WBS — 4月スプリント（4/17〜4/30）", "", "", "", "", "", ""];
  row1.push("4月");
  for (var i = 1; i < totalDays; i++) row1.push("");

  var row2 = ["", "No", "カテゴリ", "Todo", "メモ", "開始日", "終了日", "ステータス"];
  for (var d = 17; d <= 30; d++) row2.push(d);

  var allRows = [row1, row2];
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    var row = ["", t.no, t.category, t.todo, t.memo, t.start, t.end, t.status];
    while (row.length < numCols) row.push("");
    allRows.push(row);
  }
  sheet.getRange(1, 1, allRows.length, numCols).setValues(allRows);

  var lastRow = sheet.getLastRow();

  // ヘッダー
  sheet.getRange(1, 1, 1, numCols).setBackground("#0D47A1").setFontColor("#FFF").setFontWeight("bold").setFontSize(12);
  sheet.getRange(2, 1, 1, numCols).setBackground("#1565C0").setFontColor("#FFF").setFontWeight("bold").setFontSize(10);

  // 列幅
  sheet.setColumnWidth(1, 20);
  sheet.setColumnWidth(2, 35);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 350);
  sheet.setColumnWidth(5, 300);
  sheet.setColumnWidth(6, 90);
  sheet.setColumnWidth(7, 90);
  sheet.setColumnWidth(8, 75);
  for (var c = 9; c <= numCols; c++) sheet.setColumnWidth(c, 40);

  // 日付色分け（土日グレー: 4/19=土, 4/20=日, 4/26=土, 4/27=日）
  var weekendCols = [9+2, 9+3, 9+9, 9+10]; // 19,20,26,27
  for (var w = 0; w < weekendCols.length; w++) {
    if (weekendCols[w] <= numCols) {
      sheet.getRange(2, weekendCols[w], lastRow - 1, 1).setBackground("#F5F5F5");
    }
  }

  var dayColors = {
    "4/17":"#E3F2FD","4/18":"#E3F2FD",
    "4/19":"#E8F5E9","4/20":"#E8F5E9",
    "4/21":"#FFF3E0","4/22":"#FFF3E0","4/23":"#FFF3E0",
    "4/24":"#F3E5F5","4/25":"#F3E5F5",
    "4/26":"#FFEBEE","4/27":"#FFEBEE",
    "4/28":"#E0F7FA","4/29":"#E0F7FA",
    "4/30":"#FFF9C4"
  };
  var barColors = {
    "4/17":"#1565C0","4/18":"#1565C0",
    "4/19":"#2E7D32","4/20":"#2E7D32",
    "4/21":"#E65100","4/22":"#E65100","4/23":"#E65100",
    "4/24":"#7B1FA2","4/25":"#7B1FA2",
    "4/26":"#C62828","4/27":"#C62828",
    "4/28":"#00838F","4/29":"#00838F",
    "4/30":"#F9A825"
  };

  var baseDate = new Date(2026, 3, 17);

  for (var r = 3; r <= lastRow; r++) {
    var cat = String(sheet.getRange(r, 3).getValue());
    var status = String(sheet.getRange(r, 8).getValue());

    // カテゴリから日付抽出
    var dateMatch = cat.match(/4\/(\d+)/);
    var dateKey = dateMatch ? "4/" + dateMatch[1] : "";
    var bgColor = dayColors[dateKey] || "#FFFFFF";
    var barColor = barColors[dateKey] || "#4285F4";

    if (cat.indexOf("チェック") >= 0) { bgColor = "#FFCDD2"; barColor = "#D32F2F"; }

    sheet.getRange(r, 1, 1, 8).setBackground(bgColor);

    if (status === "完了") sheet.getRange(r, 8).setFontColor("#2E7D32").setFontWeight("bold");
    else if (status === "進行中") sheet.getRange(r, 8).setFontColor("#1565C0").setFontWeight("bold");

    var startStr = sheet.getRange(r, 6).getValue();
    var endStr = sheet.getRange(r, 7).getValue();
    if (!startStr || !endStr) continue;
    var s = new Date(startStr), e = new Date(endStr);
    var sc = 9 + Math.floor((s - baseDate) / 86400000);
    var ec = 9 + Math.floor((e - baseDate) / 86400000);
    if (sc < 9) sc = 9;
    if (ec > numCols) ec = numCols;
    if (sc <= ec) {
      if (status === "完了") barColor = "#B0BEC5";
      sheet.getRange(r, sc, 1, ec - sc + 1).setBackground(barColor);
    }
  }

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["未着手","進行中","完了","保留"]).setAllowInvalid(false).build();
  if (lastRow > 2) sheet.getRange(3, 8, lastRow - 2, 1).setDataValidation(statusRule);

  for (var r = 1; r <= lastRow; r++) sheet.setRowHeight(r, 28);
  sheet.getRange(1, 1, lastRow, 8).setBorder(true,true,true,true,true,true,"#CCC",SpreadsheetApp.BorderStyle.SOLID);
  sheet.setFrozenRows(2);
  sheet.setFrozenColumns(4);
}

function writeDashboard_(ss, json) {
  var d = ss.getSheetByName("ダッシュボード");
  if (!d) return;
  var total = json.tasks.length, done = 0, prog = 0;
  for (var i = 0; i < total; i++) {
    if (json.tasks[i].status === "完了") done++;
    if (json.tasks[i].status === "進行中") prog++;
  }
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;
  var lr = d.getLastRow(), bwdRow = -1;
  for (var r = 1; r <= lr; r++) { if (d.getRange(r, 1).getValue() === "BWD") { bwdRow = r; break; } }
  if (bwdRow === -1) { d.insertRowAfter(5); bwdRow = 6; }
  d.getRange(bwdRow, 1).setValue("BWD");
  d.getRange(bwdRow, 2).setValue("高").setBackground("#FF6D01").setFontColor("#FFF");
  d.getRange(bwdRow, 3).setValue(pct===100?"完了":(prog>0||done>0?"進行中":"未着手")).setFontColor("#1155CC");
  d.getRange(bwdRow, 4).setValue(json.owner||"佐藤");
  d.getRange(bwdRow, 5).setValue(json.deadline||"2026/04/30");
  d.getRange(bwdRow, 6).setValue(pct+"%");
}

function getDefaultData_() {
  return {"project":"BWD","title":"BWD WBS - 4月スプリント","owner":"佐藤","executor":"AI CEO少年","priority":"高","deadline":"2026/04/30","tasks":[
    {"no":1,"category":"4/17 インフラ","todo":"Supabase作成・DB設計・RLS","memo":"users,profiles,lesson_progress","start":"2026/04/17","end":"2026/04/17","status":"未着手"},
    {"no":2,"category":"4/17 インフラ","todo":"Supabase Auth導入","memo":"メール+Google","start":"2026/04/17","end":"2026/04/17","status":"未着手"},
    {"no":3,"category":"4/17 インフラ","todo":"localStorage→Supabase移行","memo":"データ永続化","start":"2026/04/17","end":"2026/04/17","status":"未着手"},
    {"no":4,"category":"4/18 インフラ","todo":"Stripe決済連携","memo":"Pro¥29,800/月","start":"2026/04/18","end":"2026/04/18","status":"未着手"},
    {"no":5,"category":"4/18 インフラ","todo":"Vercelデプロイ・CI/CD","memo":"GitHub連携","start":"2026/04/18","end":"2026/04/18","status":"未着手"},
    {"no":6,"category":"4/18 インフラ","todo":"ドメイン取得・DNS","memo":"blueworkerdiamond.jp","start":"2026/04/18","end":"2026/04/18","status":"未着手"},
    {"no":7,"category":"4/19 プロダクト","todo":"GA4・OGP・SEO・Search Console","memo":"全ページ最適化","start":"2026/04/19","end":"2026/04/19","status":"未着手"},
    {"no":8,"category":"4/20 テスト","todo":"結合テスト・PWA対応","memo":"一気通貫テスト","start":"2026/04/20","end":"2026/04/20","status":"未着手"},
    {"no":9,"category":"4/20 チェック","todo":"【ゲート】本番リリース準備完了","memo":"全OK→ローンチ","start":"2026/04/20","end":"2026/04/20","status":"未着手"},
    {"no":10,"category":"4/21 ローンチ","todo":"正式ローンチ+SNS告知+キャンペーン","memo":"X/LinkedIn/先着100名","start":"2026/04/21","end":"2026/04/21","status":"未着手"},
    {"no":11,"category":"4/22 コンテンツ","todo":"SEO記事#1〜3+YouTube動画","memo":"電気工事士/フォークリフト/施工管理","start":"2026/04/22","end":"2026/04/22","status":"未着手"},
    {"no":12,"category":"4/23 コンテンツ","todo":"SEO記事#4〜7+SNS運用開始","memo":"危険物/ボイラー/溶接/配管","start":"2026/04/23","end":"2026/04/23","status":"未着手"},
    {"no":13,"category":"4/24 機能","todo":"SEO記事#8〜10+模擬試験実装","memo":"10記事到達+試験機能","start":"2026/04/24","end":"2026/04/25","status":"未着手"},
    {"no":14,"category":"4/25 機能","todo":"AIチューター強化+プッシュ通知","memo":"弱点分析+リマインド","start":"2026/04/25","end":"2026/04/25","status":"未着手"},
    {"no":15,"category":"4/26 営業","todo":"営業資料+企業リスト30社+メールテンプレ","memo":"PDF/Web版","start":"2026/04/26","end":"2026/04/26","status":"未着手"},
    {"no":16,"category":"4/27 営業","todo":"メール第1弾10社+広告テスト+メルマガ設定","memo":"Google/X各¥1万","start":"2026/04/27","end":"2026/04/27","status":"未着手"},
    {"no":17,"category":"4/28 プロダクト","todo":"企業管理ダッシュボードMVP+FAQ","memo":"社員学習状況一覧","start":"2026/04/28","end":"2026/04/29","status":"未着手"},
    {"no":18,"category":"4/29 マーケ","todo":"プレスリリース配信+メール第2弾10社","memo":"PR TIMES","start":"2026/04/29","end":"2026/04/29","status":"未着手"},
    {"no":19,"category":"4/30 チェック","todo":"【KPI】登録200名/SEO10本/SNS100/商談2件","memo":"未達→5月で巻き返し","start":"2026/04/30","end":"2026/04/30","status":"未着手"},
    {"no":20,"category":"4/30 計画","todo":"5月スプリント計画策定","memo":"4月実績ベースで次月設計","start":"2026/04/30","end":"2026/04/30","status":"未着手"}
  ]};
}
