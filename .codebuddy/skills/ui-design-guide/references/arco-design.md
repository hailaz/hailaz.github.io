# Arco Design 速查（v2 占位）

> ⚠️ **首版未完整实现**。本文件仅作占位骨架。

## v2 计划补全

- [ ] Arco Design `ConfigProvider` 主题定制与 Skill tokens 的完整映射
- [ ] 暗黑模式：`<body arco-theme="dark">` 与 Skill `[data-theme="dark"]` 协调
- [ ] Arco less 变量速查与 Skill token 命名的对照
- [ ] React 与 Vue 双版本接入示例
- [ ] 与 brand-kit 的图标风格联动

## 临时桥接示例

```less
// arco.theme.less
@arcoblue-6: var(--color-primary-500);
@success-6:  var(--color-success-500);
@warning-6:  var(--color-warning-500);
@danger-6:   var(--color-danger-500);
@border-radius-medium: var(--radius-md);
```

```tsx
import { ConfigProvider } from '@arco-design/web-react';

<ConfigProvider
  theme={{
    primaryColor: tokens.color.primary[500],
  }}
>
  <App />
</ConfigProvider>
```

## 升级路径

待 v2 完成后迁移到标准模板。
