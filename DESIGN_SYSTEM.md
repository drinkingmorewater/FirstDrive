# FirstDrive v3.0 Design System

## 视觉主张

Calm Mobility OS：冷静、精确、可解释。准备阶段使用开放的冷白画布；驾驶阶段切换为近黑实时驾驶舱。全站不使用珊瑚红，也不使用营销型渐变大胶囊。

## Tokens

| 角色 | 值 |
| --- | --- |
| Canvas | #F4F6F8 |
| Surface | #FFFFFF |
| Ink | #0A0E14 |
| Secondary | #65707C |
| Hairline | #DDE2E7 |
| Accent | #5B7CFA |
| Accent Soft | #EAF0FF |
| Success | #2FA67C |
| Warning | #D89B3C |
| Critical | #D95563 |
| Drive Background | #070B10 |
| Drive Text | #F5F7FA |
| Drive Muted | #8B98A7 |
| Route | #7FA3FF |

字体：Inter 优先，中文回退到本地 Noto Sans SC。标题使用紧凑负字距，正文保持 1.6–1.9 行高。

## 布局

- 全局顶部是五层工作区导航，不使用传统功能菜单。
- 页面以画布、细分隔线和局部面板组织；圆角限制在 8–18px。
- 一屏仅允许一个蓝色主行动作。
- 桌面重点屏宽为 1440 / 1366，移动重点屏宽为 390。
- Driving Cockpit 固定为 Top Status / Live Map / Context Rail / Safe Controls 四区。

## 状态与反馈

- Active / Route：蓝色。
- Completed / Familiar：绿色。
- Attention / Weather：琥珀色。
- Critical / Emergency：红色，仅用于安全风险。
- Agent 状态必须来自运行时事件；不得用静态 Trace 冒充执行过程。

## Motion

- Agent Running 图标缓慢旋转。
- 当前车辆点使用低频脉冲。
- 语音阶段以 Listening → Understanding → Agent Working → Speaking 依次高亮。
- 路线进度每 2 秒自动更新。
- 尊重 prefers-reduced-motion。
