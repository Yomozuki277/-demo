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
  flags: {
    bagOpen: false,
    clothesOn: false,
    curtainOpenTried: false,
    mirrorSat: false,
    bedRested: false,
    ignoredCorpse: false,
    wrotePoem: false
  }
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
    title: "左侧 / 右侧",
    text: [
      "你转动脖颈。",
      "床与地板之间的缝隙，需要更近的距离才能窥见阴影之下的居民。",
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
    title: "一个阴险的房间",
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
      ["一个阴险的房间。", "endingDemo", { collective: 1, explored: "door" }],
      ["一个美萌的房间。", "endingDemo", { patience: 3, explored: "door" }]
    ]
  },
  endingDemo: {
    scene: "试玩结束",
    clock: "12:21",
    title: "站台",
    text: [
      "10170800：凌晨十二点前来站台。"
    ],
    effect: () => {
      if (!state.flags.clothesOn) unlockAchievement("named");
    },
    choices: [["回到房间探索", "explore"], ["重新开始", "title", { reset: true }]]
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
  toast: document.querySelector("#toast")
};

function resolve(value) {
  return typeof value === "function" ? value() : value;
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
  els.story.innerHTML = resolve(node.text).map(line => `<p>${line}</p>`).join("");
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

  return available.length ? available : [["结束探索", "endingDemo"]];
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
  if (["explore", "endingDemo"].includes(state.node)) return "explore";
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
  state.flags = {
    bagOpen: false,
    clothesOn: false,
    curtainOpenTried: false,
    mirrorSat: false,
    bedRested: false,
    ignoredCorpse: false,
    wrotePoem: false
  };
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

window.addEventListener("beforeunload", event => {
  if (["phone", "phoneThrow", "phoneReply"].includes(state.node)) {
    event.preventDefault();
    event.returnValue = "我会在别的窗口里等你。";
  }
});

render();
