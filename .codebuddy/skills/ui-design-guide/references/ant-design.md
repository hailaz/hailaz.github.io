# Ant Design 速查（v2 占位）

> ⚠️ **首版未完整实现**。本文件仅作占位骨架。

## v2 计划补全

- [ ] AntD `ConfigProvider.theme` 与 Skill tokens 的完整映射（colorPrimary、borderRadius、fontSize 等）
- [ ] 暗黑模式：`theme.darkAlgorithm` 与 Skill `modeOverrides` 协调
- [ ] AntD 5.x `theme.token` 完整对照表
- [ ] 常用组件 props 配合 token 的范式（Button.type、Form.layout、Table.size 等）
- [ ] 国际化：`ConfigProvider.locale` + `brand-kit.tone` 文案口吻

## 临时桥接示例

```tsx
import { ConfigProvider, theme } from 'antd';

const tokens = await fetch('/design-tokens.json').then(r => r.json());

<ConfigProvider
  theme={{
    algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: tokens.color.primary[500],
      colorSuccess: tokens.color.semantic.success[500],
      colorWarning: tokens.color.semantic.warning[500],
      colorError:   tokens.color.semantic.danger[500],
      colorInfo:    tokens.color.semantic.info[500],
      borderRadius: tokens.radius.md,
      fontFamily:   tokens.typography.fontFamily.sans,
      fontSize:     tokens.typography.fontSize.base,
    },
  }}
>
  <App />
</ConfigProvider>
```

## 升级路径

待 v2 完成后迁移到标准模板。
