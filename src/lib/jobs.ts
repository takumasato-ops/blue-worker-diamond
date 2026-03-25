export interface Job {
  id: string;
  title: string;
  image: string;
  tags: string[];
  certs: { name: string; salary: string; hours: number; demand: string }[];
  salary: { entry: string; mid: string; senior: string };
  career: string;
  appeal: string[];
}

export interface JobCategory {
  id: string;
  name: string;
  description: string;
  jobs: Job[];
}

export const JOB_CATEGORIES: JobCategory[] = [
  {
    id: "electrical",
    name: "電気・設備",
    description: "再エネ・EV普及で需要急拡大中。手に職がつく王道キャリア",
    jobs: [
      {
        id: "electrician",
        title: "電気工事士",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
        tags: ["#国家資格", "#需要急拡大", "#独立可能"],
        certs: [
          { name: "第二種電気工事士", salary: "月給30〜38万円", hours: 80, demand: "極めて高い" },
          { name: "第一種電気工事士", salary: "月給38〜50万円", hours: 150, demand: "極めて高い" },
        ],
        salary: { entry: "年収350〜420万円", mid: "年収450〜550万円", senior: "年収600〜800万円（独立も可）" },
        career: "見習い → 一人前（3〜5年）→ 現場責任者 → 独立開業。第一種取得で高圧工事も対応可能になり、年収が大幅に上がる。独立すれば年収1,000万円超も現実的。",
        appeal: ["人手不足で求人倍率が非常に高く、未経験でも採用されやすい", "再生可能エネルギー（太陽光・EV充電）の普及で需要が急拡大中", "手に職がつくため、景気に左右されにくい安定したキャリア", "全国どこでも働けるため、地方移住にも対応可能"],
      },
      {
        id: "boiler",
        title: "ボイラー技士",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
        tags: ["#安定職", "#残業少なめ", "#長く働ける"],
        certs: [
          { name: "ボイラー技士2級", salary: "月給28〜36万円", hours: 70, demand: "中〜高" },
        ],
        salary: { entry: "年収320〜380万円", mid: "年収380〜460万円", senior: "年収460〜550万円" },
        career: "ボイラー技士 → ビルメンテナンス → 設備管理責任者。電気工事士・危険物と合わせた「ビルメン4点セット」で安定した設備管理キャリアを築ける。",
        appeal: ["ビルメンテナンス業界への入口として最適", "残業が少なく、ワークライフバランスが取りやすい", "商業施設・病院・ホテルなど勤務先の選択肢が豊富", "年齢を重ねても長く働ける職種"],
      },
      {
        id: "aircon",
        title: "空調・冷凍機械",
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
        tags: ["#データセンター需要", "#室内作業", "#ビルメン"],
        certs: [
          { name: "第三種冷凍機械責任者", salary: "月給27〜35万円", hours: 60, demand: "中〜高" },
          { name: "第二種冷凍機械責任者", salary: "月給32〜40万円", hours: 100, demand: "中〜高" },
        ],
        salary: { entry: "年収320〜380万円", mid: "年収400〜480万円", senior: "年収480〜580万円" },
        career: "空調設備メンテナンス → 冷凍・冷蔵設備管理 → 設備管理統括。ビルメン4点セットの1つとして他資格との組み合わせが強い。",
        appeal: ["データセンターの急増で冷却設備の需要が拡大", "ビルメン資格セットの中でも取得しやすい", "食品工場・物流倉庫など活躍の場が幅広い", "室内作業が中心で体力負担が少ない"],
      },
    ],
  },
  {
    id: "construction",
    name: "建設・施工管理",
    description: "2024年問題で有資格者の需要が急増。管理系でデスクワークも",
    jobs: [
      {
        id: "construction-mgr",
        title: "施工管理技士",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
        tags: ["#高年収", "#管理職", "#需要急増"],
        certs: [
          { name: "2級施工管理技士", salary: "月給35〜45万円", hours: 120, demand: "高い" },
          { name: "1級施工管理技士", salary: "月給45〜60万円", hours: 200, demand: "高い" },
        ],
        salary: { entry: "年収400〜480万円", mid: "年収500〜650万円", senior: "年収700〜900万円" },
        career: "施工管理補助 → 2級取得で主任技術者 → 1級取得で監理技術者。大型プロジェクトを統括できるようになり、ゼネコンや大手建設会社でのキャリアアップが可能。",
        appeal: ["デスクワークと現場のバランスが取れた働き方", "営業・事務経験者はコミュニケーション力が活かせる", "2024年問題（残業規制）で有資格者の需要が急増", "建設業界は慢性的な人手不足で、転職市場で非常に有利"],
      },
      {
        id: "civil-eng",
        title: "土木作業員・土木施工管理",
        image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=400&h=300&fit=crop",
        tags: ["#公共事業", "#地方にも強い", "#社会貢献"],
        certs: [
          { name: "2級土木施工管理技士", salary: "月給33〜42万円", hours: 120, demand: "高い" },
          { name: "1級土木施工管理技士", salary: "月給42〜58万円", hours: 200, demand: "高い" },
        ],
        salary: { entry: "年収350〜420万円", mid: "年収450〜580万円", senior: "年収600〜800万円" },
        career: "作業員 → 2級取得で現場代理人 → 1級で大型公共工事の監理。インフラ整備・災害復旧など社会的意義の高い仕事。",
        appeal: ["公共事業が安定的に発注され、景気に左右されにくい", "国土強靭化計画で今後も需要増加が見込まれる", "体力とマネジメント両方のスキルが身につく", "地方でも求人が豊富で、Uターン就職にも有利"],
      },
      {
        id: "scaffolding",
        title: "とび・足場組立",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
        tags: ["#短期取得", "#独立可能", "#チームワーク"],
        certs: [
          { name: "足場の組立て等作業主任者", salary: "月給30〜40万円", hours: 20, demand: "高い" },
          { name: "とび技能士2級", salary: "月給32〜42万円", hours: 80, demand: "中〜高" },
        ],
        salary: { entry: "年収350〜400万円", mid: "年収420〜520万円", senior: "年収520〜650万円（親方独立）" },
        career: "見習い → 職人 → 作業主任者 → 独立。建設現場の最初と最後に必ず必要な工程を担う、なくてはならない存在。",
        appeal: ["資格取得が短期間で可能（講習20時間）", "建設現場に必須の職種で常に需要がある", "独立して一人親方になる道もある", "チームワークが重視される仕事"],
      },
    ],
  },
  {
    id: "logistics",
    name: "物流・運輸",
    description: "EC拡大で物流業界は慢性的な人手不足。未経験からでも始めやすい",
    jobs: [
      {
        id: "forklift",
        title: "フォークリフトオペレーター",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
        tags: ["#最短4日", "#未経験OK", "#求人多数"],
        certs: [
          { name: "フォークリフト運転技能講習", salary: "月給25〜33万円", hours: 40, demand: "高い" },
        ],
        salary: { entry: "年収300〜350万円", mid: "年収350〜420万円", senior: "年収420〜500万円（管理職）" },
        career: "オペレーター → リーダー → 倉庫管理者 → 物流管理。大型免許や玉掛けなど関連資格を追加取得することでキャリアの幅が広がる。",
        appeal: ["最短4日で資格取得可能。最もハードルが低い資格の1つ", "物流・製造業で常に需要があり、求人数が非常に多い", "体力的な負担が比較的少なく、長く続けやすい", "夜勤ありの場合は手当で年収アップが見込める"],
      },
      {
        id: "truck-driver",
        title: "トラックドライバー",
        image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop",
        tags: ["#EC需要拡大", "#高収入可", "#一人の時間"],
        certs: [
          { name: "中型自動車免許", salary: "月給28〜35万円", hours: 30, demand: "高い" },
          { name: "大型自動車免許", salary: "月給33〜45万円", hours: 50, demand: "極めて高い" },
        ],
        salary: { entry: "年収350〜400万円", mid: "年収420〜520万円", senior: "年収520〜700万円（長距離・特殊）" },
        career: "中型ドライバー → 大型取得 → トレーラー → 運行管理者。危険物免許を取得すればタンクローリーなど高単価の仕事も。",
        appeal: ["2024年問題でドライバー不足が深刻化し、待遇が改善傾向", "一人の時間が多く、人間関係のストレスが少ない", "EC市場の拡大で長期的に安定した需要", "歩合制の場合、頑張り次第で高収入が可能"],
      },
      {
        id: "crane",
        title: "クレーン・玉掛け",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
        tags: ["#講習のみ", "#幅広い業界", "#セット取得有利"],
        certs: [
          { name: "玉掛け技能講習", salary: "月給27〜35万円", hours: 20, demand: "高い" },
          { name: "小型移動式クレーン運転技能講習", salary: "月給30〜38万円", hours: 20, demand: "高い" },
        ],
        salary: { entry: "年収330〜380万円", mid: "年収400〜480万円", senior: "年収480〜600万円" },
        career: "玉掛け作業者 → クレーンオペレーター → 複数資格取得でマルチオペレーター。建設・港湾・製造と活躍の場が広い。",
        appeal: ["講習のみで取得可能（試験なし）", "建設・製造・港湾など幅広い業界で必要とされる", "フォークリフトとセットで取得すると就職に非常に有利", "技術を極めればスペシャリストとして重宝される"],
      },
    ],
  },
  {
    id: "heavy-equipment",
    name: "重機・特殊車両",
    description: "建設・土木の現場で不可欠。機械好きにはたまらない職種群",
    jobs: [
      {
        id: "heavy-vehicle",
        title: "重機オペレーター",
        image: "https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?w=400&h=300&fit=crop",
        tags: ["#高需要", "#機械操作", "#災害復旧"],
        certs: [
          { name: "車両系建設機械運転技能講習（整地等）", salary: "月給30〜40万円", hours: 40, demand: "高い" },
          { name: "車両系建設機械運転技能講習（解体用）", salary: "月給32〜42万円", hours: 40, demand: "高い" },
        ],
        salary: { entry: "年収350〜420万円", mid: "年収420〜520万円", senior: "年収520〜650万円" },
        career: "重機オペレーター → 多機種対応 → 現場責任者。ショベル・ブルドーザーなど複数の操作資格を取得するほど年収が上がる。",
        appeal: ["建設・土木・解体業界で常に高い需要", "機械操作が好きな人に向いている", "技術を極めれば替えの利かない人材になれる", "災害復旧など社会貢献性の高い仕事にも携われる"],
      },
      {
        id: "special-vehicle",
        title: "大型特殊自動車",
        image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop",
        tags: ["#合格率高い", "#基礎免許", "#多方面で活躍"],
        certs: [
          { name: "大型特殊自動車免許", salary: "月給30〜40万円", hours: 60, demand: "高い" },
        ],
        salary: { entry: "年収350〜420万円", mid: "年収420〜520万円", senior: "年収520〜650万円" },
        career: "特殊車両オペレーター → 複数免許取得 → 現場管理者。除雪車・農業機械など季節性のある仕事も。",
        appeal: ["教習所で取得でき、合格率が高い", "重機オペレーターの基礎免許として必須", "農業・林業・除雪など多方面で活躍", "他の建設系資格との組み合わせで市場価値向上"],
      },
    ],
  },
  {
    id: "chemical-safety",
    name: "化学・安全管理",
    description: "工場・プラントの安全を守る専門職。安定性が高く長く働ける",
    jobs: [
      {
        id: "hazmat",
        title: "危険物取扱者",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
        tags: ["#試験回数多い", "#組み合わせ◎", "#屋内作業"],
        certs: [
          { name: "危険物取扱者乙種4類", salary: "月給27〜35万円", hours: 50, demand: "中〜高" },
        ],
        salary: { entry: "年収320〜380万円", mid: "年収380〜450万円", senior: "年収450〜550万円" },
        career: "ガソリンスタンド・化学工場・石油プラントなどで活躍。甲種取得やボイラー技士との組み合わせで、ビルメンテナンス業界でも重宝される。",
        appeal: ["試験が年に複数回あり、挑戦しやすい", "セルフスタンドの増加で有資格者の需要が安定", "他の資格（ボイラー・電気工事士）との組み合わせで市場価値が倍増", "屋内作業が中心で、天候に左右されにくい"],
      },
      {
        id: "safety-officer",
        title: "衛生管理者・安全管理者",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
        tags: ["#法定必置", "#事務経験活用", "#デスクワーク"],
        certs: [
          { name: "第一種衛生管理者", salary: "月給28〜38万円", hours: 60, demand: "高い" },
        ],
        salary: { entry: "年収340〜400万円", mid: "年収400〜500万円", senior: "年収500〜600万円" },
        career: "衛生管理者 → 安全衛生責任者 → 総務・管理部門。50人以上の事業所に選任が法律で義務付けられているため、常に需要がある。",
        appeal: ["法律で設置が義務付けられた資格で需要が安定", "事務職経験を活かしやすく、ホワイトカラーからの転身に最適", "デスクワーク中心で体力的負担が少ない", "人事・総務部門でのキャリアアップにも繋がる"],
      },
      {
        id: "welding",
        title: "溶接工",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop&q=80",
        tags: ["#実力主義", "#海外でも通用", "#参入障壁低い"],
        certs: [
          { name: "アーク溶接特別教育", salary: "月給28〜36万円", hours: 20, demand: "高い" },
          { name: "ガス溶接技能講習", salary: "月給28〜36万円", hours: 15, demand: "高い" },
        ],
        salary: { entry: "年収330〜380万円", mid: "年収400〜500万円", senior: "年収500〜700万円（特殊溶接）" },
        career: "見習い → 一般溶接 → JIS資格取得 → 特殊溶接（TIG・半自動）。造船・プラント・橋梁など大型構造物の溶接ができると高収入。",
        appeal: ["講習のみで始められ、参入障壁が低い", "技術を磨くほど給与が上がる実力主義の世界", "造船・自動車・建設など活躍業界が幅広い", "海外でも通用する技術で、海外就労の道もある"],
      },
    ],
  },
  {
    id: "maintenance",
    name: "設備メンテナンス",
    description: "安定した需要と働きやすい環境。長期キャリアを築きやすい分野",
    jobs: [
      {
        id: "building-maintenance",
        title: "ビルメンテナンス",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
        tags: ["#4点セット", "#40代からOK", "#安定性抜群"],
        certs: [
          { name: "第二種電気工事士", salary: "月給28〜35万円", hours: 80, demand: "極めて高い" },
          { name: "危険物取扱者乙種4類", salary: "月給27〜33万円", hours: 50, demand: "中〜高" },
          { name: "ボイラー技士2級", salary: "月給28〜34万円", hours: 70, demand: "中〜高" },
          { name: "第三種冷凍機械責任者", salary: "月給27〜33万円", hours: 60, demand: "中〜高" },
        ],
        salary: { entry: "年収300〜360万円", mid: "年収380〜460万円", senior: "年収480〜600万円（設備管理責任者）" },
        career: "ビルメン4点セット取得 → 電験三種・ビル管理士で上位資格 → 設備管理責任者。大型商業施設・病院・データセンターなどへステップアップ。",
        appeal: ["「ビルメン4点セット」を順に取得すれば着実にキャリアアップ", "残業が少なく、ワークライフバランスを重視する人に最適", "未経験・40代以上からでも始めやすい", "建物がある限り仕事がなくならない安定性"],
      },
      {
        id: "plumbing",
        title: "配管工",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
        tags: ["#インフラ直結", "#独立開業", "#一生モノ"],
        certs: [
          { name: "給水装置工事主任技術者", salary: "月給30〜40万円", hours: 100, demand: "高い" },
          { name: "管工事施工管理技士2級", salary: "月給33〜43万円", hours: 120, demand: "高い" },
        ],
        salary: { entry: "年収330〜400万円", mid: "年収420〜520万円", senior: "年収520〜700万円（独立可）" },
        career: "見習い → 配管工 → 主任技術者 → 独立開業。水道・ガス・空調の配管は建物に必須で、常に安定した需要がある。",
        appeal: ["生活インフラに直結するため、景気に左右されにくい", "独立開業のハードルが比較的低い", "住宅からプラントまで幅広い現場で活躍", "技術を身につければ一生モノのスキルになる"],
      },
    ],
  },
];

// Flat list for backward compatibility
export const JOBS: Job[] = JOB_CATEGORIES.flatMap((c) => c.jobs);
