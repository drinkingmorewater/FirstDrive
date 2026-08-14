# FirstDrive Design System

## 视觉主张

Quiet confidence / precision / mobility / journey / calm technology / human-centered。

产品界面使用大面积真实白色、强字体层级和极少量路线线条。驾驶模式才切换为近黑背景，形成“准备时充分理解、驾驶时保持安静”的状态对比。

## Tokens

| 角色 | 值 |
| --- | --- |
| Background | `#FFFFFF` |
| Ink | `#111516` |
| Muted | `#717879` |
| Hairline | `#E2E6E4` |
| Coral / Action | `#F24A3D` |
| Moss / Familiar | `#47763C` |
| Orange / Prepare | `#EB941B` |
| Blue / Accompanied | `#38658F` |
| Driving background | `#0B0F11` |

## 熟悉度状态

- 未经历：灰色空心节点
- 希望先了解：橙色空心节点
- 有人陪同完成：蓝色空心节点
- 已独立完成：绿色空心节点
- 已熟悉：绿色实心节点

禁止将这些状态合成为一个能力分数。

## 组件规则

- 主要按钮：珊瑚红；到达后的“查看新熟悉度”使用苔藓绿。
- 圆角控制在 8–18px，避免巨型圆角容器。
- 页面主要使用开放布局、分隔线、轨道与地图画布，避免满屏卡片。
- 驾驶模式字体必须一眼可读，单屏只保留一个关键提醒。
- 路线与节点使用 SVG/CSS 原生绘制，所有产品文字保持代码原生。

## Motion

- 路线从起点向终点绘制。
- 预演节点切换使用短距离淡入淡出。
- 熟悉度更新从橙色过渡到绿色。
- 尊重 `prefers-reduced-motion`。

