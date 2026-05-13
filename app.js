const traitNames = [
  "道德卫士", "圣徒", "霸道总裁", "诗人", "解剖师", "祭品", "酒鬼", "勇者", "清洁工"
];

const itemBook = {
  garbageCat: ["垃圾袋猫", "是猫也是垃圾袋。所有道具都可以放进去收着。"],
  catBody: ["垃圾袋猫本体", "点开背包后出现的默认物品，和大多数物品交互会有吐槽。"],
  slipper: ["拖鞋", "毛茸茸的拖鞋。跑动时会被甩掉，面对少数对象攻击力异常。"],
  bear: ["白毛熊", "全世界最无辜的白毛熊。前期使用手机必须带着它。"],
  phone: ["手机", "无论如何拍出来的照片里的人都在看着镜头。"],
  note: ["便签纸", "一叠崭新的，未使用的便签纸。"],
  photo: ["被修正的照片", "正确的照片。吗？白色坟墓下，无数双眼睛正在苏醒。"],
  waterFoot: ["水脚的大坝", "从后袭来的大脚，让你远离躺平的美好生活。"],
  poem: ["主控之诗", "一切都是被设定好的程序，除了它。"]
};

const cardBook = {
  1: ["一号卡 道德卫士", "人类美德公约的拥护者，道德铁律是你的武器。"],
  2: ["二号卡 圣徒", "心是敞开的伤口，爱是流淌的血液。"],
  3: ["三号卡 霸道总裁", "你的西装纤尘不染，眼神三分薄凉七分讥诮。"],
  4: ["四号卡 诗人", "你关心此时此地之外的一切。"],
  5: ["五号卡 解剖师", "世人往往用情感的皮肉包裹真相。"],
  6: ["六号卡 祭品", "未来是吃人的野兽，所以你选择献祭此刻。"],
  7: ["七号卡 酒鬼", "你的行动由骰子来决定。"],
  8: ["八号卡 勇者", "符合一切刻板印象的勇者。"],
  9: ["九号卡 清洁工", "世界理应是安全的。维持原本的模样，就很好。"]
};

const achievementBook = {
  unrelated: ["与我无关", "你成功地解决了一场凶杀案，以一种近乎完美的方式。"],
  whipPoem: ["鞭诗", "真正的死亡是被人遗忘，现在你许他永生。"],
  named: ["名存", "神本无相。"],
  silent: ["实亡", "没有一座桥梁能真正通往你的实体。"]
};

const state = {
  name: "",
  node: "title",
  roomPatience: 60,
  collective: 0,
  traits: Array(9).fill(0),
  items: [],
  cards: [],
  achievements: [],
  explored: [],
  heldTrash: "",
  organChoice: "",
  expressionChoice: "",
  bodyChoice: "",
  mouthChoice: "",
  flags: defaultFlags()
};

const nodes = {
  title: {
    scene: "序章",
    clock: "黑暗",
    title: "困兽犹斗",
    text: [
      "黑暗首先是一种触觉。",
      "它像蕨类植物一样爬上你的脚踝，躯干，最后抵达眼睛。",
      "它吞噬了你。而你只是躺在它的怀抱中。",
      "但它仍留下了一件物品给你。"
    ],
    input: true
  },
  wake: {
    scene: "第一章",
    clock: "12:00",
    title: "房间",
    text: [
      "一盏灯吊在天花板上。"
    ],
    choices: [
      ["眼睛有些刺痛。看来，以这种姿势，我已经睡了太久。", "lampA", { traits: [1, 8, 9] }],
      ["这是命运打向主角的舞台光，是时候登场了。", "lampB", { traits: [3, 5, 7] }],
      ["天呐……断头台刀刃落下前的瞬间，死亡的阴影就在其中。", "lampC", { traits: [2, 4, 6] }]
    ]
  },
  lampA: {
    scene: "第一章",
    clock: "12:01",
    title: "转动脖颈",
    text: [
      "你转动脖颈。"
    ],
    choices: [["左侧", "lampALeft"], ["右侧", "lampARight"]]
  },
  lampALeft: {
    scene: "第一章",
    clock: "12:01",
    title: "左侧",
    text: [
      "床与地板之间的缝隙，需要更近的距离才能窥见阴影之下的居民。"
    ],
    choices: [["右侧", "lampARight"]]
  },
  lampARight: {
    scene: "第一章",
    clock: "12:01",
    title: "右侧",
    text: [
      "这个世界上，竟然还有比你的颈椎更僵硬的东西——是的，它就躺在你的旁边，一具尸体。"
    ],
    choices: [
      ["忽略它，它就是房间里一件多余的家具。", "ignoreCorpse", { traits: [9], flag: "ignoredCorpse" }],
      ["我无法容忍和尸体共处一室。开启调查吧，侦探。", "investigateCorpse", { traits: [8, 1] }]
    ]
  },
  lampB: {
    scene: "第一章",
    clock: "12:01",
    title: "舞台",
    text: [
      "你直起身子，发现舞台上并不只有你。",
      "一位配角，或者只是道具，正沉默地注视你。它的胸口插着一把菜刀。"
    ],
    choices: [
      ["危险的信号，凶手可能正在看着我。", "investigateCorpse", { traits: [3, 5], collective: 1 }],
      ["这可能是我杀的人，必须立刻清理现场。", "investigateCorpse", { traits: [3, 5] }],
      ["少见的样本，一个观察的好机会。", "investigateCorpse", { traits: [7] }]
    ]
  },
  lampC: {
    scene: "第一章",
    clock: "12:01",
    title: "尸体",
    text: [
      "地板是房子的皮肤。粗糙，冰冷，紧贴着你的轮廓。",
      "一股铁锈味蛮横地侵入你的鼻腔。",
      "你侧过头，和它对上了视线。一具尸体，死不瞑目。"
    ],
    choices: [
      ["尸体也有不被打扰的权利，在此长眠吧。", "ignoreCorpse", { traits: [2], flag: "ignoredCorpse" }],
      ["创作一首挽歌，为这位陌生人，也为你自己。", "poemCorpse", { traits: [4], flag: "wrotePoem" }],
      ["这是死亡警告吗？是谁要加害于你？", "investigateCorpse", { traits: [6], collective: 1 }]
    ]
  },
  ignoreCorpse: {
    scene: "第一章",
    clock: "12:03",
    title: "与我无关",
    text: [
      "你当然不会去质问一件家具为何存在。",
      "你不再理会这具尸体，获得了心灵的安宁。",
      "嗡嗡——"
    ],
    effect: () => unlockAchievement("unrelated"),
    choices: [["寻找震动源", "bear"]]
  },
  poemCorpse: {
    scene: "第一章",
    clock: "12:03",
    title: "鞭诗",
    text: [
      "真正的死亡是被人遗忘，现在你许他永生。",
      "嗡嗡——"
    ],
    effect: () => {
      unlockAchievement("whipPoem");
      addItem("poem");
    },
    choices: [["寻找震动源", "bear"]]
  },
  investigateCorpse: {
    scene: "第一章",
    clock: "12:03",
    title: "死不瞑目",
    text: [
      "你看着它。",
      "它看着你。"
    ],
    choices: [["转向白色毛熊", "bear"]]
  },
  bear: {
    scene: "第一章",
    clock: "12:05",
    title: "白色毛熊",
    text: [
      "【白色毛熊】：你要去哪里？",
      "熊毛茸茸地伸出手，你才发现它握着一台手机。"
    ],
    choices: [
      ["拽。手机纹丝不动，熊紧紧攥着它。", "bearPush", { item: "bear" }],
      ["推。熊摔倒了，比你想象中更轻。", "bearPush", { item: "bear" }],
      ["查看手机。", "phone", { item: "phone" }]
    ]
  },
  bearPush: {
    scene: "第一章",
    clock: "12:05",
    title: "毛茸茸",
    text: [
      "熊垂下手，翻了一个面。",
      "它滚到床尾，趴着不动了。"
    ],
    choices: [["拿起手机", "phone", { item: "phone" }]]
  },
  phone: {
    scene: "短信界面",
    clock: "12:06",
    title: "10171205",
    text: [
      "10171200：它要来了，请准备好祭品。",
      "10170800：凌晨十二点前来站台。",
      "【你】：10月17日……是今天。",
      "<span class='redline'>您收到一条新信息。</span>",
      "<span class='redline'>10171205：你看到短信了吗？</span>",
      "<span class='redline'>您收到一条新信息。</span>",
      "<span class='redline'>10171205：你看到短信了吗？</span>",
      "<span class='redline'>您收到一条新信息。</span>",
      "<span class='redline'>10171205：你看到短信了吗？</span>",
      "<span class='redline'>您收到一条新信息。</span>",
      "<span class='redline'>10171206：你看到短信了吗？</span>",
      "手机疯狂地震动起来！"
    ],
    choices: [
      ["扔出去。", "phoneThrow", { traits: [6] }],
      ["回信。", "phoneReply", { traits: [3, 5] }]
    ]
  },
  phoneThrow: {
    scene: "短信界面",
    clock: "12:06",
    title: "失手",
    text: [
      "你把手机连同毛手臂扔了出去。",
      "熊垂下手，翻了一个面。",
      "它滚到床尾，趴着不动了。"
    ],
    choices: [["打开手机", "cardOne"]]
  },
  phoneReply: {
    scene: "短信界面",
    clock: "12:06",
    title: "回信",
    text: [
      "手机没有回复的功能。",
      "是错觉吗……回信这一念头闪过时，手机的疯狂同步静止了。",
      "手机闭上了眼睛。"
    ],
    choices: [["打开手机", "cardOne"]]
  },
  cardOne: {
    scene: "卡牌",
    clock: "12:07",
    title: "一号卡 道德卫士",
    text: [
      "人类美德公约的拥护者，道德铁律是你的武器。",
      "【你】：卡牌是什么意思？",
      "【一号卡】：你已经是我了。"
    ],
    effect: () => unlockCard(1),
    choices: [
      ["这是记忆对我的启示。", "explore", { traits: [1] }],
      ["也许我需要扮演你。", "explore", { traits: [3, 5] }],
      ["不，我不是。", "explore", { traits: [8] }]
    ]
  },
  explore: {
    scene: "房间探索",
    clock: "12:07",
    title: "房间",
    text: [
      "昏暗老旧的房间，只有中心处被一盏灯照亮。"
    ],
    choices: () => explorationChoices()
  },
  closet: {
    scene: "房间探索",
    clock: "12:08",
    title: "衣柜",
    text: ["衣服肩并肩地挂着，全部都是一样的款式。"],
    choices: [
      ["穿上。衣服意外地合身。", "closetWear"],
      ["离开", "explore", { explored: "closet" }]
    ]
  },
  closetWear: {
    scene: "房间探索",
    clock: "12:08",
    title: "撞衫",
    text: [
      "你换上后才发现自己和尸体撞衫了。"
    ],
    effect: () => {
      state.flags.clothesOn = true;
      addTraits([7]);
    },
    choices: [["脱下", "explore", { explored: "closet" }], ["继续穿着", "explore", { explored: "closet" }]]
  },
  curtain: {
    scene: "房间探索",
    clock: "12:09",
    title: "窗帘",
    text: () => state.flags.curtainOpenTried
      ? ["它是房间本体的一部分，你无法撼动它。", "【你】：……总觉得地板在震动。"]
      : ["没有预想中的楼房或街道。只有雾，它填塞着所有空隙，像一堵正在呼吸的墙。"],
    effect: () => {
      if (state.flags.curtainOpenTried) changePatience(-10);
    },
    choices: () => state.flags.curtainOpenTried
      ? [["拉上窗帘", "curtainClose"], ["离开", "explore", { explored: "curtain" }]]
      : [["开窗", "curtainTry", { traits: [8] }], ["离开", "explore", { explored: "curtain" }]]
  },
  curtainTry: {
    scene: "房间探索",
    clock: "12:09",
    title: "开窗",
    text: [
      "一种非理性的恐惧攫住了你。",
      "打开它，就等于邀请这片虚无进入。"
    ],
    effect: () => {
      state.flags.curtainOpenTried = true;
    },
    choices: [["再次开窗", "curtain", { traits: [7, 8] }], ["离开", "explore", { explored: "curtain" }]]
  },
  curtainClose: {
    scene: "房间探索",
    clock: "12:10",
    title: "窗外",
    text: [
      "楼房和街道一茬又一茬地冒出来。",
      "晾衣绳，防盗网，电线杆，行人，车辆。声音也回来了，风是存在的。",
      "外面摊开着，和你的想象分毫不差。"
    ],
    choices: [["继续探索", "explore", { explored: "curtain" }]]
  },
  underBed: {
    scene: "房间探索",
    clock: "12:11",
    title: "床底",
    text: [
      "你俯下身，脸颊贴着冰凉的地板。",
      "不知道什么人把两只拖鞋踢了进去。",
      "一坨黑乎乎的垃圾袋趴在床底。"
    ],
    choices: [
      ["穿上拖鞋", "underBedSlipper", { item: "slipper" }],
      ["趴？", "garbageCat"],
      ["离开", "explore", { explored: "underBed" }]
    ]
  },
  underBedSlipper: {
    scene: "房间探索",
    clock: "12:11",
    title: "拖鞋",
    text: ["你的脚终于不用再亲吻这可憎的地面了。"],
    choices: [["继续摸床底", "underBed"], ["离开", "explore", { explored: "underBed" }]]
  },
  garbageCat: {
    scene: "房间探索",
    clock: "12:12",
    title: "垃圾袋猫",
    text: [
      "你摸上去的那一刻，就知道这不是垃圾袋，而是一个长着毛的、延展性极高的物体。",
      "你把它从床底拉了出来。这竟然是一只黑色长条猫咪！",
      "【垃圾袋猫】：zzzz……"
    ],
    effect: () => {
      state.flags.bagOpen = true;
      addItem("garbageCat");
      addItem("catBody");
    },
    choices: [["收起拖鞋", "explore", { item: "slipper", explored: "underBed" }], ["离开", "explore", { explored: "underBed" }]]
  },
  bookcase: {
    scene: "房间探索",
    clock: "12:13",
    title: "书柜",
    text: ["书柜上挂着一把密码锁。"],
    choices: [
      ["此路不通。尝试密码，或者寻找密码。", "bookcasePassword", { traits: [1, 3, 5] }],
      ["我要用力量重新定义可探索的区域。", "bookcaseForce", { traits: [8], patience: -10 }],
      ["这里挂着一块被烤焦的姜饼，掰开就可以打开它。", "bookcaseOpen", { traits: [7] }],
      ["强行闯入是一种暴力。应该尊重彼此。", "bookcaseRespect", { traits: [2, 4, 6, 9], patience: 1 }]
    ]
  },
  bookcasePassword: {
    scene: "房间探索",
    clock: "12:14",
    title: "密码锁",
    text: () => ["（请输入密码）"],
    password: true,
    choices: [["打开书柜", "bookcaseOpen"], ["离开", "explore", { explored: "bookcase" }]]
  },
  bookcaseForce: {
    scene: "房间探索",
    clock: "12:14",
    title: "力量",
    text: [
      "你的手遭到了反击。当你的力量小于规则时，暴力就是仅属于对方的武器。",
      "也许你还可以尝试对它破口大骂？",
      "不，它听不懂。",
      "看来，你最好还是使用它唯一能听懂的语言。"
    ],
    choices: [["输入密码", "bookcasePassword"], ["离开", "explore", { explored: "bookcase" }]]
  },
  bookcaseRespect: {
    scene: "房间探索",
    clock: "12:14",
    title: "谅解",
    text: [
      "你停止了对书柜的调查。"
    ],
    choices: [["离开", "explore", { explored: "bookcase" }]]
  },
  bookcaseOpen: {
    scene: "房间探索",
    clock: "12:15",
    title: "修正带",
    text: [
      "上百个，或者更多。空掉的修正带，像无数条白虫一样爬了出来。",
      "你掏空了书柜的内脏，露出一沓被修正带涂抹的照片。",
      "那些被覆盖的面庞正在缓慢起伏。它们在……呼吸？",
      "照片下面是一叠崭新的，未使用的便签纸。"
    ],
    effect: () => {
      addItem("photo");
      addItem("note");
    },
    choices: [["回头", "explore", { explored: "bookcase" }], ["不回头", "explore", { collective: 1, explored: "bookcase" }]]
  },
  mirror: {
    scene: "房间探索",
    clock: "12:16",
    title: "镜子",
    text: [
      "房间内有一面镜子。",
      "【镜子】：我近视。",
      "它不肯清晰地映出你。"
    ],
    choices: [
      ["凑近看看", "mirrorNear"],
      ["在镜子前坐一会", "mirrorSit"]
    ]
  },
  mirrorNear: {
    scene: "房间探索",
    clock: "12:16",
    title: "陌生",
    text: [
      "全然的陌生。",
      "你眨了下眼。它当然是同步的，因为那就是你。",
      "【镜子】：离我远点，我社恐……"
    ],
    choices: [["离开", "explore", { explored: "mirror" }]]
  },
  mirrorSit: {
    scene: "房间探索",
    clock: "12:17",
    title: "轮廓",
    text: [
      "你突然想席地而坐。",
      "这个距离只能在镜中分辨出自己的轮廓，这令你感到心安。",
      "【房子】：……"
    ],
    effect: () => {
      if (!state.flags.mirrorSat) {
        state.flags.mirrorSat = true;
        changePatience(10);
      }
    },
    choices: [["离开", "explore", { explored: "mirror" }]]
  },
  bed: {
    scene: "房间探索",
    clock: "12:18",
    title: "床",
    text: [
      "干净柔软的大床。",
      "你走过去坐下。床垫下陷，接纳了你的屁股，然后是腰和头颅。",
      "姿势回到更早的时候，光线和声音都被推得远远的。"
    ],
    effect: () => {
      if (!state.flags.bedRested) {
        state.flags.bedRested = true;
        changePatience(10);
      }
    },
    choices: [
      ["切换视角，抬脚踹过去", "waterFoot"],
      ["离开", "explore", { explored: "bed" }]
    ]
  },
  waterFoot: {
    scene: "房间探索",
    clock: "12:18",
    title: "水脚的大坝",
    text: [
      "一股巨力从身后把你踹了上去，你奇迹般地从床上站了起来。",
      "你发现了身体的神秘力量！",
      "【你】：这科学吗？",
      "【水脚的大坝】：你还懂科学呢？"
    ],
    effect: () => addItem("waterFoot"),
    choices: [["继续探索", "explore", { explored: "bed" }]]
  },
  wall: {
    scene: "房间探索",
    clock: "12:19",
    title: "墙",
    text: [
      "它知道你醒了。"
    ],
    effect: () => changePatience(-8),
    choices: [["立刻离开", "explore", { explored: "wall" }]]
  },
  door: {
    scene: "门",
    clock: "12:20",
    title: "结束探索",
    text: [
      "[结束探索]"
    ],
    choices: [
      ["一个阴险的房间。", "knock", { collective: 1, explored: "door" }],
      ["一个美萌的房间。", "knock", { patience: 3, explored: "door" }]
    ]
  },
  knock: {
    scene: "Part2",
    clock: "12:21",
    title: "清洁工",
    text: [
      "【门】：叩叩。",
      "一下，两下。",
      "【门】：叩叩叩。",
      "一下，两下，三下。",
      "卧室门的敲门声。"
    ],
    effect: () => {
      if (!state.flags.clothesOn) unlockAchievement("named");
    },
    choices: [["它来了", "cleanerStart"], ["它来了", "cleanerStart"], ["它来了", "cleanerStart"]]
  },
  cleanerStart: {
    scene: "Part2",
    clock: "12:21",
    title: "清洁工",
    text: [
      "【【建议存档】】"
    ],
    choices: () => cleanerStartChoices()
  },
  cleanerCard: {
    scene: "Part2",
    clock: "12:21",
    title: "查看卡牌",
    text: [
      "【一号卡】：它很有礼貌，你暂时找不到审判它的理由。",
      "【一号卡】：做一名道德卫士，这是你存在的唯一理由。"
    ],
    choices: [["返回", "cleanerStart"]]
  },
  peephole: {
    scene: "Part2",
    clock: "12:22",
    title: "猫眼",
    text: [
      "咚咚咚——你贴着门，感觉到身体也随之颤动。",
      "敲门声离你更近了。"
    ],
    choices: [["“你是谁？”", "cleanerWho", { hideDirectOpen: true }], ["查看卡牌", "cleanerCard"]]
  },
  cleanerWho: {
    scene: "Part2",
    clock: "12:22",
    title: "门外",
    text: () => state.flags.bagOpen
      ? [
        "【？？？】：“307……我来收取今日的垃圾。”",
        "从垃圾袋猫中抽出垃圾袋。"
      ]
      : [
        "【？？？】：“307……我来收取今日的垃圾。”",
        "请先寻找装垃圾的袋子。"
      ],
    choices: () => state.flags.bagOpen ? trashChoices() : [["返回房间", "explore"]]
  },
  corpseTrashConfirm: {
    scene: "Part2",
    clock: "12:23",
    title: "尸体",
    text: [
      "确定要直接让一个陌生人看到房间里的尸体吗？"
    ],
    choices: [["是的", "corpseTrashYes", { heldTrash: "corpse" }], ["算了吧", "cleanerWho"]]
  },
  corpseTrashYes: {
    scene: "Part2",
    clock: "12:23",
    title: "尸体",
    text: [
      "如果对非垃圾的定义是“有用的东西”，那么它对你来说当然是垃圾。",
      "但你根本没法移动这个东西。或许这正好是一个机会，让门外的人来帮你清理房间里的异物。"
    ],
    choices: [["开门", "openDoor"]]
  },
  bearTrash: {
    scene: "Part2",
    clock: "12:23",
    title: "白毛熊",
    text: [
      "如果你愿意这么做的话，它当然和任何物品没有区别。",
      "即使它的眼神再无辜、再幽怨，你也绝不会被蛊惑。",
      "但它的体型实在太大了，比你还大，它的头露在了外面。"
    ],
    choices: [["强行塞进去", "bearPack", { heldTrash: "bear" }], ["不管了", "bearNoPack", { heldTrash: "bearLoose" }]]
  },
  bearPack: {
    scene: "Part2",
    clock: "12:23",
    title: "白毛熊",
    text: [
      "柔软的东西可以被无限地压扁。",
      "你将身体的全部重量压在它的毛绒头上。",
      "一点。一点。一点。",
      "熊塌缩下去，你仿佛见到它的五官全部皱起来，还有躯干，四肢，它们都被压缩成一块长毛的正方体。",
      "它是被力驯服的死物，它从未开口。",
      "打包好了。"
    ],
    choices: [["开门", "openDoor"]]
  },
  bearNoPack: {
    scene: "Part2",
    clock: "12:23",
    title: "白毛熊",
    text: [
      "没有合适的垃圾袋，这是清洁工需要处理的问题。"
    ],
    choices: [["开门", "openDoor"]]
  },
  poemTrash: {
    scene: "Part2",
    clock: "12:23",
    title: "主控之诗",
    text: [
      "一张废纸而已，不用装进垃圾袋。",
      "你可以直接念给对方听，将这份精神排泄物灌到他的耳朵里。"
    ],
    choices: [["开门", "openDoor", { heldTrash: "poem" }]]
  },
  catTrash: {
    scene: "Part2",
    clock: "12:23",
    title: "垃圾袋猫",
    text: [
      "如果你愿意这么做的话，它当然和任何物品没有区别。",
      "垃圾袋猫从不知名的空间再次跳出来，轻盈地钻进黑色塑料袋——几分钟前，这只袋子还属于它的内部，你只是将它们同时翻了个面。"
    ],
    choices: [["开门", "openDoor", { heldTrash: "cat" }]]
  },
  selfTrash: {
    scene: "Part2",
    clock: "12:23",
    title: "自己",
    text: [
      "你站到袋子前。",
      "垃圾袋撑得很大，比看上去还大。",
      "它恰好容纳得下你的身体。",
      "袋子敞着口，空气灌进去，鼓起来，它在邀请你。"
    ],
    choices: [["走进去", "selfTrashInside"], ["不进去", "selfTrashNo", { heldTrash: "self" }]]
  },
  selfTrashNo: {
    scene: "Part2",
    clock: "12:23",
    title: "自己",
    text: [
      "如果你进去，谁来把垃圾袋递给清洁工呢？你完全可以亲自打开门，让清洁工把你打包起来。"
    ],
    choices: [["开门", "openDoor"]]
  },
  selfTrashInside: {
    scene: "结局",
    clock: "12:24",
    title: "垃圾",
    text: [
      "你把自己关进了垃圾袋里。",
      "然后你才发现，你无法把自己这袋垃圾交出去。",
      "咔嚓——",
      "（门开了）"
    ],
    choices: [["继续", "garbageEnding"]]
  },
  directOpen: {
    scene: "Part2",
    clock: "12:24",
    title: "直接开门",
    text: [
      "【？？？】：“307……我来收取今日的垃圾。”",
      "门外的人带着口罩，后面站着一台黄色清洁车。"
    ],
    choices: [["我没有垃圾啊", "directOpenNoTrash"], ["我去拿一下垃圾", "directOpenNoTrash"]]
  },
  directOpenNoTrash: {
    scene: "Part2",
    clock: "12:24",
    title: "垃圾",
    text: [
      "【？？？】：……",
      "他看着你，你感觉到他下一秒仿佛要哭出来。",
      "残忍的、慈悲的眼泪。",
      "你意识到了一件事。"
    ],
    choices: [["继续", "garbageEnding"]]
  },
  garbageEnding: {
    scene: "结局",
    clock: "12:25",
    title: "垃圾",
    text: [
      "你被看见了。",
      "它睁开了眼睛",
      "不，不止是它。",
      "你正在被所有人注视",
      "【？？？】：307住户，10月17日提交垃圾为：<玩家>***。***",
      "黑暗再度爬上你的实体。",
      "你被提起。",
      "一袋被摇匀的湿垃圾。",
      "视觉最先被修改。世界是灰绿色的，世界被压扁了。",
      "然后，你听到一声啼哭。尖锐的，从喉咙溅出。",
      "你在哭，你为自己而哭，只为自己而哭。",
      "……",
      "……",
      "很快，你忘记了该如何称呼这个表情。",
      "你的过去，你的期盼，你的恐惧，你曾作为■■乃至拥有一个名字的全部历史，都已经被消化。",
      "偶尔，会有其他垃圾被扔在你身上。",
      "你们彼此挤压，交换腐臭，再无分别。",
      "达成结局：垃圾"
    ],
    effect: () => {
      if (!state.flags.garbagePatienceApplied) {
        state.flags.garbagePatienceApplied = true;
        changePatience(-10);
      }
    },
    choices: [["读档", "loadFromChoice"], ["重新开始", "title", { reset: true }]]
  },
  openDoor: {
    scene: "Part2",
    clock: "12:24",
    title: "开门",
    text: [
      "你要调用什么器官观察面前的人或物？"
    ],
    choices: [
      ["心脏", "organHeart", { traits: [2, 3, 4], organChoice: "heart" }],
      ["大脑", "organBrain", { traits: [5, 6, 7], organChoice: "brain" }],
      ["腹部", "organBelly", { traits: [8, 9, 1], organChoice: "belly" }]
    ]
  },
  organHeart: {
    scene: "Part2",
    clock: "12:24",
    title: "心脏",
    text: [
      "心脏蜷缩起来。因为恐惧吗？还是悲伤？",
      "你只知道看见它，就像看见一面从高处开始坠落的镜子，你的心脏为那必然到来的粉碎预支了钝痛。"
    ],
    choices: [["继续", "expressionSelect"]]
  },
  organBrain: {
    scene: "Part2",
    clock: "12:24",
    title: "大脑",
    text: [
      "口罩外露出了青灰色皮肤和一双眼睛。有些熟悉，你见过他吗？",
      "但是显然，现在不是叙旧的好时机。这间房子的主人遇害了，你作为潜在的嫌疑人，小心惹上不必要的麻烦。"
    ],
    choices: [["继续", "expressionSelect"]]
  },
  organBelly: {
    scene: "Part2",
    clock: "12:24",
    title: "腹部",
    text: [
      "腹腔骤然绷紧，就像在家里发现了一只蟑螂，你本能地想要尖叫和后退。",
      "快，有没有趁手的武器，最好是一双拖鞋，你要狠狠地拍碎那令人生厌的肢体！"
    ],
    choices: [["继续", "expressionSelect", { item: "slipper" }]]
  },
  expressionSelect: {
    scene: "Part2",
    clock: "12:24",
    title: "表情",
    text: [
      "你决定怎样交出这份垃圾？"
    ],
    choices: [
      ["微笑", "expressionSmile", { expressionChoice: "smile" }],
      ["低落", "expressionLow", { expressionChoice: "low" }],
      ["愤怒", "expressionAngry", { expressionChoice: "angry" }],
      ["平静", "expressionCalm", { expressionChoice: "calm" }]
    ]
  },
  expressionSmile: {
    scene: "Part2",
    clock: "12:24",
    title: "微笑",
    text: ["提起嘴角通常是一种表达善意的方式。美中不足的是眼睛，它缺席了这场表演。"],
    choices: [["继续", "bodySelect"]]
  },
  expressionLow: {
    scene: "Part2",
    clock: "12:24",
    title: "低落",
    text: ["眉梢先垂落，接着是嘴角。瓷器般的脆弱笼罩了你的轮廓。"],
    choices: [["继续", "bodySelect"]]
  },
  expressionAngry: {
    scene: "Part2",
    clock: "12:24",
    title: "愤怒",
    text: ["血在太阳穴里敲鼓，每敲一下，眼白就爬出更多的血丝。一种名为愤怒的情绪正在接管你的大脑……"],
    choices: [["继续", "bodySelect"]]
  },
  expressionCalm: {
    scene: "Part2",
    clock: "12:24",
    title: "平静",
    text: ["像清空一只口袋一样倒掉了情绪。至少在表面，什么也不剩了。"],
    choices: [["继续", "bodySelect"]]
  },
  bodySelect: {
    scene: "Part2",
    clock: "12:24",
    title: "身体",
    text: [
      "你打算和他更亲密地接触吗？"
    ],
    choices: [
      ["攻击，找一切可能的机会。", "mouthSelect", { bodyChoice: "attack" }],
      ["摘掉口罩，他究竟长什么样？", "mouthSelect", { bodyChoice: "mask" }],
      ["不打算，多余的动作我不干。", "mouthSelect", { bodyChoice: "none" }]
    ]
  },
  mouthSelect: {
    scene: "Part2",
    clock: "12:24",
    title: "嘴巴",
    text: [
      "你愿意触发对话吗？"
    ],
    choices: () => mouthChoices()
  },
  submitTrash: {
    scene: "Part2",
    clock: "12:25",
    title: "提交垃圾",
    text: () => submitTrashText(),
    choices: () => submitTrashChoices()
  },
  knifeQuestion: {
    scene: "Part2",
    clock: "12:25",
    title: "真实菜刀",
    text: [
      "【清洁工】：它是什么垃圾？"
    ],
    choices: [["蓝色", "knifeAfterQuestion"], ["红色", "knifeAfterQuestion"], ["绿色", "knifeAfterQuestion"], ["黑色", "knifeAfterQuestion"]]
  },
  knifeAfterQuestion: {
    scene: "Part2",
    clock: "12:25",
    title: "真实菜刀",
    text: () => knifeAfterQuestionText(),
    choices: () => knifeAfterQuestionChoices()
  },
  knifeAttack: {
    scene: "结局",
    clock: "12:26",
    title: "不合脚的鞋",
    text: [
      "【清洁工】：请不要这样，我不想失去这份工作。",
      "【一号卡】：太无礼了，你为什么要阻碍一名清洁工完成他的本职工作？还拿刀威胁他？",
      "卡牌愤怒地攻击着你的大脑。",
      "收到的道德指责理应少于十次（9/10）",
      "他的口罩和连像两张薄薄的纸，你轻而易举地就能划开。",
      "【清洁工】：太……太无礼了，你为什么要阻碍一名清洁工完成他的本职工作？还拿刀威胁他？",
      "他的嘴巴被你劈成两截，你看见它们的正中央分别含着两颗黑色的珠子。四片唇瓣同时开合，重复卡牌说过的话。",
      "你犯了一个大错！",
      "无论如何，道德卫士都不应该率先动粗。",
      "他的脸和口罩开始愈合，因为他只是一名清洁工，没有理由死亡。",
      "你的脸开始碎裂，因为你根本不是道德卫士，你以什么身份存在？",
      "对你来说，扮演这张卡牌就像穿上一双不合脚的鞋，你无法忍受哪怕一分一秒。",
      "但你终于真正明白了规则的意思。",
      "这个世界里，表演出纰漏的下场就是死亡。",
      "如果不是道德卫士，那么你可以是谁呢？",
      "这里没有你的位置了。",
      "达成结局：不合脚的鞋"
    ],
    choices: [["读档", "loadFromChoice"], ["重新开始", "title", { reset: true }]]
  },
  knifeTalk: {
    scene: "Part2",
    clock: "12:26",
    title: "清洁工",
    text: [
      "【你】：你怎么知道这是什么东西？",
      "【清洁工】：我看过很多垃圾袋。",
      "【你】：我也想学这个能力……百分百透视垃圾袋。",
      "【清洁工】：你想成为清洁工吗？"
    ],
    choices: [["想", "wantCleaner"], ["不想", "notWantCleaner"]]
  },
  notWantCleaner: {
    scene: "Part2",
    clock: "12:26",
    title: "清洁工",
    text: [
      "【清洁工】：那你学不会的，这是我们的天赋。"
    ],
    choices: [["抽出袋子里的菜刀", "knifeAttack"]]
  },
  wantCleaner: {
    scene: "Part2",
    clock: "12:26",
    title: "清洁工",
    text: [
      "【你】：成为清洁工是我儿时的梦想，总有一天我要实现。",
      "【清洁工】：可是你注定要当一名作家。"
    ],
    choices: [["是的", "writerYes"], ["不，我不是", "notWriter"]]
  },
  writerYes: {
    scene: "Part2",
    clock: "12:26",
    title: "清洁工",
    text: [
      "【清洁工】：没关系，作家总会有这些奇怪的想法。"
    ],
    choices: [["抽出袋子里的菜刀", "knifeAttack"]]
  },
  notWriter: {
    scene: "Part2",
    clock: "12:26",
    title: "清洁工",
    text: [
      "他看向你。",
      "不，他一直都在看着你，只是你此刻才意识到这一点。",
      "【清洁工】：你是谁？"
    ],
    choices: [["我是道德卫士", "moralKnight"], ["我是清洁工", "cleanerIdentity"]]
  },
  moralKnight: {
    scene: "Part2",
    clock: "12:26",
    title: "清洁工",
    text: [
      "【清洁工】：……",
      "他再没说什么。"
    ],
    choices: [["抽出袋子里的菜刀", "knifeAttack"]]
  },
  cleanerIdentity: {
    scene: "结局",
    clock: "12:26",
    title: "垃圾",
    text: [
      "他看着你，你感觉到他下一秒仿佛要哭出来。",
      "残忍的、慈悲的眼泪。",
      "你意识到了一件事。"
    ],
    choices: [["继续", "garbageEnding"]]
  },
  maskTouch: {
    scene: "Part2",
    clock: "12:26",
    title: "摘口罩",
    text: [
      "口罩下面还是一层口罩！",
      "【你】：……",
      "【一号卡】：为什么不经过别人的同意就摘人家的口罩？",
      "卡牌愤怒地攻击着你的大脑。",
      "收到的道德指责理应少于十次（9/10）",
      "【清洁工】：你做什么？"
    ],
    choices: [["开口", "maskTalk"], ["沉默", "maskSilent"]]
  },
  maskTalk: {
    scene: "Part2",
    clock: "12:26",
    title: "摘口罩",
    text: [
      "【你】：抱歉，我只是好奇你的长相。",
      "【清洁工】：我不想当你的写作素材。",
      "【你】：抱歉……抱歉……",
      "道德卫士好像暂时接管了你的语言系统。",
      "【你】：请把垃圾带走吧。"
    ],
    choices: [["提交垃圾", "part2End"]]
  },
  maskSilent: {
    scene: "Part2",
    clock: "12:26",
    title: "摘口罩",
    text: [
      "你不打算回答他。",
      "【一号卡】：为什么对别人的话视若罔闻？",
      "收到的道德指责理应少于十次（8/10）"
    ],
    choices: [["提交垃圾", "part2End"]]
  },
  noContact: {
    scene: "Part2",
    clock: "12:26",
    title: "提交垃圾",
    text: [
      "但你不会真的拿起刀砍它，没必要为难基层工作者。",
      "【一号卡】：有道德的人，值得尊敬。"
    ],
    choices: [["提交垃圾", "part2End"]]
  },
  part2End: {
    scene: "Part2",
    clock: "12:27",
    title: "走廊",
    text: [
      "part3 走廊"
    ],
    choices: [["存档", "saveFromChoice"], ["回到房间探索", "explore"]]
  }
};

const els = {
  storyPanel: document.querySelector(".story-panel"),
  title: document.querySelector("#title"),
  story: document.querySelector("#story"),
  exploredHint: document.querySelector("#exploredHint"),
  choices: document.querySelector("#choices"),
  sceneLabel: document.querySelector("#sceneLabel"),
  clockLabel: document.querySelector("#clockLabel"),
  playerName: document.querySelector("#playerName"),
  roomPatienceText: document.querySelector("#roomPatienceText"),
  roomPatienceBar: document.querySelector("#roomPatienceBar"),
  collectiveText: document.querySelector("#collectiveText"),
  collectiveBar: document.querySelector("#collectiveBar"),
  items: document.querySelector("#items"),
  cards: document.querySelector("#cards"),
  achievements: document.querySelector("#achievements"),
  traits: document.querySelector("#traits"),
  roomTransition: document.querySelector("#roomTransition"),
  transitionName: document.querySelector("#transitionName"),
  popupStack: document.querySelector("#popupStack"),
  saveGame: document.querySelector("#saveGame"),
  loadGame: document.querySelector("#loadGame"),
  clearSave: document.querySelector("#clearSave"),
  toast: document.querySelector("#toast")
};

function defaultFlags() {
  return {
    bagOpen: false,
    clothesOn: false,
    curtainOpenTried: false,
    mirrorSat: false,
    bedRested: false,
    ignoredCorpse: false,
    wrotePoem: false,
    cleanerDirectAvailable: true,
    garbagePatienceApplied: false
  };
}

function resolve(value) {
  return typeof value === "function" ? value() : value;
}

function renderStoryLine(line) {
  const classes = [];
  if (line.includes("redline") || line.includes("新信息") || line.includes("1017")) classes.push("is-alert");
  if (line.startsWith("【")) classes.push("is-dialogue");
  if (line.startsWith("（") || line.startsWith("【【") || line.startsWith("[")) classes.push("is-system");
  return `<p class="${classes.join(" ")}">${enhanceLine(line)}</p>`;
}

function enhanceLine(line) {
  return line
    .replace(/【([^】]+)】：/g, "<span class='speaker'>【$1】：</span>")
    .replace(/^(1017\d{4}：)/, "<span class='clockline'>$1</span>")
    .replace(/^(【【[^】]+】】)/, "<span class='systemline'>$1</span>");
}

function render() {
  const node = nodes[state.node];
  if (node.effect && state.lastEffect !== state.node) {
    node.effect();
    state.lastEffect = state.node;
  }

  els.title.textContent = node.title;
  els.sceneLabel.textContent = node.scene;
  els.clockLabel.textContent = node.clock;
  els.playerName.textContent = state.name || "未命名";
  els.story.innerHTML = resolve(node.text).map(renderStoryLine).join("");
  els.exploredHint.textContent = state.node === "explore" && state.explored.length
    ? `已探索：${state.explored.map(exploredLabel).join("、")}`
    : "";

  els.choices.innerHTML = "";
  if (node.input) {
    const form = document.createElement("form");
    form.className = "name-form";
    form.innerHTML = `<input maxlength="12" placeholder="输入名字，也可以输入一串数字"><button type="submit">醒来</button>`;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const value = form.querySelector("input").value.trim();
      state.name = value || "主控";
      enterRoom();
    });
    els.choices.appendChild(form);
  } else {
    if (node.password) {
      const form = document.createElement("form");
      form.className = "password-form";
      form.innerHTML = `<input autocomplete="off" placeholder="输入密码"><button type="submit">确认</button>`;
      form.addEventListener("submit", event => {
        event.preventDefault();
        choose("bookcaseOpen");
      });
      els.choices.appendChild(form);
    }
    resolve(node.choices).forEach(([label, target, effect]) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => choose(target, effect));
      els.choices.appendChild(button);
    });
  }

  updateHud();
  updateMap();
  playNodeEffect();
}

function choose(target, effect = {}) {
  if (target === "saveFromChoice") {
    saveGame();
    return;
  }
  if (target === "loadFromChoice") {
    loadGame();
    return;
  }
  if (effect.reset) {
    resetGame();
    return;
  }

  if (effect.traits) addTraits(effect.traits);
  if (effect.item) addItem(effect.item);
  if (effect.collective) changeCollective(effect.collective);
  if (effect.patience) changePatience(effect.patience);
  if (effect.flag) state.flags[effect.flag] = true;
  if (effect.explored) markExplored(effect.explored);
  if (effect.hideDirectOpen) state.flags.cleanerDirectAvailable = false;
  if (effect.heldTrash !== undefined) state.heldTrash = effect.heldTrash;
  if (effect.organChoice) state.organChoice = effect.organChoice;
  if (effect.expressionChoice) state.expressionChoice = effect.expressionChoice;
  if (effect.bodyChoice) state.bodyChoice = effect.bodyChoice;
  if (effect.mouthChoice) state.mouthChoice = effect.mouthChoice;

  state.node = target;
  render();
}

function explorationChoices() {
  const options = [
    ["衣柜", "closet", "closet"],
    ["窗帘", "curtain", "curtain"],
    ["床底", "underBed", "underBed"],
    ["书柜", "bookcase", "bookcase"],
    ["镜子", "mirror", "mirror"],
    ["床", "bed", "bed"],
    ["墙", "wall", "wall"],
    ["门", "door", "door"]
  ];
  const available = options
    .filter(([, , key]) => !state.explored.includes(key))
    .map(([label, target]) => [label, target]);

  return available.length ? available : [["结束探索", "knock"]];
}

function cleanerStartChoices() {
  const choices = [
    ["查看猫眼", "peephole", { hideDirectOpen: true }],
    ["“你是谁？”", "cleanerWho", { hideDirectOpen: true }]
  ];
  if (state.flags.cleanerDirectAvailable) {
    choices.push(["直接开门", "directOpen"]);
  }
  choices.push(["查看卡牌", "cleanerCard"]);
  return choices;
}

function trashChoices() {
  const choices = [];
  if (!state.flags.ignoredCorpse && !state.flags.wrotePoem) {
    choices.push(["尸体", "corpseTrashConfirm"]);
  }
  if (state.items.includes("bear")) {
    choices.push(["白毛熊", "bearTrash"]);
  }
  if (state.items.includes("poem")) {
    choices.push([`${state.name || "主控"}之诗`, "poemTrash", { heldTrash: "poem" }]);
  }
  if (state.items.includes("garbageCat")) {
    choices.push(["垃圾袋猫", "catTrash", { heldTrash: "cat" }]);
  }
  choices.push(["自己", "selfTrash"]);
  choices.push(["你没有垃圾", "directOpen", { heldTrash: "" }]);
  return choices;
}

function mouthChoices() {
  const choices = [["开口。", "submitTrash", { mouthChoice: "talk" }]];
  if (!["corpse", "bearLoose", "poem"].includes(state.heldTrash)) {
    choices.push(["无论发生什么，沉默。", "submitTrash", { mouthChoice: "silent" }]);
  }
  return choices;
}

function submitTrashText() {
  if (state.heldTrash === "poem") {
    return [`你${expressionAdverb()}地吟唱着${state.name || "主控"}之诗`];
  }
  if (state.heldTrash === "corpse" || state.heldTrash === "bearLoose") {
    return [`你${expressionAdverb()}地邀请它进房间`];
  }
  return [`你${expressionAdverb()}地递出了${trashLabel(state.heldTrash)}`];
}

function submitTrashChoices() {
  if (!state.heldTrash) return [["继续", "directOpen"]];
  if (state.bodyChoice === "attack") return [["他怕了，你手上毕竟是把刀。", "knifeAttack"]];
  if (state.bodyChoice === "mask") return [["靠近它", "maskTouch"]];
  if (state.heldTrash === "corpse" || state.heldTrash === "bearLoose") return [["继续", "directOpenNoTrash"]];
  if (state.heldTrash === "self") return [["继续", "garbageEnding"]];
  if (state.heldTrash === "poem") return [["提交垃圾", "part2End"]];
  return [["提交垃圾", "part2End"]];
}

function knifeAfterQuestionText() {
  if (state.expressionChoice === "calm") {
    return [
      "【清洁工】：这把刀……你从哪里拿的？"
    ];
  }
  if (state.expressionChoice === "low") {
    return [
      "他低下眉毛，你从他的眼神中读出了一丝失望。",
      "【清洁工】：给我吧。"
    ];
  }
  return [
    "【清洁工】：这是垃圾吗？",
    "你看不见他的表情，却觉得有些瘆人。"
  ];
}

function knifeAfterQuestionChoices() {
  const choices = [];
  if (state.bodyChoice === "attack") choices.push(["他怕了，你手上毕竟是把刀。", "knifeAttack"]);
  if (state.mouthChoice !== "silent") choices.push(["他怎么知道袋子里装的什么？", "knifeTalk"]);
  choices.push(["提交垃圾袋", "part2End"]);
  return choices;
}

function expressionAdverb() {
  const labels = {
    smile: "微笑",
    low: "低落",
    angry: "愤怒",
    calm: "平静"
  };
  return labels[state.expressionChoice] || "";
}

function trashLabel(id) {
  const labels = {
    bear: "白毛熊",
    cat: "垃圾袋猫",
    self: "自己",
    poem: `${state.name || "主控"}之诗`,
    corpse: "尸体",
    bearLoose: "白毛熊"
  };
  return labels[id] || "黑色垃圾袋";
}

function markExplored(id) {
  if (!state.explored.includes(id)) {
    state.explored.push(id);
  }
}

function exploredLabel(id) {
  const labels = {
    closet: "衣柜",
    curtain: "窗帘",
    underBed: "床底",
    bookcase: "书柜",
    mirror: "镜子",
    bed: "床",
    wall: "墙",
    door: "门"
  };
  return labels[id] || id;
}

function addTraits(ids) {
  ids.forEach(id => {
    state.traits[id - 1] += 1;
  });
}

function addItem(id) {
  if (!state.items.includes(id)) {
    state.items.push(id);
    toast(`获得道具：${itemBook[id][0]}`);
  }
}

function unlockCard(id) {
  if (!state.cards.includes(id)) {
    state.cards.push(id);
    toast(`获得卡牌：${cardBook[id][0]}`);
    playPanelEffect("card-flash");
  }
}

function unlockAchievement(id) {
  if (!state.achievements.includes(id)) {
    state.achievements.push(id);
    toast(`达成成就：${achievementBook[id][0]}`);
  }
}

function changePatience(amount) {
  const before = state.roomPatience;
  state.roomPatience = Math.max(0, Math.min(100, state.roomPatience + amount));
  if (amount < 0 && before === 60) {
    toast("这栋房子很不满意你的行为。它有自己的脾气。");
    playPanelEffect("patience-hit");
  } else if (amount > 0) {
    toast("这栋房子对你的行为表示赞许。");
  } else if (amount < 0) {
    playPanelEffect("patience-hit");
  }
}

function changeCollective(amount) {
  state.collective = Math.max(0, Math.min(100, state.collective + amount));
}

function updateHud() {
  els.roomPatienceText.textContent = `${state.roomPatience}/100`;
  els.roomPatienceBar.style.width = `${state.roomPatience}%`;
  els.collectiveText.textContent = state.collective;
  els.collectiveBar.style.width = `${Math.min(100, state.collective * 12)}%`;

  if (state.flags.bagOpen) {
    renderList(els.items, state.items, itemBook, "背包空空。垃圾袋猫正在假装自己不是容器。");
  } else {
    els.items.innerHTML = `<p class="empty">道具栏尚未开启。找到垃圾袋猫后，已触发的物件会被收纳进来。</p>`;
  }
  renderList(els.cards, state.cards, cardBook, "还没有卡牌。手机会告诉你第一张面具是谁。");
  renderList(els.achievements, state.achievements, achievementBook, "成就不会预告，只会在剧本触发后出现。");

  els.traits.innerHTML = traitNames.map((name, index) => {
    const value = state.traits[index];
    const width = Math.min(100, value * 22);
    return `<div class="trait"><span>${index + 1}.${name}</span><span class="trait-bar"><span style="width:${width}%"></span></span><b>${value}</b></div>`;
  }).join("");
}

function renderList(container, ids, book, emptyText) {
  if (!ids.length) {
    container.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }
  container.innerHTML = ids.map(id => {
    const [name, desc] = book[id];
    return `<div class="entry"><strong>${name}</strong><span>${desc}</span></div>`;
  }).join("");
}

function updateMap() {
  document.querySelectorAll(".map-node").forEach(button => {
    const key = button.dataset.node;
    const chapter = currentChapter();
    const order = ["title", "room", "explore"];
    const active = key === chapter;
    const complete = order.indexOf(key) < order.indexOf(chapter);
    button.classList.toggle("is-current", active);
    button.classList.toggle("is-complete", complete);
  });
}

function currentChapter() {
  if (state.node === "title") return "title";
  if (!["title", "wake", "lampA", "lampALeft", "lampARight", "lampB", "lampC", "ignoreCorpse", "poemCorpse", "investigateCorpse", "bear", "bearPush", "phone", "phoneThrow", "phoneReply", "cardOne"].includes(state.node)) return "explore";
  return "room";
}

function enterRoom() {
  els.transitionName.textContent = state.name;
  els.roomTransition.classList.remove("is-playing");
  void els.roomTransition.offsetWidth;
  els.roomTransition.classList.add("is-playing");
  setTimeout(() => {
    state.node = "wake";
    render();
    playPanelEffect("enter-room");
  }, 1220);
  setTimeout(() => {
    els.roomTransition.classList.remove("is-playing");
  }, 2200);
}

function playPanelEffect(className) {
  els.storyPanel.classList.remove(className);
  void els.storyPanel.offsetWidth;
  els.storyPanel.classList.add(className);
  setTimeout(() => els.storyPanel.classList.remove(className), 900);
}

function playNodeEffect() {
  if (state.lastAnimatedNode === state.node) return;
  state.lastAnimatedNode = state.node;
  if (["phone", "phoneThrow", "phoneReply"].includes(state.node)) {
    playPanelEffect("sms-pulse");
  }
  if (state.node === "cardOne") {
    setTimeout(() => playPanelEffect("card-flash"), 120);
  }
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);

  if (!els.popupStack) return;
  const popup = document.createElement("div");
  popup.className = `popup-card ${popupVariant(message)}`;
  popup.innerHTML = `<strong>${popupTitle(message)}</strong><span>${message}</span>`;
  els.popupStack.prepend(popup);
  setTimeout(() => popup.remove(), 3300);
  while (els.popupStack.children.length > 4) {
    els.popupStack.lastElementChild.remove();
  }
}

function popupTitle(message) {
  if (message.startsWith("获得道具")) return "道具入袋";
  if (message.startsWith("获得卡牌")) return "卡牌苏醒";
  if (message.startsWith("达成成就")) return "成就铭刻";
  if (message.includes("存档") || message.includes("读档")) return "档案回声";
  if (message.includes("不满意") || message.includes("损坏")) return "异动";
  return "提示";
}

function popupVariant(message) {
  if (message.startsWith("获得卡牌")) return "is-card";
  if (message.startsWith("达成成就")) return "is-achievement";
  if (message.includes("存档") || message.includes("读档")) return "is-save";
  if (message.includes("不满意") || message.includes("损坏")) return "is-warning";
  return "";
}

function saveGame() {
  const snapshot = {
    name: state.name,
    node: state.node,
    roomPatience: state.roomPatience,
    collective: state.collective,
    traits: state.traits,
    items: state.items,
    cards: state.cards,
    achievements: state.achievements,
    explored: state.explored,
    heldTrash: state.heldTrash,
    organChoice: state.organChoice,
    expressionChoice: state.expressionChoice,
    bodyChoice: state.bodyChoice,
    mouthChoice: state.mouthChoice,
    flags: state.flags
  };
  localStorage.setItem("beast-demo-save", JSON.stringify(snapshot));
  toast("存档完成。");
}

function loadGame() {
  const raw = localStorage.getItem("beast-demo-save");
  if (!raw) {
    toast("没有存档。");
    return;
  }
  try {
    const snapshot = JSON.parse(raw);
    Object.assign(state, snapshot);
    state.flags = { ...defaultFlags(), ...(snapshot.flags || {}) };
    state.traits = snapshot.traits || Array(9).fill(0);
    state.items = snapshot.items || [];
    state.cards = snapshot.cards || [];
    state.achievements = snapshot.achievements || [];
    state.explored = snapshot.explored || [];
    state.lastEffect = "";
    state.lastAnimatedNode = "";
    render();
    toast("读档完成。");
  } catch {
    toast("存档损坏。");
  }
}

function clearSave() {
  localStorage.removeItem("beast-demo-save");
  toast("存档已删除。");
}

function resetGame() {
  state.name = "";
  state.node = "title";
  state.roomPatience = 60;
  state.collective = 0;
  state.traits = Array(9).fill(0);
  state.items = [];
  state.cards = [];
  state.achievements = [];
  state.explored = [];
  state.heldTrash = "";
  state.organChoice = "";
  state.expressionChoice = "";
  state.bodyChoice = "";
  state.mouthChoice = "";
  state.flags = defaultFlags();
  state.lastEffect = "";
  state.lastAnimatedNode = "";
  render();
}

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab, .tab-panel").forEach(el => el.classList.remove("is-active"));
    button.classList.add("is-active");
    document.querySelector(`#${button.dataset.tab}`).classList.add("is-active");
  });
});

els.saveGame.addEventListener("click", saveGame);
els.loadGame.addEventListener("click", loadGame);
els.clearSave.addEventListener("click", clearSave);

window.addEventListener("beforeunload", event => {
  if (["phone", "phoneThrow", "phoneReply"].includes(state.node)) {
    event.preventDefault();
    event.returnValue = "我会在别的窗口里等你。";
  }
});

render();
