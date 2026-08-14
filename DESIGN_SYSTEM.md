# FirstDrive v5.0 Design System

## 视觉主张

Calm Mobility OS：冷静、精确、可解释。v5 保留 v4 的真白、冷灰、细分隔线与信息密度，不更换配色，不使用霓虹 Agent 图或无意义 3D 汽车。

## Global Frame

- 正常模式：固定 72px 白色导航。
- 驾驶模式：固定 60px 深色导航。
- 五层顺序永远为 KNOW ME、BUY SMART、DRIVE SAFE、ON THE ROAD、HELP ME。
- 页面切换只移动 Active Indicator；Logo、五层位置与用户入口不移动。
- 移动端仍同时显示五层，压缩为序号与中文短标签。

## Logo

- `MountainMark.tsx` 是唯一 Logo 图形，固定 32 × 32、统一 viewBox 与 2.4 stroke。
- Light 使用深墨色，Dark 使用白色，仅颜色变化。
- Wordmark 只用于 Welcome/Home 等品牌表达，内部工具页不重复组合 Logo。

## 核心 Tokens

| 角色 | 值 |
| --- | --- |
| Canvas | `#F4F6F8` |
| Surface | `#FFFFFF` |
| Ink | `#0A0E14` |
| Secondary | `#65707C` |
| Hairline | `#DDE2E7` |
| Accent | `#5B7CFA` |
| Accent Soft | `#EAF0FF` |
| Success | `#2FA67C` |
| Warning | `#D89B3C` |
| Critical | `#D95563` |
| Drive Background | `#070B10` |

## Intelligence Canvas

- 三列结构：What I Heard / Personal Mobility Context / Agent Mesh。
- Context 固定四象限：人、车、路、境。
- 信息可信状态固定为 Confirmed、Inferred、Need to confirm。
- Agent Mesh 中央为 Orchestrator，外围为 ME、BUY、READY、ROAD、HELP；状态只使用 Waiting、Thinking、Using Tool、Done。
- 连线使用细灰线与轻微流动，不使用彩色霓虹。

## BUY SMART

- 保留 Profile Rail、Header、Tabs、Scenario、Filter、Ranking Table 与 TCO Detail 的高密度桌面骨架。
- 增加「来自你的哪些信息」与 `Ranking updated`，让 Know Me → Buy Agent 可见。
- 真实表格、文字、分数与操作全部代码原生；车辆图只作为产品资产。

## 响应式与驾驶安全

- 1680 × 943 为主桌面验收尺寸；390 × 844 为移动端验收尺寸。
- 页面不得产生横向溢出。
- 驾驶页使用 Mini Agent Indicator，完整 Mesh 只在非驾驶任务页或停车后展开。
- 尊重 `prefers-reduced-motion`；关键按钮、图标操作均提供可读名称。
