# FirstDrive｜第一公里 v4.0

> 每个人，都有自己的第一公里。

FirstDrive 是一个由统一 Personal Mobility Context、共享 Memory 和五个业务 Agent 驱动的汽车生活智能体。v4.0 不再把页面存在等同于功能完成：主要能力都遵循 INPUT → AGENT / RULE PROCESSING → STRUCTURED RESULT → USER ACTION → STATE / MEMORY UPDATE。

## v4.0 已完成

### KNOW ME

- 7 Section、14 问的 Adaptive Onboarding，逐题保存草稿并提交到真实 Mobility Profile。
- `/me` My Mobility Passport：My Life、My Driving、My Firsts、Car Preferences、Assistance Style。
- 场景级 Familiarity，不创建“总驾驶能力分”。
- Profile、Familiarity、Cost、Journey、Vehicle、Incident Memory 使用本地持久化。

### BUY SMART

- 高密度专业工作台，完成参考设计中的画像侧栏、筛选、三车排名、Fit Score、适合原因、取舍和场景匹配。
- Scenario Simulator：通勤、家庭、长途、网约车、露营会实时改变排序与 TCO。
- True Cost：购车、税费、保险、金融、能源、停车、保养、耗材与折旧；假设可编辑且标注来源。
- Deal Checker：文本 / 本地文件输入 → 结构化费用 → 7 个销售追问 → Cost Memory。
- Delivery Check：现场清单、照片文件记录、Vehicle Birth Record。
- Used Car Mode：证据检查、风险判断、Used Car Inspection Report。
- 新建方案、方案库、分享摘要、CSV 导出与三个 Demo Persona。

### DRIVE SAFE / ON THE ROAD

- `/firsts` First-Time Center：Preparation → Rehearsal → Checklist → Completed。
- `/practice` Low-Pressure Practice Plan，提供 25 分钟 Plan A 与 42 分钟 Plan B。
- `/trip/roadtrip` 北京 → 阿尔山 Road Trip Canvas，同时呈现路线、天气、补能、休息、住宿、景点与行李。
- Live Context、主动事件、动态重规划与 Context-aware Voice Intent Router。

### HELP ME / MEMORY

- 事故工作流最终创建 IncidentRecord。
- 维修结果可标记完成并写入 Vehicle Memory。
- 租车检查最终创建 RentalSession 时间线记录。
- Memory Timeline 汇总 Person / Familiarity / Vehicle / Journey / Cost / Incident。

## 统一运行架构

```text
src/context/  buildContext(state) 与 selectors
src/tools/    五 Agent 可调用的确定性 Demo Tools
src/agents/   AgentResult<T>、sources、memoryUpdates、nextActions
src/state/    v4 本地持久化、Persona 切换与 Memory 写入
src/features/buy/  BUY SMART 专用可复用组件
src/live/     LiveDriveEngine 与主动事件规则
src/voice/    Intent Router、识别、合成与 Scripted Fallback
```

所有 Agent 统一读取 `buildContext(state)`，不再各自使用固定用户结论。

## 快速开始

```bash
npm install
npm run dev
```

生产与验证：

```bash
npm run typecheck
npm run test:v4
npm run build
npm run preview
```

## Demo 主链路

1. `/onboarding` → Adaptive Onboarding → `/me` Mobility Passport。
2. Persona B → `/buy` → Scenario Simulator → 3 Cars → True Cost → Deal Checker。
3. Persona A → `/firsts` → Practice Plan → Rehearsal → Live Drive → Arrival → Familiarity Update。
4. Persona C → `/trip/roadtrip` → Road Trip Canvas → Journey Memory。
5. `/help/accident` → 5 步事故处理 → Incident Memory。

## 安全边界

- FirstDrive 不控制车辆，不参与自动驾驶决策。
- 驾驶中只呈现必要提醒，复杂操作应在安全停车后继续。
- 成本为生活成本模拟，不构成金融建议。
- 事故助手只做安全提示、信息收集和材料整理，不判断责任。
- 维修翻译不替代专业检测；海外驾驶规则应以当地官方来源为准。
