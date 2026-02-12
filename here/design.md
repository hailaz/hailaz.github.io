# 物业出租管理 - 微信小程序设计方案

## 一、产品概述

### 1.1 项目简介

物业出租管理小程序，为个人房东和物业公司/二房东提供一站式出租管理工具。涵盖房产管理、租户管理、费用结算、数据统计、操作流水等核心功能。基于微信小程序云开发（云函数 + 云数据库）构建。

### 1.2 目标用户

| 角色 | 说明 | 核心场景 |
|------|------|----------|
| 出租方 | 个人房东或物业公司/二房东 | 管理房产、录入费用、生成账单、查看统计 |
| 代管理员 | 由出租方邀请，权限可自定义 | 按授权范围执行管理操作 |
| 租户 | 通过分享链接绑定 | 查看自己的账单明细 |

### 1.3 核心功能清单

- 房产管理（楼栋 > 楼层 > 单元 > 套房）
- 租户管理（分享绑定、入住/退租）
- 费用管理（押金、租金、物业费、水电费等）
- 账单结算（生成账单、结算海报分享）
- 数据统计（收入趋势、空置率、费用分类）
- 代管理员权限配置（邀请、勾选授权、撤销）
- 操作流水（全操作记录、按人/类型筛选）

---

## 二、角色与权限矩阵

### 2.1 权限项定义

| 权限代码 | 权限名称 | 说明 |
|----------|----------|------|
| PROPERTY_VIEW | 查看房产 | 查看楼栋、楼层、房间列表及详情 |
| PROPERTY_EDIT | 管理房产 | 新增、编辑、删除房产信息 |
| TENANT_VIEW | 查看租户 | 查看租户列表和租约信息 |
| TENANT_EDIT | 管理租户 | 绑定/解绑租户、编辑租约 |
| FEE_VIEW | 查看费用 | 查看费用配置和账单 |
| FEE_EDIT | 管理费用 | 录入费用、配置计费规则 |
| BILL_VIEW | 查看账单 | 查看账单列表 |
| BILL_EDIT | 管理账单 | 生成账单、结算、分享海报 |
| STATS_VIEW | 查看统计 | 查看统计数据和图表 |
| LOG_VIEW | 查看流水 | 查看操作流水记录 |
| MANAGER_EDIT | 管理员管理 | 邀请/编辑/删除代管理员 |

### 2.2 角色权限矩阵

| 功能 | 出租方 | 代管理员 | 租户 |
|------|--------|----------|------|
| 查看房产 | ✅ | ⬜ 可授权 | ❌ |
| 管理房产 | ✅ | ⬜ 可授权 | ❌ |
| 查看租户 | ✅ | ⬜ 可授权 | ❌ |
| 管理租户 | ✅ | ⬜ 可授权 | ❌ |
| 查看费用 | ✅ | ⬜ 可授权 | ❌ |
| 管理费用 | ✅ | ⬜ 可授权 | ❌ |
| 查看账单 | ✅ | ⬜ 可授权 | ✅ 仅自己 |
| 管理账单 | ✅ | ⬜ 可授权 | ❌ |
| 查看统计 | ✅ | ⬜ 可授权 | ❌ |
| 查看流水 | ✅ | ⬜ 可授权 | ❌ |
| 管理员管理 | ✅ | ❌ | ❌ |

> ⬜ 可授权：由出租方在权限配置页勾选决定是否授予

---

## 三、页面结构与功能说明

### 3.1 页面总览

```
小程序
├── 登录/角色识别页
├── 出租方端
│   ├── 首页（房产概览 + 快捷操作）
│   ├── 房产管理
│   │   ├── 楼栋列表
│   │   ├── 楼层/单元列表
│   │   ├── 房间列表
│   │   ├── 房间详情
│   │   └── 新增/编辑房产表单
│   ├── 账单管理
│   │   ├── 账单列表（按月份）
│   │   ├── 结算详情页
│   │   ├── 海报预览/分享
│   │   └── 费用配置
│   ├── 统计
│   │   ├── 收入趋势
│   │   ├── 空置率
│   │   └── 费用分类
│   ├── 我的
│   │   ├── 代管理员管理
│   │   │   ├── 管理员列表
│   │   │   ├── 邀请管理员
│   │   │   └── 权限配置
│   │   ├── 操作流水
│   │   └── 个人设置
│   └── TabBar: 首页 | 房产 | 账单 | 统计 | 我的
├── 代管理员端
│   ├── 首页（受限房产概览）
│   ├── 按权限展示功能模块
│   ├── 操作流水（按权限）
│   └── TabBar: 按权限动态显示
└── 租户端
    ├── 我的账单
    │   ├── 账单列表
    │   └── 账单明细
    ├── 我的房间
    └── TabBar: 账单 | 我的
```

### 3.2 出租方端页面详细说明

#### 3.2.1 首页（房产概览）

**页面元素：**
- 顶部欢迎区：用户头像、名称、角色标签（个人房东/物业公司）
- 数据概览卡片（四宫格）：
  - 总房间数（蓝色）
  - 已出租（绿色）
  - 空置数（灰色）
  - 本月收入（橙色）
- 快捷操作按钮组：添加房产、录入费用、生成账单、邀请租户
- 待处理事项列表：待结算账单、即将到期租约等

**交互：**
- 点击数据卡片跳转对应详情
- 点击快捷操作按钮跳转对应功能页
- 点击待处理事项进入详情

#### 3.2.2 房产管理

**楼栋列表页：**
- 搜索栏：按名称搜索楼栋/房间
- 楼栋卡片列表：名称、地址、总房间数、已租数、出租率进度条
- 右下角浮动按钮：+ 添加楼栋

**楼层/房间列表页：**
- 面包屑导航：楼栋名 > 楼层
- 房间网格卡片：房间号、房型、状态色标
  - 绿色：已租
  - 灰色：空置
  - 橙色：即将到期
- 点击房间进入详情

**房间详情页：**
- 房间基本信息：房号、房型、面积、月租
- 当前租户信息（如已租）：姓名、电话、入住日期、租约到期日
- 费用配置：当前房间的费用项列表
- 历史账单列表
- 操作按钮：编辑房间、录入费用、生成账单

**新增/编辑表单：**
- 所属楼栋/楼层/单元选择
- 房间号输入
- 房型选择：单间、一房一厅、两房一厅、三房一厅、四房一厅、五房一厅
- 出租方式：整租/合租
- 面积输入
- 月租金输入
- 费用项配置

#### 3.2.3 账单管理

**账单列表页：**
- 月份横向滚动选择器
- 账单卡片列表：
  - 房间号 + 租户名
  - 费用摘要（租金 ¥X + 水电 ¥X + ...）
  - 合计金额
  - 状态标签：待结算（黄色）、已结算（绿色）
- 右上角：+ 批量生成账单

**结算详情页：**
- 账单头部：房间信息、租户信息、账单周期
- 费用明细表格：

| 费用项 | 单价/标准 | 用量 | 金额 |
|--------|-----------|------|------|
| 租金   | ¥1500/月  | 1月  | ¥1500 |
| 电费   | ¥1.2/度   | 150度 | ¥180 |
| 水费   | ¥4.5/吨   | 8吨  | ¥36 |
| 物业费 | ¥200/月   | 1月  | ¥200 |
| 垃圾费 | ¥30/月    | 1月  | ¥30 |
| 网费   | ¥100/月   | 1月  | ¥100 |

- 合计金额（大字突出）
- 操作按钮：标记已结算、生成海报分享

**海报预览：**
- 模拟生成结算海报卡片
- 包含：房间信息、费用明细、合计金额、二维码
- 底部：分享到微信聊天、保存到相册

**费用配置页：**
- 费用项列表：
  - 押金：一次性
  - 租金：按月/按季/按年
  - 物业费：按月
  - 电费：按度数
  - 水费：按吨数
  - 垃圾费：按月
  - 网费：按月
- 每项可设置单价、计费周期、是否启用

#### 3.2.4 统计

**统计看板页：**
- 时间筛选：月/季/年切换
- 核心指标卡片行：总收入、已收、待收、空置率
- 收入趋势折线图：近6个月/近4季/近3年的收入变化
- 房间状态饼图：已租/空置/维修占比
- 费用分类柱状图：各费用项收入占比

#### 3.2.5 我的（管理中心）

**管理中心页：**
- 个人信息卡片：头像、名称、角色
- 功能列表：
  - 代管理员管理 →
  - 操作流水 →
  - 个人设置 →
  - 关于 →

**代管理员管理页：**
- 管理员列表：头像、昵称、权限标签（如"房产+费用"）
- 点击管理员进入权限编辑
- 底部按钮：+ 邀请代管理员（生成邀请链接/二维码）

**权限配置弹窗：**
- 管理员信息：头像、昵称
- 权限勾选列表：
  - ☑ 查看房产
  - ☑ 管理房产
  - ☐ 查看租户
  - ☐ 管理租户
  - ☑ 查看费用
  - ☑ 管理费用
  - ☐ 查看账单
  - ☐ 管理账单
  - ☐ 查看统计
  - ☐ 查看流水
- 操作按钮：保存、移除管理员

**操作流水页：**
- 顶部筛选栏：
  - 操作人下拉选择（全部/出租方/管理员A/管理员B）
  - 操作类型下拉选择（全部/房产管理/费用管理/租户管理/权限管理/账单管理）
- 流水时间线列表：
  - 时间标签
  - 操作人头像 + 名称
  - 操作描述（如"添加了楼栋「幸福小区1号楼」"）
  - 操作类型标签（不同颜色）

### 3.3 代管理员端

与出租方端共用页面结构，但根据被授予的权限：
- TabBar 动态显示/隐藏标签页
- 未授权的功能模块显示"暂无权限"提示
- 操作流水仅展示自己有权限查看的记录

### 3.4 租户端

**我的账单页：**
- 房间信息卡片：楼栋名、房间号、房型、入住日期
- 账单列表（按月份分组）：
  - 账单周期
  - 费用合计
  - 状态标签：待确认/已结算
- 点击展开账单明细：
  - 各费用项的单价、用量、小计
  - 合计金额

**我的页：**
- 个人信息
- 当前租约信息
- 联系出租方

---

## 四、数据模型设计

### 4.1 云数据库集合设计

#### users（用户表）

```json
{
  "_id": "自动生成",
  "openid": "微信openid",
  "name": "用户名称",
  "phone": "手机号",
  "avatar": "头像URL",
  "role": "landlord | manager | tenant",
  "landlordId": "关联的出租方ID（代管理员和租户使用）",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

**索引：** openid（唯一）、landlordId、role

#### buildings（楼栋表）

```json
{
  "_id": "自动生成",
  "landlordId": "出租方ID",
  "name": "楼栋名称",
  "address": "地址",
  "floorCount": "楼层数",
  "description": "备注说明",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

**索引：** landlordId

#### floors（楼层表）

```json
{
  "_id": "自动生成",
  "buildingId": "楼栋ID",
  "landlordId": "出租方ID",
  "floorNumber": "楼层号",
  "unitCount": "单元数",
  "createdAt": "创建时间"
}
```

**索引：** buildingId、landlordId

#### units（单元表）

```json
{
  "_id": "自动生成",
  "floorId": "楼层ID",
  "buildingId": "楼栋ID",
  "landlordId": "出租方ID",
  "unitNumber": "单元号",
  "createdAt": "创建时间"
}
```

**索引：** floorId、buildingId、landlordId

#### rooms（房间表）

```json
{
  "_id": "自动生成",
  "unitId": "单元ID",
  "floorId": "楼层ID",
  "buildingId": "楼栋ID",
  "landlordId": "出租方ID",
  "roomNumber": "房间号",
  "type": "单间 | 一房一厅 | 两房一厅 | 三房一厅 | 四房一厅 | 五房一厅",
  "rentMode": "整租 | 合租",
  "area": "面积（平方米）",
  "monthlyRent": "月租金",
  "status": "vacant | rented | expiring | maintenance",
  "feeConfig": [
    {
      "feeType": "rent | deposit | property | electricity | water | garbage | internet",
      "unitPrice": "单价",
      "cycle": "monthly | quarterly | yearly",
      "enabled": true
    }
  ],
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

**索引：** landlordId、buildingId、status、unitId

#### tenants（租约/租户绑定表）

```json
{
  "_id": "自动生成",
  "roomId": "房间ID",
  "buildingId": "楼栋ID",
  "landlordId": "出租方ID",
  "tenantUserId": "租户用户ID",
  "tenantName": "租户姓名",
  "tenantPhone": "租户手机",
  "startDate": "入住日期",
  "endDate": "租约到期日",
  "deposit": "押金金额",
  "billingCycle": "monthly | quarterly | yearly",
  "status": "active | expired | terminated",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

**索引：** roomId、landlordId、tenantUserId、status

#### bills（账单表）

```json
{
  "_id": "自动生成",
  "tenantId": "租约ID",
  "roomId": "房间ID",
  "buildingId": "楼栋ID",
  "landlordId": "出租方ID",
  "period": "账单周期（如 2026-01）",
  "items": [
    {
      "feeType": "rent",
      "feeName": "租金",
      "unitPrice": 1500,
      "usage": 1,
      "unit": "月",
      "amount": 1500
    },
    {
      "feeType": "electricity",
      "feeName": "电费",
      "unitPrice": 1.2,
      "usage": 150,
      "unit": "度",
      "amount": 180
    }
  ],
  "totalAmount": "合计金额",
  "status": "pending | settled",
  "settledAt": "结算时间",
  "operatorId": "操作人ID",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

**索引：** landlordId、roomId、tenantId、period、status

#### managers（代管理员表）

```json
{
  "_id": "自动生成",
  "landlordId": "出租方ID",
  "userId": "代管理员用户ID",
  "name": "管理员名称",
  "avatar": "头像",
  "permissions": [
    "PROPERTY_VIEW",
    "PROPERTY_EDIT",
    "FEE_VIEW",
    "FEE_EDIT"
  ],
  "inviteCode": "邀请码",
  "status": "active | disabled",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

**索引：** landlordId、userId、inviteCode

#### operation_logs（操作流水表）

```json
{
  "_id": "自动生成",
  "landlordId": "出租方ID",
  "operatorId": "操作人用户ID",
  "operatorName": "操作人名称",
  "operatorRole": "landlord | manager",
  "operationType": "property | tenant | fee | bill | manager | system",
  "action": "create | update | delete | share | settle",
  "targetType": "building | room | tenant | bill | manager",
  "targetId": "操作对象ID",
  "detail": "添加了楼栋「幸福小区1号楼」",
  "createdAt": "操作时间"
}
```

**索引：** landlordId、operatorId、operationType、createdAt

---

## 五、云开发技术架构

### 5.1 架构总览

```
┌─────────────────────────────────────────────────────┐
│                   微信小程序前端                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ 首页 │ │ 房产 │ │ 账单 │ │ 统计 │ │ 我的 │      │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘      │
│     └────────┴────────┴────────┴────────┘           │
│                       │                              │
│              wx.cloud.callFunction()                 │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│                  云开发环境                            │
│                                                      │
│  ┌─────────────── 云函数层 ───────────────────┐      │
│  │                                            │      │
│  │  user-service     building-service          │      │
│  │  tenant-service   bill-service              │      │
│  │  fee-service      stats-service             │      │
│  │  manager-service  log-service               │      │
│  │                                            │      │
│  └────────────────────┬───────────────────────┘      │
│                       │                              │
│  ┌──── 云数据库 ──────┴──── 云存储 ────────┐        │
│  │                         │               │        │
│  │  users    buildings     │  海报图片      │        │
│  │  floors   units         │  用户头像      │        │
│  │  rooms    tenants       │               │        │
│  │  bills    managers      │               │        │
│  │  operation_logs         │               │        │
│  │                         │               │        │
│  └─────────────────────────┴───────────────┘        │
└──────────────────────────────────────────────────────┘
```

### 5.2 云函数列表与接口定义

#### 5.2.1 user-service（用户服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| login | POST | 登录/注册 | `{}` (自动获取openid) | `{ user, token, isNew }` |
| getProfile | GET | 获取用户信息 | `{}` | `{ user }` |
| updateProfile | POST | 更新用户信息 | `{ name, phone, avatar }` | `{ success }` |

#### 5.2.2 building-service（房产服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| createBuilding | POST | 新增楼栋 | `{ name, address, floorCount }` | `{ building }` |
| updateBuilding | POST | 编辑楼栋 | `{ id, name, address, floorCount }` | `{ building }` |
| deleteBuilding | POST | 删除楼栋 | `{ id }` | `{ success }` |
| getBuildingList | GET | 楼栋列表 | `{ page, pageSize }` | `{ list, total }` |
| getBuildingDetail | GET | 楼栋详情 | `{ id }` | `{ building, floors, rooms }` |
| createFloor | POST | 新增楼层 | `{ buildingId, floorNumber, unitCount }` | `{ floor }` |
| createUnit | POST | 新增单元 | `{ floorId, buildingId, unitNumber }` | `{ unit }` |
| createRoom | POST | 新增房间 | `{ unitId, floorId, buildingId, roomNumber, type, rentMode, area, monthlyRent, feeConfig }` | `{ room }` |
| updateRoom | POST | 编辑房间 | `{ id, ...fields }` | `{ room }` |
| deleteRoom | POST | 删除房间 | `{ id }` | `{ success }` |
| getRoomDetail | GET | 房间详情 | `{ id }` | `{ room, tenant, bills }` |
| getRoomList | GET | 房间列表 | `{ buildingId, floorId, status, page, pageSize }` | `{ list, total }` |

#### 5.2.3 tenant-service（租户服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| generateBindLink | POST | 生成绑定链接 | `{ roomId }` | `{ shareLink, shareCode }` |
| bindTenant | POST | 租户绑定 | `{ shareCode, name, phone, startDate, endDate, deposit, billingCycle }` | `{ tenant }` |
| unbindTenant | POST | 租户解绑 | `{ tenantId }` | `{ success }` |
| getTenantList | GET | 租户列表 | `{ buildingId, status, page, pageSize }` | `{ list, total }` |
| getTenantDetail | GET | 租户详情 | `{ id }` | `{ tenant, room, bills }` |
| getMyRoom | GET | 租户查看自己的房间 | `{}` | `{ room, building, tenant }` |

#### 5.2.4 fee-service（费用服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| updateFeeConfig | POST | 更新房间费用配置 | `{ roomId, feeConfig[] }` | `{ success }` |
| getFeeConfig | GET | 获取费用配置 | `{ roomId }` | `{ feeConfig[] }` |
| recordUsage | POST | 录入水电用量 | `{ roomId, feeType, currentReading, period }` | `{ usage, amount }` |

#### 5.2.5 bill-service（账单服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| generateBill | POST | 生成账单 | `{ roomId, period, items[] }` | `{ bill }` |
| batchGenerateBills | POST | 批量生成账单 | `{ buildingId, period }` | `{ bills[], count }` |
| settleBill | POST | 结算账单 | `{ billId }` | `{ bill }` |
| getBillList | GET | 账单列表 | `{ roomId, buildingId, period, status, page, pageSize }` | `{ list, total }` |
| getBillDetail | GET | 账单详情 | `{ id }` | `{ bill, room, tenant }` |
| getMyBills | GET | 租户查看自己的账单 | `{ page, pageSize }` | `{ list, total }` |
| generatePoster | POST | 生成结算海报 | `{ billId }` | `{ posterUrl }` |

#### 5.2.6 manager-service（代管理员服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| generateInvite | POST | 生成邀请码 | `{ permissions[] }` | `{ inviteCode, inviteLink }` |
| acceptInvite | POST | 接受邀请 | `{ inviteCode }` | `{ manager }` |
| updatePermissions | POST | 更新权限 | `{ managerId, permissions[] }` | `{ manager }` |
| removeManager | POST | 移除管理员 | `{ managerId }` | `{ success }` |
| getManagerList | GET | 管理员列表 | `{}` | `{ list }` |
| getMyPermissions | GET | 获取自己的权限 | `{}` | `{ permissions[] }` |

#### 5.2.7 stats-service（统计服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| getOverview | GET | 首页概览数据 | `{}` | `{ totalRooms, rented, vacant, monthlyIncome }` |
| getIncomeTrend | GET | 收入趋势 | `{ type: month/quarter/year, range }` | `{ data[] }` |
| getRoomStats | GET | 房间状态统计 | `{}` | `{ rented, vacant, expiring, maintenance }` |
| getFeeBreakdown | GET | 费用分类统计 | `{ period }` | `{ breakdown[] }` |
| getOccupancyRate | GET | 出租率 | `{ buildingId? }` | `{ rate, detail[] }` |

#### 5.2.8 log-service（操作流水服务）

| 接口 | 方法 | 说明 | 入参 | 出参 |
|------|------|------|------|------|
| addLog | POST | 记录操作（内部调用） | `{ operationType, action, targetType, targetId, detail }` | `{ log }` |
| getLogList | GET | 查询流水 | `{ operatorId?, operationType?, startDate?, endDate?, page, pageSize }` | `{ list, total }` |

### 5.3 云函数调用关系

```
┌─────────────────────────────────────────────────┐
│                    前端调用层                      │
│                                                  │
│  wx.cloud.callFunction({ name: 'xxx-service',   │
│    data: { action: 'methodName', ...params }})   │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
   ┌───────────┐ ┌───────────┐ ┌───────────┐
   │ building  │ │  bill     │ │ manager   │
   │ -service  │ │ -service  │ │ -service  │
   └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
         │             │             │
         │    ┌────────┤             │
         │    │        │             │
         ▼    ▼        ▼             ▼
   ┌───────────────────────────────────────┐
   │          log-service (内部调用)         │
   │    所有写操作完成后自动记录操作流水       │
   └───────────────────┬───────────────────┘
                       │
                       ▼
               ┌──────────────┐
               │  云数据库      │
               │  operation_   │
               │  logs 集合    │
               └──────────────┘
```

**关键调用关系：**

1. **所有写操作 → log-service**：building-service、tenant-service、bill-service、fee-service、manager-service 中的创建/更新/删除操作完成后，均调用 log-service.addLog 记录操作流水。

2. **bill-service → fee-service**：生成账单时需要读取房间的费用配置。

3. **bill-service → tenant-service**：生成账单时需要关联租户信息。

4. **stats-service → bills + rooms**：统计服务从账单和房间集合聚合数据。

5. **manager-service → user-service**：邀请管理员时关联用户身份。

### 5.4 权限校验流程

```
前端请求 → 云函数入口
  │
  ├─ 1. 从 cloud.getWXContext() 获取 openid
  │
  ├─ 2. 查询 users 集合获取角色
  │
  ├─ 3. 角色判断：
  │     ├─ landlord → 拥有全部权限，直接放行
  │     ├─ manager → 查询 managers 集合获取 permissions[]
  │     │            检查当前操作是否在权限列表中
  │     │            ├─ 有权限 → 放行
  │     │            └─ 无权限 → 返回 403
  │     └─ tenant → 仅允许访问自己的账单数据
  │
  └─ 4. 执行业务逻辑 → 记录操作流水
```

---

## 六、业务流程

### 6.1 出租方注册房产流程

```
出租方登录 → 创建楼栋 → 设置楼层 → 设置单元 → 添加房间
  → 配置房间费用项 → 发布房源
```

### 6.2 租户绑定流程

```
出租方选择房间 → 生成分享链接 → 发送给租户
  → 租户打开小程序 → 输入个人信息 → 确认绑定
  → 出租方审核通过 → 绑定成功
```

### 6.3 账单结算流程

```
出租方录入水电用量 → 系统计算费用
  → 生成账单（单间或批量）→ 确认费用明细
  → 生成结算海报 → 分享给租户
  → 租户查看账单 → 线下缴费
  → 出租方标记已结算
```

### 6.4 代管理员邀请流程

```
出租方进入管理员管理 → 勾选授予权限 → 生成邀请码/链接
  → 发送给代管理员 → 代管理员打开小程序
  → 输入邀请码 → 绑定成功 → 按权限使用功能
```
