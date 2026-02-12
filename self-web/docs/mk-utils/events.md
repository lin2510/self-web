---
sidebar_position: 4
---

# 事件系统

MK 工具库提供了完整的事件系统，支持事件的监听、发布、移除等操作。

## 事件监听（on）

相当于 `addEventListener`，用于持续监听某个事件。

### 基本用法

```typescript
function listener(detail: any) {
  // detail 为 emit 传递的值
  console.log('收到事件:', detail);
}

// on = (evt: string, callback: Function, one?: boolean)
mk.on('xxxxxxx', listener);
```

### 参数说明

| 参数 | 说明 | 类型 | 是否必传 |
|------|------|------|----------|
| evt | 事件名称 | `string` | 是 |
| callback | 回调函数 | `Function` | 是 |
| one | 是否只执行一次 | `boolean` | 否 |

---

## 单次事件监听（one）

相当于 `addEventListener`，但执行一次后会自动移除事件，不需要手动 `off`。

### 基本用法

```typescript
function listener(detail: any) {
  // detail 为 emit 传递的值
  console.log('只执行一次:', detail);
}

// one = (evt: string, callback: Function)
mk.one('xxxxxxx', listener);
```

### 使用场景

```typescript
// 等待 RequireJS 空闲
mk.one('REQUIREJS_IDLE', () => {
  console.log('RequireJS 加载完成');
  // 执行依赖 RequireJS 的代码
});
```

---

## 移除事件监听（off）

用于移除已注册的事件监听器。

### 基本用法

```typescript
// (evt: string, callback: Function)
mk.off('xxxxxxx', listener);
```

:::tip 提示
使用 `one` 监听的事件不需要手动 `off`，会自动移除。
:::

---

## 发布事件（emit）

用于触发事件，通知所有监听该事件的回调函数。

### 基本用法

```typescript
// emit(evt: string, detail?: any, isUseStorage?: boolean)
mk.emit('xxxxxxx', {
  now: Date.now() // 参数，监听的地方可以拿到这个参数
}, true); // isUseStorage 用于是否要将当前事件同步到其他地方（如 iframe 外部或浏览器其他 tab 标签页）
```

### 参数说明

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| evt | 事件名称 | `string` | - | 是 |
| detail | 传递的数据 | `any` | - | 否 |
| isUseStorage | 是否同步到其他页面 | `boolean` | `false` | 否 |

---

## 获取事件（getEvents）

用于获取已注册的事件监听器。

### 基本用法

```typescript
// 获取指定事件的所有监听器
const listeners = mk.getEvents('xxxxxxx');
// 返回: Function[]

// 不传参数则获取 mk 所监听的所有事件
const allEvents = mk.getEvents();
// 返回: Record<string, Function[]>
```

---

## 内置事件

### REQUIREJS_IDLE

RequireJS 没有加载任务了，需要使用 `one` 进行监听。

```typescript
mk.one('REQUIREJS_IDLE', () => {
  console.log('RequireJS 空闲，可以加载组件');
  // 加载依赖 RequireJS 的组件
});
```

### UPDATE_APP

更新应用事件，用于刷新或重新挂载 React 应用。

```typescript
mk.emit('UPDATE_APP', {
  /**
   * type 的值分为两种：
   * - reuse: 复用，会复用整个 React 应用，仅仅针对 React 应用的 props 进行刷新
   * - destroy: 摧毁，相当于 location.reload，整个应用会重新挂载
   */
  type: 'reuse'
});
```

### PAGE_CHANGE

页面更新事件，此时可拿到相关页面最新的配置，如 `allowCustomize` 或 `currentPage`。

```typescript
mk.on('PAGE_CHANGE', () => {
  const allowCustomize = mk.getSysConfig('allowCustomize');
  const currentPage = mk.getSysConfig('currentPage');
  console.log('页面变化:', currentPage?.fdName);
  console.log('是否允许自定义:', allowCustomize);
});
```

### ROLE_TYPE_CHANGE

角色变化事件，可用于判断登录态变化。

```typescript
mk.on('ROLE_TYPE_CHANGE', () => {
  const roleType = mk.getSysConfig('roleType');
  console.log('角色变化:', roleType);
  
  if (roleType === 'anonymous') {
    // 用户已登出，跳转到登录页
    window.location.href = '/login';
  }
});
```

### PORTALID_CHANGE

门户 ID 发生改变事件。

```typescript
mk.on('PORTALID_CHANGE', () => {
  const portalId = mk.getSysConfig('portalId');
  console.log('门户 ID 变化:', portalId);
});
```

---

## 事件命名规范

| 事件类型 | 命名规则 | 示例 |
|---------|---------|------|
| 系统事件 | 全部大写 | `PAGE_CHANGE`, `UPDATE_APP` |
| 组件交互事件 | 以 `widget-` 开头 | `widget-click`, `widget-change` |
| 模块交互事件 | 以 `module-` 开头 | `module-init`, `module-destroy` |
| 插件相关事件 | 以 `plugin-` 开头 | `plugin-load`, `plugin-error` |

---

## 完整示例

### 自定义事件的使用

```typescript
// 定义事件名称常量（推荐）
const EVENTS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  DATA_UPDATED: 'DATA_UPDATED'
} as const;

// 登录成功时发布事件
const handleLogin = (userInfo: UserInfo) => {
  mk.emit(EVENTS.USER_LOGIN, {
    userId: userInfo.fdId,
    userName: userInfo.fdName,
    timestamp: Date.now()
  });
};

// 在组件中监听登录事件
const UserStatusComponent: React.FC = () => {
  useEffect(() => {
    const handleUserLogin = (detail: any) => {
      console.log('用户登录:', detail.userName);
      // 更新组件状态
    };

    const handleUserLogout = () => {
      console.log('用户登出');
      // 清理用户数据
    };

    // 注册事件监听
    mk.on(EVENTS.USER_LOGIN, handleUserLogin);
    mk.on(EVENTS.USER_LOGOUT, handleUserLogout);

    // 组件卸载时移除监听
    return () => {
      mk.off(EVENTS.USER_LOGIN, handleUserLogin);
      mk.off(EVENTS.USER_LOGOUT, handleUserLogout);
    };
  }, []);

  return <div>用户状态组件</div>;
};
```

### 跨页面通信

```typescript
// 在页面 A 中发布事件
mk.emit('CROSS_PAGE_MESSAGE', {
  from: 'pageA',
  message: 'Hello from Page A',
  data: { /* ... */ }
}, true); // isUseStorage = true，同步到其他页面

// 在页面 B 中监听事件
mk.on('CROSS_PAGE_MESSAGE', (detail) => {
  console.log('收到跨页面消息:', detail.message);
  console.log('来自:', detail.from);
});
```
