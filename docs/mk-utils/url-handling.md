---
sidebar_position: 6
---

# URL 处理与跳转

## 规范处理 URL（normalizeUrl）

### 说明

可以将传入的 URL 转换成标准的链接格式，支持多种 URL 格式的转换。

### 支持的 URL 格式

| URL 格式 | 说明 |
|---------|------|
| `sys://user/xxx` | 本门户间跳转，xxx 为页面 ID |
| `sys://manage` | 跳转到管理端 |
| `sys://xxxxx/xxx` | 跳转到对应门户，xxxxx 为门户 ID |
| `#/platform/module/hash` | platform 为平台信息，module 为模块名 |
| `http://.../web/module/platform/#/hash` | 完整 URL 格式 |
| `http://.../web/#/platform/module/hash` | 完整 URL 格式（hash 模式）|

### 参数说明

| 参数 | 类型 | 说明 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| url | `string` | 链接地址 | - | 否 |
| isStandalone | `boolean` | 是否是独立运行 | `false` | 否 |
| withoutRefer | `boolean` | 是否需要不添加来源 | `false` | 否 |

### 使用示例

```typescript
// sys://manage/sys-portal/xxxx
const a = mk.normalizeUrl('sys://manage/sys-portal/xxxx');
// 返回: http://exp.landray.com.cn:9507/web/?utm_source=mkpaas#/manage/sys-portal/xxxx

const b = mk.normalizeUrl('sys://manage/sys-portal/xxxx', false);
// 返回: http://exp.landray.com.cn:9507/web/sys-portal/manage/?utm_source=mkpaas#/xxxx

// sys://user/sys-portal/xxxxxx
const c = mk.normalizeUrl('sys://user/sys-portal/xxxxxx');
// 返回: http://exp.landray.com.cn:9507/web/?utm_source=mkpaas#/1ds6kj19gwasw1dr0sw2cip3s42jf350c2w0/sys-portal/xxxxxx

const d = mk.normalizeUrl('sys://user/sys-portal/xxxxxx', false);
// 返回: http://exp.landray.com.cn:9507/web/sys-portal/desktop/?utm_source=mkpaas#/xxxxxx

// sys://wsmhid
const e = mk.normalizeUrl('sys://wsmhid/sys-portal');
// 返回: http://exp.landray.com.cn:9507/web/?utm_source=mkpaas#/wsmhid/sys-portal

// #/manage/sys-lbpm/lbpmTemplateManage/list
const g = mk.normalizeUrl('#/manage/sys-lbpm/lbpmTemplateManage/list');
// 返回: http://exp.landray.com.cn:9507/web/?utm_source=mkpaas#/manage/sys-lbpm/lbpmTemplateManage/list
```

---

## 统一链接跳转（openLink）

### 说明

统一的链接跳转方法，支持多种打开方式和参数配置。

### 参数说明

| 参数 | 类型 | 说明 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| url | `string` | 链接地址（同 `mk.normalizeUrl` 的 url） | - | 否 |
| isStandalone | `boolean` | 是否是独立运行 | `false` | 否 |
| withoutRefer | `boolean` | 是否需要不添加来源 | `false` | 否 |
| target | `string` | 打开目标 | - | 否 |
| targetKey | `string` | 唯一 key 值，便于双向通信时做标识 | - | 否 |
| forceTarget | `boolean` | 强制使用 target 的值作为窗口的打开方式 | `false` | 否 |
| title | `string` | 链接标题 | - | 否 |
| event | `React.MouseEvent` | 鼠标点击事件 | - | 否 |
| node | `Element` | 链接的 DOM 节点对象 | - | 否 |

### 使用示例

```typescript
// 基本跳转
mk.openLink({
  url: 'sys://manage/sys-portal/settings'
});

// 新窗口打开
mk.openLink({
  url: 'https://example.com',
  target: '_blank',
  title: '示例页面'
});

// 结合点击事件
const handleClick = (event: React.MouseEvent) => {
  mk.openLink({
    url: 'sys://user/sys-portal/detail',
    event: event,
    targetKey: 'detail-page'
  });
};

// 独立运行模式
mk.openLink({
  url: '#/desktop/sys-portal/home',
  isStandalone: true
});
```

### 完整封装示例

```typescript
// 链接跳转工具函数
const LinkUtils = {
  // 跳转到管理端
  goToManage: (module?: string, page?: string) => {
    const url = module
      ? `sys://manage/${module}${page ? '/' + page : ''}`
      : 'sys://manage';
    mk.openLink({ url });
  },

  // 跳转到用户门户
  goToUserPortal: (portalId: string, module?: string, page?: string) => {
    const url = `sys://${portalId}${module ? '/' + module : ''}${page ? '/' + page : ''}`;
    mk.openLink({ url });
  },

  // 新窗口打开外部链接
  openExternal: (url: string, title?: string) => {
    mk.openLink({
      url,
      target: '_blank',
      title: title || '外部链接'
    });
  },

  // 内部页面跳转（多页签模式）
  openInTab: (url: string, title: string, targetKey: string) => {
    mk.openLink({
      url,
      title,
      targetKey,
      target: '_tab'
    });
  }
};

// 使用示例
LinkUtils.goToManage('sys-portal', 'settings');
LinkUtils.openExternal('https://github.com', 'GitHub');
```

---

## 初始化应用（initAppConfig）

### 说明

会初始化整个应用，一般用于退出登录再登录的情况，**慎用** ⚠️

### 基本用法

```typescript
// initApp(portalResponse: AxiosResponse<Portlet.IAppPortletRuntime>, isPortal?: boolean)
mk.initAppConfig(portalResponse, isPortal);
```

### 使用场景

```typescript
// 重新初始化应用（如切换租户后）
const reinitApp = async () => {
  try {
    const response = await fetchPortalData();
    mk.initAppConfig(response, true);
  } catch (error) {
    console.error('应用初始化失败:', error);
  }
};
```

:::warning 警告
此方法会重新初始化整个应用状态，可能导致当前页面数据丢失，请谨慎使用。
:::
