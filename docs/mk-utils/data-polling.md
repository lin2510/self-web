---
sidebar_position: 8
---

# 数据轮询

MK 工具库提供了数据轮询功能，可以监听数据源的变化并自动更新。

## 监听数据源更新（onDataChange）

### 基本用法

```typescript
mk.onDataChange(dataSourceID: string, handler: Function, portalId?: string);
```

### 参数说明

| 参数 | 类型 | 说明 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| dataSourceID | `string` | 轮询的数据源 ID | - | 是 |
| handler | `Function` | 数据源若有更新回调 | - | 是 |
| portalId | `string` | 门户 ID | `getSysConfig('portalId')` | 否 |

### 使用示例

```typescript
// 监听数据源变化
mk.onDataChange('user-list-data', (newData) => {
  console.log('用户列表数据已更新:', newData);
  // 更新组件状态
  setUserList(newData);
});

// 指定门户 ID
mk.onDataChange('notification-data', handleNotificationUpdate, 'portal-123');
```

---

## 卸载监听数据源更新（offDataChange）

### 基本用法

```typescript
mk.offDataChange(dataSourceID: string, handler: Function);
```

### 参数说明

参数同 `onDataChange`。

### 使用示例

```typescript
// 定义处理函数
const dataHandler = (newData) => {
  console.log('数据更新:', newData);
};

// 开始监听
mk.onDataChange('my-data-source', dataHandler);

// 停止监听
mk.offDataChange('my-data-source', dataHandler);
```

---

## React 组件中使用

### 自定义 Hook 封装

```typescript
import { useEffect, useState, useCallback } from 'react';

/**
 * 使用数据轮询的 Hook
 * @param dataSourceID 数据源 ID
 * @param initialValue 初始值
 * @returns [data, refresh]
 */
function useDataPolling<T>(
  dataSourceID: string,
  initialValue: T
): [T, () => void] {
  const [data, setData] = useState<T>(initialValue);

  const handleDataChange = useCallback((newData: T) => {
    setData(newData);
  }, []);

  useEffect(() => {
    // 组件挂载时开始监听
    mk.onDataChange(dataSourceID, handleDataChange);

    // 组件卸载时停止监听
    return () => {
      mk.offDataChange(dataSourceID, handleDataChange);
    };
  }, [dataSourceID, handleDataChange]);

  // 手动刷新方法
  const refresh = useCallback(() => {
    // 触发数据刷新逻辑
    mk.emit('DATA_REFRESH', { dataSourceID });
  }, [dataSourceID]);

  return [data, refresh];
}

// 使用示例
const UserListComponent: React.FC = () => {
  const [userList, refreshUserList] = useDataPolling('user-list', []);

  return (
    <div>
      <button onClick={refreshUserList}>刷新列表</button>
      <ul>
        {userList.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 多数据源监听

```typescript
/**
 * 监听多个数据源
 */
function useMultiDataPolling(dataSources: string[]) {
  const [dataMap, setDataMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const handlers: Record<string, Function> = {};

    dataSources.forEach(sourceId => {
      handlers[sourceId] = (data: any) => {
        setDataMap(prev => ({
          ...prev,
          [sourceId]: data
        }));
      };

      mk.onDataChange(sourceId, handlers[sourceId]);
    });

    return () => {
      dataSources.forEach(sourceId => {
        mk.offDataChange(sourceId, handlers[sourceId]);
      });
    };
  }, [dataSources]);

  return dataMap;
}

// 使用示例
const DashboardComponent: React.FC = () => {
  const data = useMultiDataPolling([
    'user-stats',
    'order-stats',
    'system-stats'
  ]);

  return (
    <div>
      <div>用户数: {data['user-stats']?.count || 0}</div>
      <div>订单数: {data['order-stats']?.count || 0}</div>
      <div>系统状态: {data['system-stats']?.status || '未知'}</div>
    </div>
  );
};
```

---

## 完整封装示例

```typescript
// 数据轮询管理器
class DataPollingManager {
  private handlers: Map<string, Set<Function>> = new Map();

  /**
   * 注册数据源监听
   */
  subscribe<T>(
    dataSourceID: string,
    handler: (data: T) => void,
    portalId?: string
  ): () => void {
    // 存储 handler
    if (!this.handlers.has(dataSourceID)) {
      this.handlers.set(dataSourceID, new Set());
    }
    this.handlers.get(dataSourceID)!.add(handler);

    // 注册 MK 监听
    mk.onDataChange(dataSourceID, handler, portalId);

    // 返回取消订阅函数
    return () => {
      this.unsubscribe(dataSourceID, handler);
    };
  }

  /**
   * 取消数据源监听
   */
  unsubscribe(dataSourceID: string, handler: Function): void {
    mk.offDataChange(dataSourceID, handler);

    const handlers = this.handlers.get(dataSourceID);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(dataSourceID);
      }
    }
  }

  /**
   * 取消指定数据源的所有监听
   */
  unsubscribeAll(dataSourceID: string): void {
    const handlers = this.handlers.get(dataSourceID);
    if (handlers) {
      handlers.forEach(handler => {
        mk.offDataChange(dataSourceID, handler);
      });
      this.handlers.delete(dataSourceID);
    }
  }

  /**
   * 获取监听状态
   */
  getStatus(): Record<string, number> {
    const status: Record<string, number> = {};
    this.handlers.forEach((handlers, dataSourceID) => {
      status[dataSourceID] = handlers.size;
    });
    return status;
  }
}

// 单例实例
export const dataPollingManager = new DataPollingManager();

// React Hook 封装
export function useDataPolling<T>(
  dataSourceID: string,
  options?: {
    initialValue?: T;
    portalId?: string;
    onError?: (error: Error) => void;
  }
): {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const [data, setData] = useState<T | undefined>(options?.initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDataChange = useCallback((newData: T) => {
    try {
      setData(newData);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
    }
  }, [options]);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = dataPollingManager.subscribe(
      dataSourceID,
      handleDataChange,
      options?.portalId
    );

    setIsLoading(false);

    return () => {
      unsubscribe();
    };
  }, [dataSourceID, options?.portalId, handleDataChange]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    mk.emit('DATA_REFRESH', { dataSourceID });
    setIsLoading(false);
  }, [dataSourceID]);

  return { data, isLoading, error, refresh };
}

// 使用示例
const RealtimeDataComponent: React.FC = () => {
  const { data, isLoading, error, refresh } = useDataPolling('realtime-metrics', {
    initialValue: { count: 0, items: [] },
    onError: (err) => {
      message.error('数据加载失败: ' + err.message);
    }
  });

  if (isLoading) return <Spin tip="加载中..." />;
  if (error) return <Alert message="错误" description={error.message} type="error" />;

  return (
    <div>
      <div>总数: {data?.count}</div>
      <Button onClick={refresh}>刷新</Button>
    </div>
  );
};
```

---

## 最佳实践

### 1. 错误处理

```typescript
const safeDataPolling = <T,>(
  dataSourceID: string,
  handler: (data: T) => void,
  errorHandler?: (error: Error) => void
) => {
  const wrappedHandler = (data: T) => {
    try {
      handler(data);
    } catch (error) {
      errorHandler?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  mk.onDataChange(dataSourceID, wrappedHandler);

  return () => {
    mk.offDataChange(dataSourceID, wrappedHandler);
  };
};
```

### 2. 防抖处理

```typescript
import { debounce } from 'lodash';

const debouncedDataPolling = <T,>(
  dataSourceID: string,
  handler: (data: T) => void,
  wait: number = 300
) => {
  const debouncedHandler = debounce(handler, wait);

  mk.onDataChange(dataSourceID, debouncedHandler);

  return () => {
    mk.offDataChange(dataSourceID, debouncedHandler);
    debouncedHandler.cancel();
  };
};
```

### 3. 数据转换

```typescript
const useTransformedData = <T, R>(
  dataSourceID: string,
  transformer: (data: T) => R,
  initialValue: R
): R => {
  const [transformedData, setTransformedData] = useState<R>(initialValue);

  useEffect(() => {
    const handler = (rawData: T) => {
      const transformed = transformer(rawData);
      setTransformedData(transformed);
    };

    mk.onDataChange(dataSourceID, handler);

    return () => {
      mk.offDataChange(dataSourceID, handler);
    };
  }, [dataSourceID, transformer]);

  return transformedData;
};

// 使用
const processedData = useTransformedData(
  'raw-user-data',
  (users) => users.filter(u => u.isActive).map(u => ({ ...u, displayName: u.name })),
  []
);
```
