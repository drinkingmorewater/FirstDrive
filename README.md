<div align="center">

# ⛰️ FirstDrive｜第一公里

### 每个人，都有自己的第一公里。

**一个会先认识你，再陪你把陌生的路走成熟悉的 AI 汽车生活 Agent。**

![FirstDrive](https://img.shields.io/badge/FirstDrive-v5.0-446CF4?style=flat-square)
![React](https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Team](https://img.shields.io/badge/Team-%E6%84%8F%E6%80%9D%E6%B5%81-172033?style=flat-square)

**意思流 · One-person team · AI × Automotive × Agents**

</div>

---

## 🚗 故事从我妈妈开始

我妈妈很早就考出了驾照。

可很多年里，她很少真正把车开上复杂的道路。

普通的小路还好，一遇到高架、立交、陌生路线，她就会开始犹豫。身边还总有一种很轻飘飘的声音——“女生就是不适合开车。”

但我慢慢发现，迟疑从来不只发生在某一种人身上。

刚拿驾照的人，第一次独自上高速会迟疑；开了很多年油车的人，第一次开新能源跑长途也会迟疑；第一次夜间驾驶、第一次暴雨、第一次租一辆完全陌生的车、第一次在国外自驾、第一次遇到事故……每个人都会在某一个新的场景里，重新变成新手。

导航知道“前方 300 米右转”。

可它不知道，**那可能是你人生第一次独自驶入高架。**

于是有了 FirstDrive。

我想做的，是一个会记得你经历过什么、知道你还没经历什么、提前替你看一眼前路的 Agent。它会在出发前帮你把陌生的事情讲清楚，在路上只说真正需要说的话，在你完成一次新的驾驶之后，把这段经历记下来。

下一次，再经过相似的路，它就可以少说一点。

> **第一公里从来不只是距离。**  
> **它是陌生开始变成熟悉的那一段。**

---

## 🧭 FirstDrive 到底在做什么？

FirstDrive 持续理解四件事：

**人 × 车 × 路 × 境**

| 它认识什么 | FirstDrive 会记住什么 |
| --- | --- |
| 👤 **人 · ME** | 真实驾驶频率、熟悉场景、生活方式、预算、家人、辅助偏好，以及你真正完成过哪些“第一次” |
| 🚙 **车 · VEHICLE** | 当前车辆、能源形式、说明书、续航 / 油耗、保养、维修、保险和长期使用记录 |
| 🛣️ **路 · ROAD** | 高速、高架、复杂立交、隧道、停车、服务区、补能点，以及哪些道路对你仍然陌生 |
| 🌦️ **境 · WORLD** | 天气、昼夜、温度、出行目的、同行者、国家 / 地区规则和途中发生的变化 |

同一条路，对不同的人，可以有不同的答案。

有人想最快到达；有人第一次独自上高架，愿意多花 5 分钟换一条更简单的路线；有人已经跑过很多次高速，只希望 FirstDrive 在真正异常的时候提醒一句。

**FirstDrive 想理解的，就是这种差别。**

---

## 🌱 五段汽车生活，五个 Agent

FirstDrive 没有把“汽车助手”做成一个巨大的聊天框。

它把一段汽车生活拆成五个连续阶段，并让五个 Agent 共享同一份 Personal Mobility Context 与长期 Memory。

| 阶段 | Agent | 它陪你做什么 |
| --- | --- | --- |
| **01 KNOW ME** | **ME Agent** | 先听你讲自己的情况，形成 Mobility Passport、驾驶熟悉度和 Assistance Style |
| **02 BUY SMART** | **BUY Agent** | 用生活方式选车，比较场景适配、五年 TCO、报价、提车和二手车检查 |
| **03 DRIVE SAFE** | **READY Agent** | 第一次高速 / 高架 / 夜间 / 长途之前，做路线预演、练习计划和个性化出发检查 |
| **04 ON THE ROAD** | **ROAD Agent** | 理解实时人车路境，用 Voice Copilot、主动提醒和动态重规划陪你完成行程 |
| **05 HELP ME** | **HELP Agent** | 爆胎、事故、维修、租车、海外驾驶时，把复杂现场拆成下一步可执行任务 |

### 这五层不是五个孤立工具

一次任务里，它们会真的交接信息。

```text
“明天我要第一次自己开车去医院。”

                    ┌─────────────────┐
                    │  ORCHESTRATOR   │
                    │   Task Graph    │
                    └────────┬────────┘
                             │
                读取 Personal Mobility Context
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
        ME Agent         READY Agent       ROAD Agent
      读熟悉度与偏好     找陌生路段与风险      比较路线 / 天气
            │                │                │
            └────────── Handoff ─────────────┘
                             │
                             ▼
                 推荐更适合“这个人”的路线
                             │
                             ▼
                    Journey Memory
```

页面里的 **Agent Mesh** 会展示 Context Read、Tool Call、Handoff、Result 和 Memory Write。它展示的是公开的结构化执行状态，不展示模型内部思维链。

---

## 🎙️ FirstDrive 的第一句话不是“你要去哪？”

而是：

# 先让我认识你。

第一次打开产品，可以直接说一段很生活化的话：

> “我驾照拿了十多年，但是平时很少开。普通市区还行，我最害怕高架和复杂立交。”

FirstDrive 会先把这段话拆成一张 **Mobility Intelligence Canvas**：

- **Confirmed**：你明确说过的事实
- **Inferred**：系统根据上下文得到的合理推测
- **Need to confirm**：还需要问你的信息

然后只追问缺失的部分，再建立 **My Mobility Passport**。

结构化问卷仍然保留，喜欢一步一步填写的人也可以慢慢来。

这意味着 FirstDrive 的后续每一次推荐，都可以回答一句：

> **“为什么这次是这样建议我的？”**

---

## ✨ 现在可以体验哪些“第一公里”？

### ① 第一次真正认识自己

语音 / 文本描述 → Profile Extractor → Intelligence Canvas → Adaptive Follow-up → Mobility Passport。

系统会记录场景级熟悉度，不用一个粗暴的“新手 / 老司机”标签定义人。

### ② 第一次买车

BUY SMART 会综合真实生活条件做 Life Fit：

- 通勤距离与年里程
- 家充与停车条件
- 家庭成员与乘员结构
- 长途频率
- 用车目的
- 预算与月均支出上限
- 对安全、空间、驾驶感、智能化、成本等因素的偏好

支持 Scenario Simulator、车型排序、True Cost / 五年 TCO、Deal Checker、提车检查和二手车检查。

改变“有没有家充”或“未来主要用于家庭出行”等条件，排序会重新计算，并告诉你 **What changed**。

### ③ 第一次上高架 / 高速

DRIVE SAFE 可以先做一次 Route Rehearsal。

路线不只看“最快”，还可以看：

- **Familiar**：更多熟悉道路
- **Easy**：减少复杂立交与连续变道
- **Comfortable Today**：结合今天的天气、时间、车辆和你的熟悉度

对于拿证多年却很少独自驾驶的人，还可以进入 **Low-Pressure Practice Plan**：从短时间、低复杂度、好停车的练习路线开始。

### ④ 第一次开一辆陌生车

`/vehicle/first-drive` 会把几百页说明书压缩成此刻真正需要知道的几件事：

挡位、灯光、雨刷、手刹、驾驶模式、ACC、加油 / 充电口和紧急工具。

`/vehicle/manual` 则会根据高速、雨雪、补能等场景主动推送相关手册内容。

### ⑤ 第一次长途

Road Trip Mode 同时考虑：

**路线 × 天气 × 补能 × 休息 × 同行者 × 酒店 × 景点 × 行李 × 驾驶疲劳偏好**

起点、终点、车辆、人数、经验和旅行目标变化时，计划也会跟着变化。

### ⑥ 第一次遇到问题

HELP ME 提供连续任务链：

事故 → 现场信息 → 保险材料 → Repair Case → Vehicle Memory

租车则保留完整 Pick-up / Return Session：已有损伤、照片、里程、油量 / 电量和归还状态可以前后对照。

海外驾驶也会按国家、驾照来源和身份生成所需规则信息，并保留 source / updatedAt 字段。

---

## 🛣️ 路上，FirstDrive 会尽量安静

真正驾驶时，页面进入 Calm Mobility OS 的深色驾驶模式。

Live Context Engine 持续更新：

```text
ME       我连续开了多久？这个场景熟悉吗？
VEHICLE  还有多少油 / 电？车辆有什么值得关注？
ROAD     前面是什么路？复杂节点还有多远？
WORLD    天气和环境发生了什么？
```

Voice Copilot 可以处理导航、复杂路况、天气、能源、休息、车辆和求助等意图。

前方天气恶化、出现陌生复杂路段或需要重新规划时，Agent 会主动工作；没有重要事情时，它会保持安静。

> **One thing at the right time.**

---

## 🕸️ 为什么这里需要 Agent？

因为“第一次独自开车去一个陌生地方”并不是一道问答题。

它可能同时需要：

1. 读取用户的驾驶熟悉度和辅助偏好；
2. 读取车辆与说明书信息；
3. 比较路线结构和停车难度；
4. 结合天气与实时环境；
5. 提前预演真正陌生的节点；
6. 在路上按需提醒；
7. 完成后把经验写回 Memory；
8. 下一次自动减少已经不再需要的帮助。

FirstDrive 用 **Orchestrator + 5 个业务 Agent + Tools + Shared Memory + Live Context** 把这些步骤串成一个连续任务。

产品想形成的闭环是：

```text
理解你
  ↓
帮助你准备
  ↓
陪你真正完成
  ↓
记录这次经验
  ↓
下一次少帮一点
```

对我来说，最后这一行很重要。

**AI 最好的陪伴之一，是有一天，你已经不需要它为同一件事反复提醒。**

---

## 🎬 推荐的 90 秒 Demo

```text
01  清空 LocalStorage，打开 /
02  FirstDrive：先让我认识你
03  输入：
    “我驾照拿了十多年，但是平时很少开。
     普通市区还行，我最害怕高架和复杂立交。”
04  查看 Transcript → Profile Draft → Mobility Intelligence Canvas
05  回答 Adaptive Follow-up，建立 Mobility Passport
06  打开 Agent Mesh，看 ME Agent 读取 Familiarity Memory
07  进入 DRIVE SAFE，比较最快路线与更容易驾驶的路线
08  READY → ROAD 完成 Handoff，并解释为什么推荐 Route B
09  进入 Route Rehearsal / Live Drive，使用 Voice Copilot
10  行程完成，Familiarity Memory 更新
```

这条 Demo 想展示的并不是“AI 会回答多少汽车知识”。

它展示的是：**一个原本犹豫的人，真的完成了一件过去没有独自完成过的事。**

---

## 🧑‍💻 技术实现

当前仓库是一个可直接运行的 **React Web Demo**。为了黑客松现场演示稳定性，核心流程提供确定性的 Demo Runtime / Mock Data，并把 Agent、Tool、Context 与 Memory 拆成独立层，方便后续替换真实模型、地图、天气、车辆数据和服务 API。

### Frontend

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Framer Motion
- Lucide React
- Noto Sans SC

### Agent & Context

- `GlobalFrame`：所有页面共享的固定五层导航与 Global Voice
- `Orchestrator / Task Graph`：按任务依赖组织 Agent 协作
- `ME / BUY / READY / ROAD / HELP Agents`：五个业务角色
- `Agent Mesh`：可视化 Context Read / Tool Call / Handoff / Result / Memory Write
- `Personal Mobility Context`：统一的人、车、路、境上下文
- `Shared Memory`：Person / Familiarity / Vehicle / Journey / Cost / Incident 等长期状态

### Voice

- Browser Web Speech API
- Speech Synthesis
- Intent Router
- Scripted Voice Fallback

浏览器语音识别不可用时，会自动使用可点击的 scripted utterances，避免现场 Demo 因权限或兼容性中断。

### Live Drive

- Live Context Engine
- Proactive Event Rules
- Context-aware Voice Response
- Dynamic Replanning Demo

### Persistence

- Local state + `localStorage`
- Onboarding / Profile / Memory / Demo Persona 状态均可持续保存

### Tests

当前提供 v5 系统测试脚本，并在构建前支持 TypeScript typecheck。

---

## 🗂️ 项目结构

```text
src/
├── agents/       # 五个业务 Agent、Orchestrator、Task / Event 协作
├── components/   # Global Frame、Agent Mesh、Voice、地图与通用 UI
├── context/      # Personal Mobility Context 与 selectors
├── features/     # 业务功能模块
├── live/         # LiveDriveEngine 与主动事件
├── pages/        # KNOW ME / BUY SMART / DRIVE SAFE / ROAD / HELP 页面
├── state/        # 全局状态、Persona、Memory 与持久化
├── tools/        # Agent 可调用的 Demo Tools
├── voice/        # Recognition / Synthesis / Intent / Fallback
└── styles/       # Calm Mobility OS 设计系统
```

---

## 🏁 跑起来

```bash
npm install
npm run dev
```

浏览器打开终端给出的本地地址即可。

### 验证

```bash
npm run typecheck
npm run test:v5
npm run build
```

生产预览：

```bash
npm run preview
```

---

## 🛡️ 安全边界

FirstDrive 关注的是驾驶前准备、信息理解、路线选择、低认知负担提醒和服务任务闭环。

- 不控制真实车辆
- 不参与自动驾驶决策
- 驾驶中不要求复杂屏幕操作
- 事故助手不判断事故责任
- 维修翻译不替代专业检测
- TCO 是生活成本模拟，不构成金融建议
- 海外驾驶规则需要以当地官方信息为最终依据

当环境明显不适合继续驾驶时，合理的答案也可以是：**改时间、换路线、找陪同、停车休息，或者这次先不开。**

---

## 🌊 关于「意思流」

这次的队伍叫 **意思流**。

队伍人数：**1**。

产品、设计、代码、Agent、Demo，都由我一个人往前推。

但 FirstDrive 的起点其实很小：只是家里一个人很多年前就拿到了驾照，却一直没有完全走出去。

我想把这种很私人、很普通的迟疑，做成一个任何人都能使用的产品。

因为有些人需要的是买车建议，有些人需要的是一条更简单的路线，有些人只需要在第一次独自开上高架之前，有一个东西告诉他：

> 前面的路我已经帮你看过了。

然后，他自己把车开过去。

如果有一天，我妈妈真的可以很自然地开过那条曾经让她犹豫的路；如果 FirstDrive 到那时只需要安静地待在一边——

**那大概就是这个产品最想抵达的地方。**

---

<div align="center">

### ⛰️ FirstDrive｜第一公里

**每个人，都有自己的第一公里。**

Built with curiosity by **意思流**.

</div>
