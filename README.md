# FirstDrive｜第一公里 v5.0

> 每个人，都有自己的第一公里。

FirstDrive 是一个持续理解「人 × 车 × 路 × 境」的汽车生活 Agent。v5.0 把自然语言画像、五 Agent 协作、场景决策、用户行动和跨任务 Memory 串成一条可运行主链路。

## v5.0 核心体验

### 首次打开

- 空状态访问 `/` 自动进入 `/welcome`，第一步始终是「先让我认识你」。
- 支持语音或文本描述真实情况；Profile Extractor 会区分 Confirmed、Inferred 与 Need to confirm。
- `/me/analysis` 用 Mobility Intelligence Canvas 呈现人、车、路、境，并只追问原话中缺失的信息。
- 确认后建立 Mobility Passport，并写入 Person / Familiarity Memory。

### Global Frame 与 Agent Mesh

- Router-level `GlobalFrame` 覆盖所有页面，五层导航始终固定。
- `/trip/drive` 只切换为 60px 深色驾驶模式，Logo、导航与头像位置不变。
- 全产品只使用统一 `MountainMark`；内部页面不再重复另一套 Logo。
- Task Graph 按依赖顺序驱动 Agent；Agent Mesh 展示 Context Read、Tool Call、Handoff、Result 与 Memory Write，不展示思维链。
- Global Voice 会把画像、买车、练习、路线、车辆、保养与求助任务分发给对应 Agent。

### 可见的个性化

- BUY SMART 显示推荐使用了哪些个人信息；修改家充、乘员、预算或停车条件会重算排序并解释变化。
- Route Compare 同时解释「来自你、来自路线、来自天气」；高架熟悉度会真实改变推荐。
- Assistance Style 会改变提醒提前量和说明密度。

### 汽车生活连续链路

- `/vehicle/first-drive`：陌生车首次驾驶的 6 项必要动作，并写入 Vehicle Memory。
- `/vehicle/manual`：按高速、雨雪、补能等上下文主动推送说明书条目。
- `/trip/roadtrip`：Origin、Destination、日期、车辆、乘员、经验、目标和疲劳偏好都会改变里程、日程、补能、休息与风险。
- 事故记录可连续进入保险/维修语境；维修完成写入 Vehicle Timeline。
- `/rental/session` → `/rental/return` 保留照片、里程、能源和损伤对照。
- Abroad Driving 保留 mock source 与 updatedAt，并根据国家、驾照国家和身份改变输出。

## 运行

```bash
npm install
npm run dev
```

验证：

```bash
npm run typecheck
npm run test:v5
npm run build
```

## 90 秒 Demo

1. 清空 LocalStorage，访问 `/`。
2. 输入：「我驾照拿了十多年，但是平时很少开。普通市区还行，我最害怕高架和复杂立交。」
3. 查看 Voice Transcript → Profile Draft → Intelligence Canvas → Agent Mesh。
4. 回答两个 Adaptive Follow-up，建立 Mobility Passport。
5. 进入 BUY SMART 修改家充，观察 Ranking updated。
6. 进入 Route Compare，查看 ME → READY → ROAD 的路线判断与 Memory Write。

## 安全边界

- FirstDrive 不控制车辆，不参与自动驾驶决策。
- 驾驶中只呈现必要提醒，复杂操作应在安全停车后继续。
- 成本为生活成本模拟，不构成金融建议。
- 事故助手只做安全提示、信息收集与材料整理，不判断责任。
- 维修与海外驾驶 Demo 信息不能替代专业检测或当地官方规则。
