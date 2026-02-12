---
sidebar_position: 3
---

# 用户与系统配置

## 获取系统配置（getSysConfig）

### 说明

此方法主要用于获取一些系统级别配置，由底层更新值，外部组件只提供取值功能。

### 基本用法

```typescript
// getSysConfig<T extends keyof ISysConfig>(key?: T)
mk.getSysConfig('allowCustomize'); // true
```

### 参数说明

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| key | 配置的 key | `string` | - | 否 |

### 配置项说明

| key | 说明 | 返回值类型 |
|-----|------|-----------|
| `sysPersonRetrievePcUrl` | 忘记密码链接(桌面端) | `string` |
| `sysPersonRetrieveMobileUrl` | 忘记密码链接(移动端) | `string` |
| `sysFrontendLogCollectSwitch` | 后端是否开启日志收集开关 | `boolean` |
| `isPreview` | 当前是否处于预览模式 | `boolean` |
| `platform` | 当前门户加载的平台 | `'mobile' \| 'desktop' \| 'manage'` |
| `standalone` | 模块是否独立运行 | `boolean` |
| `portalId` | 当前门户 ID | `string` |
| `roleType` | 当前登录的用户角色类型 | `'anonymous' \| 'sysadmin' \| 'security' \| 'auditor' \| 'normal'` |
| `accessMng` | 当前登录的用户是否允许进入后台管理 | `boolean` |
| `avatarId` | 当前用户头像 id | `string` |
| `currentUser` | 当前登录的用户信息 | `{fdId: string, fdName: string, fdLoginName: string}` |
| `currentPage` | 当前页面信息 | `{fdId: string, fdName: string}` |
| `fdPersonalTheme` | 当前门户是否允许用户自定义换肤 | `boolean` |
| `searchUrl` | 搜索链接前缀 | `string` |
| `userImagePrefix` | 用户头像地址前缀 | `string` |
| `tenantUrlPrefix` | 租户资源路径前缀 | `string` |
| `modulesUrlPrefix` | 所有模块路径前缀 | `string` |
| `apiUrlPrefix` | 门户接口地址前缀 | `string` |
| `elementsUrlPrefix` | 组件地址前缀 | `string` |
| `customUrlPrefix` | 拓展自定义地址前缀 | `{[key: string]: string}` |
| `tenantID` | 当前租户 ID | `string` |
| `currentModule` | 当前模块名称 | `string` |
| `allowCustomize` | 是否允许页面自定义 | `boolean` |
| `templateID` | 模版 ID | `string` |
| `encryptKey` | 登录及其他需要使用加密的加密密钥 | `string` |
| `currentUserAuthInfo` | 当前用户认证信息 | `{[key: string]: string[]}` |

### 使用示例

```typescript
// 获取当前平台类型
const platform = mk.getSysConfig('platform');
// 返回值: 'mobile' | 'desktop' | 'manage'

// 判断是否为管理员
const roleType = mk.getSysConfig('roleType');
const isAdmin = roleType === 'sysadmin';

// 获取当前用户信息
const currentUser = mk.getSysConfig('currentUser');
console.log(currentUser?.fdName); // 用户姓名
console.log(currentUser?.fdLoginName); // 登录名

// 获取当前页面信息
const currentPage = mk.getSysConfig('currentPage');
console.log(currentPage?.fdName); // 页面名称
```

---

## 更新用户配置（updateUserConfig）

### 说明

此方法主要用于更新一些用户级别配置，便于其他地方获取值。

### 基本用法

```typescript
// updateUserConfig(cfg: Partial<IUserConfig>)
mk.updateUserConfig({
  locale: 'en-us'
});
```

### 配置项说明

| key | 说明 | 类型 |
|-----|------|------|
| `userDing` | 是否开启待看 | `boolean` |
| `defaultLocale` | 系统默认语言 | `I18n.ELangs` |
| `locale` | 当前使用的语言 | `I18n.ELangs` |
| `allLocales` | 所有支持的语言 | `IAllLangs` |
| `theme` | 当前主题 | `{currentTheme: string, defaultTheme: string}` |
| `canWaitingToSee` | 是否激活待看 | `boolean` |
| `openLinkInTab` | 是否开启内部打开页面（内嵌多页签形式） | `boolean` |

### 使用示例

```typescript
// 切换语言
const handleChangeLocale = (locale: string) => {
  mk.updateUserConfig({
    locale: locale as I18n.ELangs
  });
  // 触发页面刷新或重新加载
  window.location.reload();
};

// 更新主题
const handleChangeTheme = (themeId: string) => {
  mk.updateUserConfig({
    theme: {
      currentTheme: themeId,
      defaultTheme: mk.getUserConfig('theme')?.defaultTheme || ''
    }
  });
};
```

---

## 获取用户配置（getUserConfig）

### 说明

此方法主要用于获取一些用户级别配置。

### 基本用法

```typescript
// getUserConfig<T extends keyof IUserConfig>(key?: T)
mk.getUserConfig('canWaitingToSee'); // true
```

### 配置项说明

同 `updateUserConfig` 方法。

### 使用示例

```typescript
// 获取当前语言设置
const currentLocale = mk.getUserConfig('locale');
// 返回值: 'zh-cn' | 'en-us' | ...

// 获取当前主题
const theme = mk.getUserConfig('theme');
console.log(theme?.currentTheme); // 当前主题 ID
console.log(theme?.defaultTheme); // 管理员默认主题 ID

// 判断是否开启待看功能
const canWaitingToSee = mk.getUserConfig('canWaitingToSee');
if (canWaitingToSee) {
  // 初始化待看功能
}
```

---

## 最佳实践

### 1. 配置监听

结合事件系统监听配置变化：

```typescript
import { useEffect, useState } from 'react';

const useUserLocale = () => {
  const [locale, setLocale] = useState(mk.getUserConfig('locale'));

  useEffect(() => {
    // 监听页面变化，重新获取配置
    const handlePageChange = () => {
      setLocale(mk.getUserConfig('locale'));
    };

    mk.on('PAGE_CHANGE', handlePageChange);

    return () => {
      mk.off('PAGE_CHANGE', handlePageChange);
    };
  }, []);

  return locale;
};
```

### 2. 权限控制

基于角色类型进行权限控制：

```typescript
const useAccessControl = () => {
  const roleType = mk.getSysConfig('roleType');
  const accessMng = mk.getSysConfig('accessMng');

  return {
    isAdmin: roleType === 'sysadmin',
    isSecurity: roleType === 'security',
    isAuditor: roleType === 'auditor',
    canAccessManage: accessMng,
    isAnonymous: roleType === 'anonymous'
  };
};
```

### 3. 平台适配

根据平台类型加载不同组件：

```typescript
const PlatformAdapter: React.FC = () => {
  const platform = mk.getSysConfig('platform');

  switch (platform) {
    case 'mobile':
      return <MobileLayout />;
    case 'desktop':
      return <DesktopLayout />;
    case 'manage':
      return <ManageLayout />;
    default:
      return <DesktopLayout />;
  }
};
```
