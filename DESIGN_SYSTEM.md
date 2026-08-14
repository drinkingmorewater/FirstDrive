# FirstDrive v4.0 Design System

## 视觉主张

Calm Mobility OS：冷静、精确、可解释。v4 的 BUY SMART 采用真白底、窄画像侧栏、细分隔线和高信息密度表格；不把数据表格改成卡片海。

## 核心 Tokens

| 角色 | 值 |
| --- | --- |
| Buy Background | `#FFFFFF` |
| Canvas | `#F4F6F8` |
| Ink | `#172033` / `#0A0E14` |
| Secondary | `#65707C` |
| Hairline | `#DDE2E7` |
| Buy Accent | `#446CF4` |
| Accent Soft | `#EEF3FF` |
| Success | `#1DA979` |
| Warning | `#E49A31` |
| Critical | `#D95563` |
| Drive Background | `#070B10` |

字体使用 Inter / Noto Sans SC。工具栏、表头与说明文字显式定义 7–11px 级别；车型名与关键数字形成 14–24px 的主要层级。

## BUY SMART 容器模型

- 1680×943 原生验收尺寸：258px Profile Rail + 自适应主工作区。
- Header、Tabs、Scenario Simulator、Filter Bar、Ranking Table、TCO Detail 顺序固定。
- 车型结果使用 6 列表格骨架：排名 / 车型 / Fit Score / 为什么适合 / 可能的取舍 / 场景匹配。
- TCO 使用分类 Rail + 指标 / 明细表 + 对比要点，不使用重复卡片栅格。
- 白底车辆渲染图作为独立产品资产；文字、分数、进度和操作全部是原生 UI。

## 响应式

- 1500px 以上锁定参考图密度，并在 943px 高度内完整呈现主屏。
- 1040px 以下 Profile Rail 改为横向可编辑 Context Strip。
- 720px 以下车型结果改为三段式移动布局，隐藏桌面场景列，但保留 Fit、理由、取舍与 TCO。
- TCO 明细表在自己的容器中横向滚动；页面本身不得产生横向溢出。

## 状态语义

- Active / Route：蓝色。
- Completed / Familiar：绿色。
- Trade-off / Attention：琥珀色。
- Critical / Emergency：红色，仅用于安全风险。
- Agent Activity 必须来自运行事件；保存动作必须反馈到对应 Memory。

## Motion 与可访问性

- 交互反馈以选中、进度和 Toast 为主，避免驾驶场景中的无意义动效。
- 所有图标按钮有可读名称，表格与工作流有语义化区域。
- 尊重 `prefers-reduced-motion`。
