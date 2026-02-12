---
sidebar_position: 1
---

# MK 工具库介绍

> 一个 mkpaas 底层核心工具库

本库包含了所有 mkpaas 的全局方法，包括事件、获取资源路径、获取全局配置等等一系列方法。

:::tip 提示
在业务模块及组件中可直接使用本库中的所有方法，**无需引入**。
:::

## 核心功能概览

| 功能分类 | 方法 | 说明 |
|---------|------|------|
| 时间处理 | `getFormatTime` | 获取多语言格式化时间 |
| 多语言 | `getI18nMessage` | 组件获取多语言信息 |
| 用户相关 | `getUserAvatarUrl` | 获取用户头像地址 |
| 资源路径 | `getModuleResourcePath` | 获取模块资源路径 |
| 系统配置 | `getSysConfig` | 获取系统级别配置 |
| 用户配置 | `getUserConfig` / `updateUserConfig` | 获取/更新用户配置 |
| 事件系统 | `on` / `emit` / `one` / `off` | 事件监听与发布 |
| 数据存储 | `userStore` | 根据用户 ID 存储数据 |
| URL 处理 | `normalizeUrl` / `openLink` | URL 规范化与跳转 |
| 数据轮询 | `onDataChange` / `offDataChange` | 监听数据源更新 |

## 快速示例

### 获取格式化时间

```typescript
// 获取当前时间的格式化字符串
mk.getFormatTime(Date.now(), 'LLLLLLLLL');
// zh-cn 下输出: 2020/01/08 20:20
```

### 获取系统配置

```typescript
// 获取当前用户角色类型
const roleType = mk.getSysConfig('roleType');
// 返回值: 'anonymous' | 'sysadmin' | 'security' | 'auditor' | 'normal'
```

### 事件监听

```typescript
// 监听页面变化事件
mk.on('PAGE_CHANGE', () => {
  const allowCustomize = mk.getSysConfig('allowCustomize');
  console.log('页面自定义权限:', allowCustomize);
});
```

## 详细文档

- [时间处理与多语言](./time-and-i18n) - `getFormatTime`、`getI18nMessage`
- [用户与系统配置](./config) - `getSysConfig`、`getUserConfig`、`updateUserConfig`
- [资源路径处理](./resource-paths) - `getResourcePath`、`getModuleResourcePath`
- [事件系统](./events) - `on`、`emit`、`one`、`off`、`getEvents`
- [数据存储](./data-storage) - `userStore` 使用指南
- [URL 处理与跳转](./url-handling) - `normalizeUrl`、`openLink`
- [数据轮询](./data-polling) - `onDataChange`、`offDataChange`
