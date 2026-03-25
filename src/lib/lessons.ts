export interface Lesson {
  id: number;
  title: string;
  videoId: string;
  cert: string;
  duration: number;
  quiz: { question: string; answer: string; keywords: string[] };
}

export const LESSONS: Lesson[] = [
  // ===== 第二種電気工事士 =====
  { id: 101, title: "電気の基礎 - オームの法則", videoId: "yLEpBVFNixQ", cert: "第二種電気工事士", duration: 25,
    quiz: { question: "オームの法則の公式を教えてください。電圧、電流、抵抗の関係は？", answer: "V = I × R（電圧 = 電流 × 抵抗）", keywords: ["電圧", "電流", "抵抗", "V", "I", "R"] } },
  { id: 102, title: "電力と電力量の計算", videoId: "yLEpBVFNixQ", cert: "第二種電気工事士", duration: 20,
    quiz: { question: "電力の公式を教えてください。", answer: "P = V × I（電力 = 電圧 × 電流）", keywords: ["電力", "P", "V", "I"] } },
  { id: 103, title: "配線図の読み方 - 基本記号", videoId: "yLEpBVFNixQ", cert: "第二種電気工事士", duration: 30,
    quiz: { question: "配線図でコンセントを表す記号はどのような形ですか？", answer: "横に二本線が出た記号で表される", keywords: ["コンセント", "記号", "二本"] } },
  { id: 104, title: "電線・ケーブルの種類と用途", videoId: "yLEpBVFNixQ", cert: "第二種電気工事士", duration: 22,
    quiz: { question: "VVFケーブルの「VVF」は何の略ですか？", answer: "ビニル絶縁ビニルシースフラットケーブル", keywords: ["ビニル", "フラット", "絶縁"] } },
  { id: 105, title: "接地工事の種類と目的", videoId: "yLEpBVFNixQ", cert: "第二種電気工事士", duration: 18,
    quiz: { question: "D種接地工事の接地抵抗値は何オーム以下ですか？", answer: "100オーム以下", keywords: ["100", "オーム"] } },

  // ===== 第一種電気工事士 =====
  { id: 111, title: "高圧受電設備の基礎知識", videoId: "yLEpBVFNixQ", cert: "第一種電気工事士", duration: 30,
    quiz: { question: "高圧の電圧範囲は何ボルトから何ボルトですか？", answer: "600Vを超え7000V以下", keywords: ["600", "7000"] } },
  { id: 112, title: "変圧器の原理と構造", videoId: "yLEpBVFNixQ", cert: "第一種電気工事士", duration: 25,
    quiz: { question: "変圧器の一次側と二次側の電圧比は何によって決まりますか？", answer: "巻線の巻数比によって決まる", keywords: ["巻数", "巻線", "比"] } },
  { id: 113, title: "保護継電器の種類と動作", videoId: "yLEpBVFNixQ", cert: "第一種電気工事士", duration: 28,
    quiz: { question: "過電流継電器（OCR）はどのような場合に動作しますか？", answer: "設定値以上の電流が流れた場合に動作する", keywords: ["過電流", "設定値", "電流"] } },

  // ===== 2級施工管理技士 =====
  { id: 201, title: "施工管理の基本 - 工程管理とは", videoId: "yLEpBVFNixQ", cert: "2級施工管理技士", duration: 30,
    quiz: { question: "バーチャートとネットワーク工程表の違いは？", answer: "バーチャートは各作業の期間を棒グラフで表示、ネットワーク工程表は作業間の依存関係を矢印で表現", keywords: ["バーチャート", "ネットワーク", "期間", "依存"] } },
  { id: 202, title: "品質管理の手法 - QC7つ道具", videoId: "yLEpBVFNixQ", cert: "2級施工管理技士", duration: 25,
    quiz: { question: "QC7つ道具に含まれるものを3つ挙げてください。", answer: "パレート図、特性要因図、ヒストグラム、管理図、散布図、チェックシート、層別", keywords: ["パレート", "特性要因", "ヒストグラム", "管理図"] } },
  { id: 203, title: "安全管理 - 労働安全衛生法の基礎", videoId: "yLEpBVFNixQ", cert: "2級施工管理技士", duration: 28,
    quiz: { question: "高さ何メートル以上の作業で墜落防止措置が必要ですか？", answer: "2メートル以上", keywords: ["2", "メートル", "墜落"] } },
  { id: 204, title: "原価管理の基礎知識", videoId: "yLEpBVFNixQ", cert: "2級施工管理技士", duration: 22,
    quiz: { question: "建設工事の原価を構成する3つの要素は？", answer: "材料費、労務費、経費", keywords: ["材料費", "労務費", "経費"] } },

  // ===== 1級施工管理技士 =====
  { id: 211, title: "監理技術者の役割と責任", videoId: "yLEpBVFNixQ", cert: "1級施工管理技士", duration: 30,
    quiz: { question: "監理技術者の配置が必要な工事の金額基準は？", answer: "下請契約の合計額が4500万円以上（建築一式は7000万円以上）", keywords: ["4500", "7000", "監理"] } },
  { id: 212, title: "ネットワーク工程表 - クリティカルパス", videoId: "yLEpBVFNixQ", cert: "1級施工管理技士", duration: 35,
    quiz: { question: "クリティカルパスとは何ですか？", answer: "工程全体の中で最も所要日数が長い経路で、これが遅れると工期全体が遅れる", keywords: ["最長", "経路", "工期", "遅れ"] } },

  // ===== フォークリフト運転技能 =====
  { id: 301, title: "フォークリフトの構造と種類", videoId: "QZFYtkcUpz8", cert: "フォークリフト運転技能", duration: 20,
    quiz: { question: "カウンターバランス式フォークリフトの特徴は？", answer: "車体後部に重り（カウンターウエイト）があり、荷物とのバランスを取る構造", keywords: ["カウンター", "重り", "バランス", "後部"] } },
  { id: 302, title: "フォークリフトの安全操作 - 基礎知識", videoId: "QZFYtkcUpz8", cert: "フォークリフト運転技能", duration: 22,
    quiz: { question: "フォークリフトで荷物を運搬する際、フォークの高さはどの程度に保つべきですか？", answer: "地面から15〜20cm程度の高さに保つ", keywords: ["15", "20", "cm", "地面"] } },
  { id: 303, title: "荷役作業の基本手順", videoId: "QZFYtkcUpz8", cert: "フォークリフト運転技能", duration: 18,
    quiz: { question: "パレットにフォークを差し込む際の注意点は？", answer: "フォークを根元まで完全に差し込み、荷物が安定していることを確認する", keywords: ["根元", "差し込", "安定"] } },
  { id: 304, title: "関係法令と点検の重要性", videoId: "QZFYtkcUpz8", cert: "フォークリフト運転技能", duration: 15,
    quiz: { question: "フォークリフトの作業開始前点検で確認すべき項目を2つ挙げてください。", answer: "ブレーキの効き、フォークの損傷・変形、タイヤの状態、油量など", keywords: ["ブレーキ", "フォーク", "点検", "タイヤ"] } },

  // ===== 危険物取扱者乙種4類 =====
  { id: 401, title: "危険物の性質 - 第4類の基礎知識", videoId: "0lYRvTm16E0", cert: "危険物取扱者乙種4類", duration: 20,
    quiz: { question: "危険物第4類に分類される物質の共通の特徴は？", answer: "引火性液体であること。液体の表面から発生する蒸気が引火する危険性がある", keywords: ["引火", "液体", "蒸気"] } },
  { id: 402, title: "第4類危険物の分類と特徴", videoId: "_m5nZ0me3f8", cert: "危険物取扱者乙種4類", duration: 15,
    quiz: { question: "第4類危険物の「特殊引火物」の代表例を1つ挙げ、特徴を説明してください。", answer: "ジエチルエーテル。引火点が-45℃と極めて低い", keywords: ["ジエチルエーテル", "引火点", "低"] } },
  { id: 403, title: "特殊引火物・第1石油類の性質", videoId: "OAPs19F_5AI", cert: "危険物取扱者乙種4類", duration: 18,
    quiz: { question: "ガソリンの引火点はおよそ何度ですか？", answer: "マイナス40℃程度", keywords: ["マイナス", "-40", "40", "ガソリン"] } },
  { id: 404, title: "指定数量と製造所等の区分・法令", videoId: "A0X6c25C0dI", cert: "危険物取扱者乙種4類", duration: 22,
    quiz: { question: "ガソリンの指定数量は何リットルですか？", answer: "200リットル", keywords: ["200", "リットル"] } },
  { id: 405, title: "物質の状態変化 - 基礎物理学", videoId: "I5v8rDtU7F0", cert: "危険物取扱者乙種4類", duration: 15,
    quiz: { question: "液体から気体になることを何といいますか？", answer: "蒸発（気化）", keywords: ["蒸発", "気化"] } },
  { id: 406, title: "危険物とは - 消防法の基礎", videoId: "UsNfCG5B1LU", cert: "危険物取扱者乙種4類", duration: 12,
    quiz: { question: "消防法で定義される「危険物」とはどのような物質ですか？", answer: "火災の危険性が高い物質で、消防法別表に掲げられた物品", keywords: ["火災", "消防法", "危険"] } },

  // ===== 大型特殊自動車免許 =====
  { id: 501, title: "大型特殊自動車の種類と特徴", videoId: "QZFYtkcUpz8", cert: "大型特殊自動車免許", duration: 20,
    quiz: { question: "大型特殊自動車に分類される車両の例を2つ挙げてください。", answer: "ショベルローダー、フォークリフト（最大荷重1t以上）、農耕トラクターなど", keywords: ["ショベル", "フォークリフト", "トラクター"] } },
  { id: 502, title: "走行時の安全確認と操作の基本", videoId: "QZFYtkcUpz8", cert: "大型特殊自動車免許", duration: 25,
    quiz: { question: "大型特殊自動車の公道走行時の最高速度制限は？", answer: "時速15km（小型特殊は時速15km、大型特殊は制限速度に従う）", keywords: ["15", "速度", "制限"] } },
  { id: 503, title: "関連法規と免許の種類", videoId: "QZFYtkcUpz8", cert: "大型特殊自動車免許", duration: 18,
    quiz: { question: "大型特殊自動車免許で運転できる車両の条件は？", answer: "特殊な構造を持つ自動車で、小型特殊自動車以外のもの", keywords: ["特殊", "構造", "小型"] } },

  // ===== ボイラー技士2級 =====
  { id: 601, title: "ボイラーの構造と種類", videoId: "yLEpBVFNixQ", cert: "ボイラー技士2級", duration: 25,
    quiz: { question: "丸ボイラーと水管ボイラーの違いは何ですか？", answer: "丸ボイラーは太い胴の中で水を加熱、水管ボイラーは細い管の中を水が通り加熱される", keywords: ["丸ボイラー", "水管", "胴", "管"] } },
  { id: 602, title: "ボイラーの取扱い - 運転と保守", videoId: "yLEpBVFNixQ", cert: "ボイラー技士2級", duration: 22,
    quiz: { question: "ボイラーの点火前に必ず行う操作は何ですか？", answer: "炉内の換気（プレパージ）を行い、可燃性ガスを排出する", keywords: ["換気", "プレパージ", "ガス", "排出"] } },
  { id: 603, title: "燃料と燃焼の基礎知識", videoId: "yLEpBVFNixQ", cert: "ボイラー技士2級", duration: 20,
    quiz: { question: "ボイラーで使用される燃料の三要素は？", answer: "燃料、空気（酸素）、温度（着火源）", keywords: ["燃料", "空気", "酸素", "温度"] } },
  { id: 604, title: "ボイラーの関係法令", videoId: "yLEpBVFNixQ", cert: "ボイラー技士2級", duration: 18,
    quiz: { question: "ボイラー技士の免許が必要なボイラーの基準は？", answer: "伝熱面積の合計が25平方メートル以上のボイラーを取り扱う場合", keywords: ["伝熱", "面積", "25"] } },
];
