# FirstDrive｜第一公里

> 每个人，都有自己的第一公里。

FirstDrive 是一个面向“场景型新手”的 AI+汽车 Web Demo。它帮助用户在真正进入陌生驾驶场景之前理解路线、比较难度、预演关键节点并做好准备；行程结束后，把已经完成的场景写入熟悉度记忆，下一次自动减少不再需要的基础提醒。

项目为 AI Agent 黑客松现场演示而构建，默认启用 Mock Mode，不需要任何 API Key。

## 核心理念

- 驾驶经验不是固定标签。面对新的车、路、天气、国家或任务，任何人都可能重新成为“场景型新手”。
- FirstDrive 围绕“识人 × 识车 × 识路 × 识境”工作。
- 产品成功的标志是：用户曾经需要 FirstDrive 陪伴，后来能够独立完成。
- 不设置“驾驶能力总分”，只记录每个具体场景的真实完成状态。
- 驾驶中坚持 One thing at the right time，只展示一条必要、可操作的提醒。

## 当前完成度

P0 主链路已完整实现：

1. 载入内置 Demo Persona
2. 创建“从家到医院”的第一次独自出发
3. 比较最快路线 A 与更友好的路线 B
4. 展示基于规则引擎的可理解推荐依据
5. 预演快速路入口、高架分流、医院北门三个节点
6. 完成本次专属 Pre-Drive Checklist
7. 进入低认知负担的驾驶模拟
8. 到达并更新 Familiarity Memory
9. 查看更新后的驾驶熟悉度

同时提供轻量版 Buy Smart、TCO、我的车、旅程记忆与爆胎 Emergency Mode。

## 技术栈

- React 19 + TypeScript
- Vite 7
- React Router
- Framer Motion
- Lucide React
- 本地持久化（版本化 localStorage key）
- 自带 Noto Sans SC 字体资源

## 安装与启动

```bash
npm install
npm run dev
```

打开终端显示的本地地址。默认端口为 `4173`。

生产构建：

```bash
npm run build
npm run preview
```

## Mock Mode

项目开箱即用。首页点击“载入示例用户，开始出发”，即可重置并载入：

- 驾照 12 年、很少实际驾驶
- 城市普通道路已熟悉
- 快速路希望先了解
- 高架、复杂变道未独立完成
- 紧凑型燃油 SUV
- 任务：明天上午第一次独自从家开车去医院

路线、天气、车辆说明书、TCO、Agent Trace 与紧急流程均使用明确标注的 Demo Data。

## Demo 现场流程

```text
首页
→ 载入示例用户
→ 创建旅程
→ 比较路线
→ 选择路线 B
→ 预演 3 个陌生节点
→ 完成出发清单
→ 推进驾驶模拟
→ 到达医院
→ 熟悉度从“希望先了解”更新为“已独立完成”
```

建议比赛演示从首页开始，按上述顺序点击。整个过程无需输入额外信息。

## Agent 架构

前台统一呈现 FirstDrive，逻辑层由 `FirstDriveOrchestrator` 组织：

- Profile Agent：读取并更新驾驶熟悉度
- Journey Agent：获取与比较路线
- Environment Agent：读取出发时间和天气条件
- Vehicle Agent：读取车辆与说明书信息
- Readiness Agent：生成预演与本次清单
- Safety Service Agent：处理爆胎等紧急任务

当前版本使用确定性的规则与 Mock Tools，保证黑客松现场稳定。Agent Trace 只展示公开的结构化执行步骤，不展示内部 Chain-of-Thought。

已定义的工具接口：

```text
getUserProfile
getFamiliarityProfile
updateFamiliarity
searchVehicles
calculateTCO
getRouteOptions
calculateRouteDifficulty
getWeather
getVehicleManual
createRehearsal
createPreDriveChecklist
updateJourneyMemory
getEmergencyWorkflow
```

## 核心数据模型

- `UserProfile`：城市、驾龄、真实驾驶频率、常用时间、当前车辆
- `FamiliarityProfile`：16 个驾驶场景及 5 种熟悉状态
- `VehicleProfile`：动力、尺寸、续航、油耗、胎压、说明书条目
- `Journey`：起终点、时间、天气、路线、预演点、完成状态
- `RouteOption`：立交、变道、高速、隧道、熟悉道路比例、停车复杂度
- `DriveMemory`：已完成场景、旅程、车辆、保养与费用

`difficultyScore` 只在规则引擎内部用于路线比较，界面只展示人可以理解的具体原因。

## 规则引擎

`src/lib/engine.ts` 负责可解释路线复杂度：

- 复杂立交：+3
- 高难度变道：+4
- 中等变道：+2
- 困难停车：+2
- 陌生快速路：+3
- 雨天且不熟悉雨天驾驶：+3
- 熟悉道路比例降低复杂度

`getAssistanceLevel` 根据场景状态返回三级渐退式辅助：

- Level 3：第一次场景，提供完整预演与解释
- Level 2：已独立完成一次，减少基础内容
- Level 1：已熟悉，只提示异常条件

## API Mode 扩展位置

后续接入真实能力时，无需重写页面：

- 地图 API：替换 `src/data/demo.ts` 中的 `routeOptions`
- 天气 API：替换 `EnvironmentAgent` 的 Mock Weather
- 车辆说明书 RAG：替换 `VehicleProfile.manualEntries`
- LLM Tool Calling：在 `src/lib/agents.ts` 中接入模型，并保留当前 Mock Tools 作为 fallback
- 持久化数据库：将 `src/state/AppState.tsx` 的 localStorage 替换为服务端 repository

即使真实 API 或模型不可用，Mock Mode 仍可完整演示。

## 项目目录

```text
src/
  components/   品牌、导航、路线图、预演图、Agent Trace 等复用组件
  data/         Demo Persona、车辆、路线与预演节点
  lib/          规则引擎、Agent Orchestrator 与 Mock Tools
  pages/        13 个产品页面与状态
  state/        本地持久化状态
  types.ts      核心数据模型
  styles.css    完整设计系统与响应式实现
```

## 安全边界

- 不控制车辆，不参与自动驾驶决策。
- 不鼓励用户挑战危险驾驶条件。
- 驾驶中不要求复杂交互。
- 复杂操作统一提示“请在安全停车后继续”。
- Emergency Mode 仅作辅助，现场以交警、道路救援与车辆说明书为准。

## 验证

已通过：

- TypeScript 编译
- Vite 生产构建
- 1440×900 桌面主流程自动化
- 390×844 移动端无横向溢出检查
- 首页 → 路线比较 → 三节点预演 → 清单 → 驾驶 → 到达 → 熟悉度更新
- 浏览器控制台无应用错误

