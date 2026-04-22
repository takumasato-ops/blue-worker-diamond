export type LessonLevel = "intro" | "basic" | "applied" | "exam";
export const LESSON_LEVELS: { id: LessonLevel; label: string; color: string }[] = [
  { id: "intro", label: "入門", color: "bg-green/10 text-green border-green/20" },
  { id: "basic", label: "基礎", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "applied", label: "応用", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "exam", label: "試験対策", color: "bg-red-100 text-red-700 border-red-200" },
];

export interface Lesson {
  id: number;
  title: string;
  videoId: string;
  cert: string;
  duration: number;
  level: LessonLevel;
  topic: string;
  quiz: { question: string; answer: string; keywords: string[] };
}

// All videoIds verified as valid (200 OK) on YouTube oembed API
export const LESSONS: Lesson[] = [
  // ===== 第二種電気工事士 =====
  { id: 101, title: "電気の基礎 - オームの法則", videoId: "EgE4tHOYNRg", cert: "第二種電気工事士", duration: 25, level: "intro", topic: "電気理論",
    quiz: { question: "オームの法則の公式を教えてください。電圧、電流、抵抗の関係は？", answer: "V = I × R（電圧 = 電流 × 抵抗）", keywords: ["電圧", "電流", "抵抗", "V", "I", "R"] } },
  { id: 102, title: "電力と電力量の計算", videoId: "cy0uxoqCrWY", cert: "第二種電気工事士", duration: 20, level: "basic", topic: "電気理論",
    quiz: { question: "電力の公式を教えてください。", answer: "P = V × I（電力 = 電圧 × 電流）", keywords: ["電力", "P", "V", "I"] } },
  { id: 103, title: "配線図の読み方 - 基本記号", videoId: "psYhVl9mgFA", cert: "第二種電気工事士", duration: 30, level: "basic", topic: "配線・施工",
    quiz: { question: "配線図でコンセントを表す記号はどのような形ですか？", answer: "横に二本線が出た記号で表される", keywords: ["コンセント", "記号", "二本"] } },
  { id: 104, title: "電線・ケーブルの種類と用途", videoId: "vtZpCuX58-c", cert: "第二種電気工事士", duration: 22, level: "applied", topic: "材料・工具",
    quiz: { question: "VVFケーブルの「VVF」は何の略ですか？", answer: "ビニル絶縁ビニルシースフラットケーブル", keywords: ["ビニル", "フラット", "絶縁"] } },
  { id: 105, title: "接地工事の種類と目的", videoId: "nTFFVWgdCG4", cert: "第二種電気工事士", duration: 18, level: "exam", topic: "法規・安全",
    quiz: { question: "D種接地工事の接地抵抗値は何オーム以下ですか？", answer: "100オーム以下", keywords: ["100", "オーム"] } },

  // ===== 第一種電気工事士 =====
  { id: 111, title: "高圧受電設備の基礎知識", videoId: "yJ5XPkyeDJ8", cert: "第一種電気工事士", duration: 30, level: "intro", topic: "高圧設備",
    quiz: { question: "高圧の電圧範囲は何ボルトから何ボルトですか？", answer: "600Vを超え7000V以下", keywords: ["600", "7000"] } },
  { id: 112, title: "変圧器の原理と構造", videoId: "oBm0yIQvBBY", cert: "第一種電気工事士", duration: 25, level: "basic", topic: "高圧設備",
    quiz: { question: "変圧器の一次側と二次側の電圧比は何によって決まりますか？", answer: "巻線の巻数比によって決まる", keywords: ["巻数", "巻線", "比"] } },
  { id: 113, title: "保護継電器の種類と動作", videoId: "GUWNEKlvd8k", cert: "第一種電気工事士", duration: 28, level: "applied", topic: "保護・制御",
    quiz: { question: "過電流継電器（OCR）はどのような場合に動作しますか？", answer: "設定値以上の電流が流れた場合に動作する", keywords: ["過電流", "設定値", "電流"] } },

  // ===== 2級施工管理技士 =====
  { id: 201, title: "施工管理の基本 - 工程管理とは", videoId: "yLEpBVFNixQ", cert: "2級施工管理技士", duration: 30, level: "intro", topic: "工程管理",
    quiz: { question: "バーチャートとネットワーク工程表の違いは？", answer: "バーチャートは各作業の期間を棒グラフで表示、ネットワーク工程表は作業間の依存関係を矢印で表現", keywords: ["バーチャート", "ネットワーク", "期間", "依存"] } },
  { id: 202, title: "品質管理の手法 - QC7つ道具", videoId: "va-j6t3g4B0", cert: "2級施工管理技士", duration: 25, level: "basic", topic: "品質管理",
    quiz: { question: "QC7つ道具に含まれるものを3つ挙げてください。", answer: "パレート図、特性要因図、ヒストグラム、管理図、散布図、チェックシート、層別", keywords: ["パレート", "特性要因", "ヒストグラム", "管理図"] } },
  { id: 203, title: "安全管理 - 労働安全衛生法の基礎", videoId: "RIf-mw8lpK8", cert: "2級施工管理技士", duration: 28, level: "applied", topic: "安全管理",
    quiz: { question: "高さ何メートル以上の作業で墜落防止措置が必要ですか？", answer: "2メートル以上", keywords: ["2", "メートル", "墜落"] } },
  { id: 204, title: "原価管理の基礎知識", videoId: "5ZnHwxXHlxo", cert: "2級施工管理技士", duration: 22, level: "exam", topic: "原価管理",
    quiz: { question: "建設工事の原価を構成する3つの要素は？", answer: "材料費、労務費、経費", keywords: ["材料費", "労務費", "経費"] } },

  // ===== 1級施工管理技士 =====
  { id: 211, title: "監理技術者の役割と責任", videoId: "l0MznTrYhcw", cert: "1級施工管理技士", duration: 30, level: "basic", topic: "法規・制度",
    quiz: { question: "監理技術者の配置が必要な工事の金額基準は？", answer: "下請契約の合計額が4500万円以上（建築一式は7000万円以上）", keywords: ["4500", "7000", "監理"] } },
  { id: 212, title: "ネットワーク工程表 - クリティカルパス", videoId: "0WhLXrYDkGg", cert: "1級施工管理技士", duration: 35, level: "applied", topic: "工程管理",
    quiz: { question: "クリティカルパスとは何ですか？", answer: "工程全体の中で最も所要日数が長い経路で、これが遅れると工期全体が遅れる", keywords: ["最長", "経路", "工期", "遅れ"] } },

  // ===== フォークリフト運転技能 =====
  { id: 301, title: "フォークリフトの構造と種類", videoId: "QZFYtkcUpz8", cert: "フォークリフト運転技能", duration: 20, level: "intro", topic: "車両構造",
    quiz: { question: "カウンターバランス式フォークリフトの特徴は？", answer: "車体後部に重り（カウンターウエイト）があり、荷物とのバランスを取る構造", keywords: ["カウンター", "重り", "バランス", "後部"] } },
  { id: 302, title: "フォークリフトの安全操作 - 基礎知識", videoId: "tMT5xPrztAw", cert: "フォークリフト運転技能", duration: 22, level: "basic", topic: "安全操作",
    quiz: { question: "フォークリフトで荷物を運搬する際、フォークの高さはどの程度に保つべきですか？", answer: "地面から15〜20cm程度の高さに保つ", keywords: ["15", "20", "cm", "地面"] } },
  { id: 303, title: "荷役作業の基本手順", videoId: "GnGzQUAktj8", cert: "フォークリフト運転技能", duration: 18, level: "applied", topic: "荷役作業",
    quiz: { question: "パレットにフォークを差し込む際の注意点は？", answer: "フォークを根元まで完全に差し込み、荷物が安定していることを確認する", keywords: ["根元", "差し込", "安定"] } },
  { id: 304, title: "関係法令と点検の重要性", videoId: "A0X6c25C0dI", cert: "フォークリフト運転技能", duration: 15, level: "exam", topic: "法規・点検",
    quiz: { question: "フォークリフトの作業開始前点検で確認すべき項目を2つ挙げてください。", answer: "ブレーキの効き、フォークの損傷・変形、タイヤの状態、油量など", keywords: ["ブレーキ", "フォーク", "点検", "タイヤ"] } },

  // ===== 危険物取扱者乙種4類 =====
  { id: 401, title: "危険物の性質 - 第4類の基礎知識", videoId: "0lYRvTm16E0", cert: "危険物取扱者乙種4類", duration: 20, level: "intro", topic: "危険物の性質",
    quiz: { question: "危険物第4類に分類される物質の共通の特徴は？", answer: "引火性液体であること。液体の表面から発生する蒸気が引火する危険性がある", keywords: ["引火", "液体", "蒸気"] } },
  { id: 402, title: "第4類危険物の分類と特徴", videoId: "_m5nZ0me3f8", cert: "危険物取扱者乙種4類", duration: 15, level: "basic", topic: "危険物の性質",
    quiz: { question: "第4類危険物の「特殊引火物」の代表例を1つ挙げ、特徴を説明してください。", answer: "ジエチルエーテル。引火点が-45℃と極めて低い", keywords: ["ジエチルエーテル", "引火点", "低"] } },
  { id: 403, title: "特殊引火物・第1石油類の性質", videoId: "OAPs19F_5AI", cert: "危険物取扱者乙種4類", duration: 18, level: "applied", topic: "危険物の性質",
    quiz: { question: "ガソリンの引火点はおよそ何度ですか？", answer: "マイナス40℃程度", keywords: ["マイナス", "-40", "40", "ガソリン"] } },
  { id: 404, title: "指定数量と製造所等の区分・法令", videoId: "I5v8rDtU7F0", cert: "危険物取扱者乙種4類", duration: 22, level: "exam", topic: "法令",
    quiz: { question: "ガソリンの指定数量は何リットルですか？", answer: "200リットル", keywords: ["200", "リットル"] } },
  { id: 405, title: "物質の状態変化 - 基礎物理学", videoId: "UsNfCG5B1LU", cert: "危険物取扱者乙種4類", duration: 15, level: "intro", topic: "物理・化学",
    quiz: { question: "液体から気体になることを何といいますか？", answer: "蒸発（気化）", keywords: ["蒸発", "気化"] } },
  { id: 406, title: "危険物とは - 消防法の基礎", videoId: "va-j6t3g4B0", cert: "危険物取扱者乙種4類", duration: 12, level: "intro", topic: "法令",
    quiz: { question: "消防法で定義される「危険物」とはどのような物質ですか？", answer: "火災の危険性が高い物質で、消防法別表に掲げられた物品", keywords: ["火災", "消防法", "危険"] } },

  // ===== 大型特殊自動車免許 =====
  { id: 501, title: "大型特殊自動車の種類と特徴", videoId: "QZFYtkcUpz8", cert: "大型特殊自動車免許", duration: 20, level: "intro", topic: "車両構造",
    quiz: { question: "大型特殊自動車に分類される車両の例を2つ挙げてください。", answer: "ショベルローダー、フォークリフト（最大荷重1t以上）、農耕トラクターなど", keywords: ["ショベル", "フォークリフト", "トラクター"] } },
  { id: 502, title: "走行時の安全確認と操作の基本", videoId: "tMT5xPrztAw", cert: "大型特殊自動車免許", duration: 25, level: "basic", topic: "安全操作",
    quiz: { question: "大型特殊自動車の公道走行時の注意点は？", answer: "車両の大きさによる死角に注意し、周囲の安全確認を徹底する", keywords: ["死角", "安全確認", "注意"] } },
  { id: 503, title: "関連法規と免許の種類", videoId: "GnGzQUAktj8", cert: "大型特殊自動車免許", duration: 18, level: "exam", topic: "法規",
    quiz: { question: "大型特殊自動車免許で運転できる車両の条件は？", answer: "特殊な構造を持つ自動車で、小型特殊自動車以外のもの", keywords: ["特殊", "構造", "小型"] } },

  // ===== 中型自動車免許 =====
  { id: 701, title: "中型自動車の車両特性と運転基礎", videoId: "tMT5xPrztAw", cert: "中型自動車免許", duration: 20, level: "intro", topic: "車両構造",
    quiz: { question: "中型自動車の車両総重量の範囲は？", answer: "7.5トン以上11トン未満", keywords: ["7.5", "11", "トン"] } },
  { id: 702, title: "安全運転のための車間距離と制動距離", videoId: "GnGzQUAktj8", cert: "中型自動車免許", duration: 18, level: "basic", topic: "安全操作",
    quiz: { question: "制動距離が長くなる主な要因を2つ挙げてください。", answer: "速度が速い、路面が濡れている、タイヤの摩耗、荷物の重量増加など", keywords: ["速度", "路面", "タイヤ", "重量"] } },
  { id: 703, title: "中型車の日常点検と法定点検", videoId: "0WhLXrYDkGg", cert: "中型自動車免許", duration: 15, level: "applied", topic: "法規・点検",
    quiz: { question: "運行前の日常点検で確認すべき項目を3つ挙げてください。", answer: "ブレーキ、タイヤ、灯火類、エンジンオイル、冷却水など", keywords: ["ブレーキ", "タイヤ", "灯火", "オイル"] } },
  { id: 704, title: "道路交通法と中型免許の関係法令", videoId: "RIf-mw8lpK8", cert: "中型自動車免許", duration: 22, level: "exam", topic: "法規",
    quiz: { question: "中型自動車免許を取得するための年齢条件は？", answer: "満18歳以上（準中型は18歳、中型は20歳以上で普通免許2年以上）", keywords: ["18", "20", "2年"] } },

  // ===== 大型自動車免許 =====
  { id: 711, title: "大型自動車の構造と運転特性", videoId: "tMT5xPrztAw", cert: "大型自動車免許", duration: 25, level: "intro", topic: "車両構造",
    quiz: { question: "大型自動車の車両総重量の基準は？", answer: "11トン以上", keywords: ["11", "トン以上"] } },
  { id: 712, title: "大型車の死角と安全確認", videoId: "GnGzQUAktj8", cert: "大型自動車免許", duration: 20, level: "basic", topic: "安全操作",
    quiz: { question: "大型車特有の内輪差とは何ですか？", answer: "カーブを曲がる際に後輪が前輪より内側を通る現象で、車両が大きいほど差が大きい", keywords: ["後輪", "前輪", "内側", "カーブ"] } },
  { id: 713, title: "大型車の荷物の積載と固定方法", videoId: "0WhLXrYDkGg", cert: "大型自動車免許", duration: 18, level: "applied", topic: "荷役作業",
    quiz: { question: "荷物を積載する際の重心の位置で注意すべき点は？", answer: "重心を低く、前後左右均等に配置し、荷崩れを防止する", keywords: ["重心", "低", "均等", "荷崩れ"] } },
  { id: 714, title: "大型免許の取得要件と関係法令", videoId: "RIf-mw8lpK8", cert: "大型自動車免許", duration: 20, level: "exam", topic: "法規",
    quiz: { question: "大型自動車免許の取得に必要な条件は？", answer: "満21歳以上で、普通免許等を3年以上保有していること", keywords: ["21", "3年", "普通免許"] } },

  // ===== ボイラー技士2級 =====
  { id: 601, title: "ボイラーの構造と種類", videoId: "0g2vbFRDbL0", cert: "ボイラー技士2級", duration: 25, level: "intro", topic: "ボイラー構造",
    quiz: { question: "丸ボイラーと水管ボイラーの違いは何ですか？", answer: "丸ボイラーは太い胴の中で水を加熱、水管ボイラーは細い管の中を水が通り加熱される", keywords: ["丸ボイラー", "水管", "胴", "管"] } },
  { id: 602, title: "ボイラーの取扱い - 運転と保守", videoId: "q9DE2EF5z_M", cert: "ボイラー技士2級", duration: 22, level: "basic", topic: "運転・保守",
    quiz: { question: "ボイラーの点火前に必ず行う操作は何ですか？", answer: "炉内の換気（プレパージ）を行い、可燃性ガスを排出する", keywords: ["換気", "プレパージ", "ガス", "排出"] } },
  { id: 603, title: "燃料と燃焼の基礎知識", videoId: "RaZ7jcjtFHw", cert: "ボイラー技士2級", duration: 20, level: "applied", topic: "燃焼理論",
    quiz: { question: "ボイラーで使用される燃料の三要素は？", answer: "燃料、空気（酸素）、温度（着火源）", keywords: ["燃料", "空気", "酸素", "温度"] } },
  { id: 604, title: "ボイラーの関係法令", videoId: "d3Hee_3Z1cI", cert: "ボイラー技士2級", duration: 18, level: "exam", topic: "法規",
    quiz: { question: "ボイラー技士の免許が必要なボイラーの基準は？", answer: "伝熱面積の合計が25平方メートル以上のボイラーを取り扱う場合", keywords: ["伝熱", "面積", "25"] } },
];
