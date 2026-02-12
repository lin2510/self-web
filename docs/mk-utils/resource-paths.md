---
sidebar_position: 5
---

# 资源路径处理

## 获取用户头像地址（getUserAvatarUrl）

### 基本用法

```typescript
// 1dd5kg2gtw6wb2w34ib7e02gf32sr3ph1rw0 为 userID
mk.getUserAvatarUrl('1dd5kg2gtw6wb2w34ib7e02gf32sr3ph1rw0');
// 返回: http://exp.landray.com.cn:9506/ekp/sys/person/image.jsp?personId=1dd5kg2gtw6wb2w34ib7e02gf32sr3ph1rw0&t=1578487571327
```

### 使用场景

```typescript
// 在组件中显示用户头像
const UserAvatar: React.FC<{ userId: string }> = ({ userId }) => {
  const avatarUrl = mk.getUserAvatarUrl(userId);

  return (
    <img
      src={avatarUrl}
      alt="用户头像"
      style={{ width: 40, height: 40, borderRadius: '50%' }}
    />
  );
};
```

---

## 获取模块资源（getModuleResourcePath）

### 基本用法

```typescript
// @param relativePath 模块资源的相对路径
// function getModuleResourcePath(relativePath: string)
// 当模块处于非 standalone 模式时资源路径缺少 moduleName/platform，此函数用于补全这部分信息
mk.getModuleResourcePath('./model');
// 返回: ./sys-portal/manage/model
```

### 使用场景

```typescript
// 动态加载模块资源
const loadModuleResource = (resourceName: string) => {
  const fullPath = mk.getModuleResourcePath(`./resources/${resourceName}`);
  return import(fullPath);
};
```

---

## 获取资源路径（getResourcePath）

### 说明

用于获取资源路径，支持多种前缀标识不同类型的资源。

### 前端资源（@ 开头）

```typescript
mk.getResourcePath('@elements/list/index.js');
// 返回: http://exp.landray.com.cn:9507/web/sys/artifact/elements/list/index.js
```

### 后端资源（$ 开头）

```typescript
mk.getResourcePath('$datasource/locale/zh-cn.json');
// 返回: http://exp.landray.com.cn:9507/web/sys/manufact/datasource/locale/zh-cn.json
```

### 租户资源

租户资源使用 `@user-` 或 `$user-` 前缀，同样区分前后端：

```typescript
// 后端租户资源
mk.getResourcePath('$user-ele/list/index.js');
// 返回: http://exp.landray.com.cn:9507/web/tenant/0/manufact/ele/list/index.js

// 前端租户资源
mk.getResourcePath('@user-ele/list/index.js');
// 返回: http://exp.landray.com.cn:9507/web/tenant/0/artifact/ele/list/index.js
```

### 模块资源（@module: 开头）

```typescript
mk.getResourcePath('@module:sys-portal/index.js');
// 返回: http://exp.landray.com.cn:9507/web/sys-portal/index.js
```

### 上传素材（@attach/xxx/ 开头）

```typescript
mk.getResourcePath('@attach/icon/sfasgasgasgsa');
// 返回: http://exp.landray.com.cn:9507/data/sys-attach/download/sfasgasgasgsa
```

### 完整示例

```typescript
// 资源路径工具函数
const ResourceUtils = {
  // 获取组件资源
  getComponentPath: (componentName: string) => {
    return mk.getResourcePath(`@elements/${componentName}/index.js`);
  },

  // 获取数据源配置
  getDataSourcePath: (dataSourceName: string) => {
    return mk.getResourcePath(`$datasource/${dataSourceName}/config.json`);
  },

  // 获取租户组件
  getTenantComponent: (componentName: string) => {
    return mk.getResourcePath(`@user-${componentName}/index.js`);
  },

  // 获取附件下载链接
  getAttachmentUrl: (attachId: string, type: string = 'file') => {
    return mk.getResourcePath(`@attach/${type}/${attachId}`);
  }
};

// 使用示例
const componentUrl = ResourceUtils.getComponentPath('theme-picker');
const configUrl = ResourceUtils.getDataSourcePath('user-list');
```

---

## 获取帮助文档地址（getDocUrl）

### 基本用法

```typescript
mk.getDocUrl('xxxx');
// 返回: http://exp.landray.com.cn:9508/web/docs/user-manual/#/xxxx
```

### 使用场景

```typescript
// 帮助链接组件
const HelpLink: React.FC<{ docKey: string; children: React.ReactNode }> = ({
  docKey,
  children
}) => {
  const docUrl = mk.getDocUrl(docKey);

  return (
    <a href={docUrl} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

// 使用
<HelpLink docKey="getting-started">查看使用指南</HelpLink>
```
