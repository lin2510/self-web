---
sidebar_position: 2
---

# 时间处理与多语言

## 获取多语言时间（getFormatTime）

### 基本用法

```typescript
// mk.getFormatTime(timeStamp | number | string | Date, format = 'YYYY/MM/DD HH:mm:ss wwww', locale? | I18n.ELangs)
mk.getFormatTime(Date.now(), 'LLLLLLLLL');
// zh-cn 下输出: 2020/01/08 20:20
```

### 参数说明

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| timeStamp | 时间戳 | `number/string/Date` | `new Date()` | 否 |
| format | 时间格式 | `string` | `YYYY/MM/DD HH:mm:ss wwww` | 否 |
| locale | 语言信息 | `string/I18n.ELangs` | `getUserConfig('locale')` | 否 |

### 中文格式（zh-cn）

| 格式 | 对应 | 输出示例 |
|------|------|----------|
| L | YYYY年 | 2019年 |
| l | YYYY | 2019 |
| LL | MMMM | 五月 |
| ll | MMM | 5月 |
| LLL | DD日 | 06日 |
| lll | DD | 16 |
| LLLL | YYYY年MM月 | 2019年05月 |
| llll | YYYYMM | 201905 |
| LLLLL | YYYY年MM月DD日 | 2019年05月16日 |
| lllll | YYYY年M月D日 | 2019年5月16日 |
| LLLLLL | YYYY/MM/DD | 2019/05/16 |
| llllll | YYYY/M/D | 2019/5/16 |
| LLLLLLL | YYYY-MM-DD | 2019-05-16 |
| lllllll | YYYY-M-D | 2019-5-16 |
| LLLLLLLL | YYYYMMDD | 20190516 |
| llllllll | YYYYMD | 2019516 |
| LLLLLLLLL | YYYY/MM/DD HH:mm | 2019/05/16 09:10:48 |
| LLLLLLLLLL | YYYY-MM-DD HH:mm | 2019-05-16 09:10 |
| x | HH:mm | 18:18 |
| xx | MM月 | 06月 |
| xxx | YYYY / | 2020 / |
| X | MM | 01 |
| XX | MM.DD.YYYY | 01.01.2020 |
| XXXX | MM-DD HH:mm | 05-01 09:06 |
| xxxx | M-D H:m | 5-1 9:6 |

### 英文格式（en-us）

| 格式 | 对应 | 输出示例 |
|------|------|----------|
| L | YYYY | 2019 |
| l | YYYY | 2019 |
| LL | MMMM | January |
| ll | MMM | Jan |
| LLL | DD | 01 |
| lll | DD | 01 |
| LLLL | MMYYYY | 052019 |
| llll | MMYYYY | 052019 |
| LLLLL | MMDDYYYY | 05162019 |
| lllll | MDYYY | 5162019 |
| LLLLLL | MM/DD/YYYY | 05/16/2019 |
| llllll | M/D/YYYY | 5/16/2019 |
| LLLLLLL | MM-DD-YYYY | 05-16-2019 |
| lllllll | M-D-YYYY | 5-16-2019 |
| LLLLLLLL | MMDDYYYY | 05162019 |
| llllllll | MDYYYY | 5162019 |
| LLLLLLLLL | MM/DD/YYYY HH:mm | 05/16/2019 09:10:48 |
| LLLLLLLLLL | MM-DD-YYYY HH:mm | 05-16-2019 09:10 |
| x | HH:mm | 18:18 |
| xx | MMM | Jun |
| xxx | YYYY / | 2020 / |
| X | MM | 01 |
| XX | MM.DD.YYYY | 01.01.2020 |
| XXXX | MM-DD HH:mm | 05-01 09:06 |
| xxxx | M-D H:m | 5-1 9:6 |

### 使用示例

```typescript
// 获取当前日期（中文格式）
const currentDate = mk.getFormatTime(Date.now(), 'LLLLLL');
// 输出: 2024/01/15

// 获取完整日期时间
const fullDateTime = mk.getFormatTime(Date.now(), 'LLLLLLLLL');
// 输出: 2024/01/15 14:30:25

// 指定英文格式
const enDate = mk.getFormatTime(Date.now(), 'LLLLLL', 'en-us');
// 输出: 01/15/2024
```

---

## 组件获取多语言信息（getI18nMessage）

### 基本用法

```typescript
// mk.getI18nMessage(langs: I18n.ICmptLang | string, key?: string)

const langs: I18n.ICmptLang = {
  'zh-cn': {
    okText: '去登录',
    content: '登录已过期，请重新登录'
  },
  'en-us': {
    okText: 'Go to login',
    content: 'Login has expired, please log in again'
  }
};

mk.getI18nMessage(langs, 'content');
// zh-cn 下输出: 登录已过期，请重新登录
```

### 参数说明

| 参数 | 说明 | 类型 | 默认值 | 是否必传 |
|------|------|------|--------|----------|
| langs | 多语言配置 | `I18n.ICmptLang/string` | - | 是 |
| key | 相关多语言的 key | `string` | - | 否 |

### 实际应用场景

```typescript
// 在组件中使用
const modalConfig = {
  'zh-cn': {
    title: '确认删除',
    content: '删除后无法恢复，是否继续？',
    okText: '确认',
    cancelText: '取消'
  },
  'en-us': {
    title: 'Confirm Delete',
    content: 'This action cannot be undone. Continue?',
    okText: 'Confirm',
    cancelText: 'Cancel'
  }
};

// 获取当前语言的标题
const title = mk.getI18nMessage(modalConfig, 'title');

// 在 Ant Design Modal 中使用
Modal.confirm({
  title: mk.getI18nMessage(modalConfig, 'title'),
  content: mk.getI18nMessage(modalConfig, 'content'),
  okText: mk.getI18nMessage(modalConfig, 'okText'),
  cancelText: mk.getI18nMessage(modalConfig, 'cancelText'),
});
```

### 最佳实践

1. **统一配置**：将多语言配置抽取到独立的配置文件中
2. **类型定义**：为多语言配置定义 TypeScript 接口，确保类型安全
3. **默认值**：提供默认语言配置，防止语言切换时的闪烁

```typescript
// 推荐：类型定义
interface IModalLang {
  title: string;
  content: string;
  okText: string;
  cancelText: string;
}

// 推荐：配置抽取
export const modalLangs: Record<string, IModalLang> = {
  'zh-cn': { /* ... */ },
  'en-us': { /* ... */ }
};
```
