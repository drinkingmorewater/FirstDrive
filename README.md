# FirstDrive｜第一公里 v3.0

> 一个认识你、车、路与环境，并在正确时机主动协作的 Calm Mobility OS。

FirstDrive 面向“场景型新手”：不是用一个分数定义驾驶者，而是记住他真正完成过的场景、此刻的车和环境，在出发前充分准备、驾驶中降低认知负担、到达后逐步减少不再需要的辅助。

项目是可直接运行的 React Web Demo。默认使用确定性 Demo Data，无需 API Key；语音优先使用浏览器 Web Speech API，不可用时自动进入可点击的脚本兜底。

## 五层工作区

| 工作区 | 核心能力 |
| --- | --- |
| KNOW ME | 驾驶画像、场景熟悉度、渐退式辅助、旅程记忆 |
| BUY SMART | Life Fit、TCO、Deal Checker、提车检查、二手车检查 |
| DRIVE SAFE | 路线比较、关键点预演、本次专属出发清单、车辆手册 |
| ON THE ROAD | Live Context、自动进度、主动事件、Voice Copilot、动态重规划 |
| HELP ME | 紧急求助、事故助手、维修翻译、租车模式、海外驾驶 |

## v3.0 运行架构

src/agents/ 中的五个业务 Agent 独立运行，由 Orchestrator 协作：

- Me Agent：理解驾驶画像、熟悉度与辅助偏好。
- Buy Agent：把生活条件转译为选车、成本与交易判断。
- Ready Agent：把路线风险提前转化为预演和检查。
- Road Agent：理解实时上下文、响应语音并动态重规划。
- Help Agent：在事故、维修、租车和海外驾驶中拆解下一步。

所有前台 Agent Activity 都来自运行时 AgentEvent 流，不使用固定 Trace。

src/live/ 提供独立 Live Context Engine：

- 每 2 秒更新路线进度、车速、剩余里程、ETA、天气、燃油与当前道路。
- Demo Stream 可稳定复现 unfamiliar_segment、weather_change、complex_road_ahead、service_area_ahead 和 destination_arrival。
- 强降雨触发 Road Agent 与 Me Agent 协作，自动展示 PLAN UPDATED: 36 → 41 min。
- RealContextProvider 可读取浏览器地理位置；不可用时无缝回退 Demo。

src/voice/ 将语音能力拆为识别、意图、合成和脚本 Provider。Voice Dock 呈现 Listening → Understanding → Agent Working → Speaking 四阶段。

## 快速开始

    npm install
    npm run dev

生产构建：

    npm run build
    npm run preview

## 现场演示主线

1. 首页输入“浦东嘉里医院”，进入 DRIVE SAFE。
2. 查看 Me / Ready / Road Agents 的实时协作。
3. 选择多 5 分钟但更容易开的路线 B。
4. 预演快速路入口、高架分流、医院停车入口。
5. 完成本次专属出发清单，进入 Live Drive。
6. 观察 2 秒级实时上下文、陌生高架提醒和天气变化。
7. 点击 Voice Copilot，选择“前面是不是要上高架了？”。
8. 强降雨自动触发动态重规划，路线从 36 更新为 41 分钟。
9. 自动到达，快速路、高架与雨天熟悉度更新为“已独立完成”。
10. 从 HELP ME 演示事故助手或维修翻译官。

Live Drive 从 0 到自动到达约 30 秒，无需手动推进。

## 项目目录

    src/
      agents/       五个业务 Agent、Orchestrator 与运行时事件工具
      live/         Demo / Real Context Provider、规则与 LiveDriveEngine
      voice/        Speech Recognition、Synthesis、Intent 与 Scripted Fallback
      components/   五层导航、地图、Agent Activity、Voice Dock
      pages/        五层工作区与端到端演示页面
      state/        v3 本地状态、事件流与记忆
      styles/       tokens / global / layout / motion / components / pages

## 安全边界

- FirstDrive 不控制车辆，不参与自动驾驶决策。
- 驾驶中只呈现必要提醒，复杂操作应在安全停车后继续。
- 事故助手只做安全提示、信息收集与材料整理，不判断责任。
- 维修翻译不替代专业检测，海外驾驶信息应以当地官方规则为准。

## 验证命令

    npm run typecheck
    npm run build

建议同时检查 1440×900、1366×768 与 390×844。
