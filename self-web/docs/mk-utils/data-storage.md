---
sidebar_position: 7
---

# 数据存储

MK 工具库提供了基于用户 ID 的数据存储功能，可以安全地存储和获取用户相关的数据。

## 获取数据（get）

### 基本用法

```typescript
// 返回存储的数据
const data = mk.userStore.get('mydata');
```

### 使用场景

```typescript
// 获取用户偏好设置
const getUserPreferences = () => {
  const preferences = mk.userStore.get('userPreferences') || {
    theme: 'default',
    sidebarCollapsed: false,
    notificationsEnabled: true
  };
  return preferences;
};

// 获取最近访问记录
const getRecentVisits = () => {
  return mk.userStore.get('recentVisits') || [];
};
```

---

## 存储数据（set）

### 基本用法

```typescript
mk.userStore.set({
  key: 'mydata',    // 存储数据的 key
  value: 'xxxxxxxxx' // 存储数据的值
});
```

### 使用场景

```typescript
// 保存用户偏好设置
const saveUserPreferences = (preferences: UserPreferences) => {
  mk.userStore.set({
    key: 'userPreferences',
    value: preferences
  });
};

// 保存表单草稿
const saveFormDraft = (formId: string, draftData: any) => {
  mk.userStore.set({
    key: `formDraft:${formId}`,
    value: {
      data: draftData,
      savedAt: Date.now()
    }
  });
};

// 记录最近访问
const addRecentVisit = (pageInfo: PageInfo) => {
  const recentVisits = mk.userStore.get('recentVisits') || [];
  const updatedVisits = [pageInfo, ...recentVisits].slice(0, 10); // 只保留最近10条

  mk.userStore.set({
    key: 'recentVisits',
    value: updatedVisits
  });
};
```

---

## 移除数据（remove）

### 基本用法

```typescript
// 移除单个数据
mk.userStore.remove('mydata');

// 移除一系列数据
mk.userStore.remove(['mydata', 'mydata1', 'mydata2']);

// 移除当前用户存储的所有数据
mk.userStore.remove();
```

### 使用场景

```typescript
// 清除表单草稿
const clearFormDraft = (formId: string) => {
  mk.userStore.remove(`formDraft:${formId}`);
};

// 清除所有草稿
const clearAllDrafts = () => {
  // 获取所有 key
  const allData = mk.userStore.get();
  const draftKeys = Object.keys(allData).filter(key =>
    key.startsWith('formDraft:')
  );
  mk.userStore.remove(draftKeys);
};

// 用户登出时清理数据
const handleLogout = () => {
  // 清除所有用户相关数据
  mk.userStore.remove();
};
```

---

## 完整封装示例

```typescript
// 用户存储工具类
class UserStorage {
  // 存储键名常量
  private static KEYS = {
    PREFERENCES: 'userPreferences',
    RECENT_VISITS: 'recentVisits',
    FORM_DRAFT_PREFIX: 'formDraft:',
    SEARCH_HISTORY: 'searchHistory',
    CUSTOM_SETTINGS: 'customSettings'
  };

  // 用户偏好设置
  static getPreferences(): UserPreferences {
    return mk.userStore.get(this.KEYS.PREFERENCES) || {
      theme: 'default',
      sidebarCollapsed: false,
      notificationsEnabled: true,
      language: 'zh-cn'
    };
  }

  static setPreferences(preferences: UserPreferences): void {
    mk.userStore.set({
      key: this.KEYS.PREFERENCES,
      value: preferences
    });
  }

  // 最近访问记录
  static getRecentVisits(): VisitRecord[] {
    return mk.userStore.get(this.KEYS.RECENT_VISITS) || [];
  }

  static addRecentVisit(record: VisitRecord): void {
    const visits = this.getRecentVisits();
    const filtered = visits.filter(v => v.id !== record.id); // 去重
    const updated = [record, ...filtered].slice(0, 20); // 保留最近20条

    mk.userStore.set({
      key: this.KEYS.RECENT_VISITS,
      value: updated
    });
  }

  static clearRecentVisits(): void {
    mk.userStore.remove(this.KEYS.RECENT_VISITS);
  }

  // 表单草稿
  static getFormDraft(formId: string): DraftData | null {
    return mk.userStore.get(`${this.KEYS.FORM_DRAFT_PREFIX}${formId}`);
  }

  static setFormDraft(formId: string, data: DraftData): void {
    mk.userStore.set({
      key: `${this.KEYS.FORM_DRAFT_PREFIX}${formId}`,
      value: {
        ...data,
        savedAt: Date.now()
      }
    });
  }

  static clearFormDraft(formId: string): void {
    mk.userStore.remove(`${this.KEYS.FORM_DRAFT_PREFIX}${formId}`);
  }

  // 搜索历史
  static getSearchHistory(): string[] {
    return mk.userStore.get(this.KEYS.SEARCH_HISTORY) || [];
  }

  static addSearchHistory(keyword: string): void {
    const history = this.getSearchHistory();
    const filtered = history.filter(k => k !== keyword); // 去重
    const updated = [keyword, ...filtered].slice(0, 10); // 保留最近10条

    mk.userStore.set({
      key: this.KEYS.SEARCH_HISTORY,
      value: updated
    });
  }

  static clearSearchHistory(): void {
    mk.userStore.remove(this.KEYS.SEARCH_HISTORY);
  }

  // 清除所有数据
  static clearAll(): void {
    mk.userStore.remove();
  }
}

// 类型定义
interface UserPreferences {
  theme: string;
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
  language: string;
}

interface VisitRecord {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

interface DraftData {
  [key: string]: any;
  savedAt?: number;
}

// 使用示例
const example = () => {
  // 保存用户偏好
  UserStorage.setPreferences({
    theme: 'dark',
    sidebarCollapsed: true,
    notificationsEnabled: false,
    language: 'zh-cn'
  });

  // 添加最近访问
  UserStorage.addRecentVisit({
    id: 'page-1',
    title: '系统设置',
    url: '/settings',
    timestamp: Date.now()
  });

  // 保存表单草稿
  UserStorage.setFormDraft('user-form', {
    name: '张三',
    email: 'zhangsan@example.com'
  });

  // 添加搜索历史
  UserStorage.addSearchHistory('用户管理');
};
```

---

## 最佳实践

### 1. 键名管理

```typescript
// 推荐：使用常量管理键名
const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  FORM_DRAFT: (formId: string) => `formDraft:${formId}`,
  CACHE_PREFIX: 'cache:'
} as const;
```

### 2. 数据验证

```typescript
// 存储前进行数据验证
const safeSetData = (key: string, value: any) => {
  try {
    // 验证数据大小（避免存储过大）
    const dataSize = JSON.stringify(value).length;
    if (dataSize > 1024 * 1024) { // 1MB 限制
      console.warn('数据过大，无法存储');
      return false;
    }

    mk.userStore.set({ key, value });
    return true;
  } catch (error) {
    console.error('存储失败:', error);
    return false;
  }
};
```

### 3. 数据过期处理

```typescript
// 带过期时间的数据存储
const setWithExpiry = (key: string, value: any, ttl: number) => {
  const item = {
    value,
    expiry: Date.now() + ttl
  };
  mk.userStore.set({ key, value: item });
};

const getWithExpiry = (key: string) => {
  const item = mk.userStore.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    mk.userStore.remove(key);
    return null;
  }

  return item.value;
};
```
