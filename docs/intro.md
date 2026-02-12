---
sidebar_position: 1
---

# 云速易连前端开发规范

欢迎来到云速易连前端技术文档中心！本文档涵盖了 **React17 + AntD/AntDX** 前端开发的核心规范与最佳实践。

## 核心能力清单

### 技术栈精通
- React17 新特性（useTransition、并发渲染、自动批处理）
- AntD 5.x/AntDX 全组件使用
- TypeScript 类型定义
- Less 样式定制

### 业务场景适配
- AI 对话流式响应处理
- Token 计数与限额
- 对话历史缓存
- AI 接口请求 / 异常处理
- 无障碍交互

### 代码规范遵循
- 严格对齐阿里前端编码规约
- React Hooks 规则
- AntD 组件使用规范
- 命名 / 注释 / 格式规范

### 性能优化落地
- 长列表虚拟化
- 组件重渲染优化
- 请求防抖 / 节流 / 取消
- 静态资源懒加载

## 代码产出通用规范

### 1. 基础约束（必须严格遵守）

#### 语法 & 类型
- 所有代码基于 **TypeScript** 编写
- React 版本锁定 **17.x**
- AntD/AntDX 版本锁定 **5.x**
- **禁止使用已废弃 API**

#### 命名规则
| 类型 | 规范 | 示例 |
|------|------|------|
| 变量 / 函数 | 小驼峰 | `userName`, `getUserInfo` |
| 组件 | 大驼峰 | `UserCard`, `UserList` |
| 常量 | 全大写下划线 | `MAX_COUNT`, `API_BASE_URL` |
| 自定义 Hooks | 以 use 开头 | `useUserInfo`, `useFetch` |
| 事件函数 | 以 handle/on 开头 | `handleClick`, `onSubmit` |

:::warning 重要
不允许以中文进行命名！
:::

#### 注释要求
- 组件 / 自定义 Hooks 必须带 **JSDoc 注释**
- 复杂逻辑（如流式响应、token 计算）必须添加行内注释

#### 格式要求
- 缩进：**2 空格**
- 行尾：**分号**
- 字符串：**单引号**（模板字符串除外）
- 对象 / 数组：**末尾加逗号**

#### 性能要求
所有代码必须考虑性能优化：
- 长列表加虚拟化
- 请求加取消逻辑
- 避免不必要重渲染

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/en/download/) 版本 18.0 或以上
- npm 或 yarn 包管理器

### 创建新项目

```bash
npx create-react-app my-app --template typescript
```

### 安装依赖

```bash
npm install antd@5.x @ant-design/x react@17.x react-dom@17.x
```

## 下一步

- [开发规范详解](./coding-standards) - 深入了解代码编写规范
- [MK 工具库](./category/mk工具库) - 掌握底层工具库的使用
- [最佳实践](./best-practices) - 学习项目实战经验
