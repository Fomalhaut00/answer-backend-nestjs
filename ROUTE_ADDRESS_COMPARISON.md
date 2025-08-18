# 路由地址对比分析

## 🚨 发现的路由地址不一致问题

### Go项目 vs NestJS项目路由对比

| 功能 | Go项目路由 | 当前NestJS路由 | 状态 | 需要修正 |
|------|-----------|---------------|------|----------|
| **标签相关** |
| 标签列表 | `GET /tags/page` | `GET /tags/page` | ✅ 一致 | - |
| 关注的标签 | `GET /tags/following` | `GET /tags/following` | ✅ 一致 | - |
| 获取标签信息 | `GET /tag` | `GET /tag` | ✅ 一致 | - |
| 根据slug获取标签 | `GET /tags` | `GET /tags` | ✅ 一致 | - |
| 标签同义词 | `GET /tag/synonyms` | `GET /tag/synonyms` | ✅ 一致 | - |
| **问题相关** |
| 问题信息 | `GET /question/info` | `GET /question/info` | ✅ 一致 | - |
| 问题邀请信息 | `GET /question/invite` | `GET /question/invite` | ✅ 一致 | - |
| 问题列表 | `GET /question/page` | `GET /question/page` | ✅ 一致 | - |
| 推荐问题 | `GET /question/recommend/page` | `GET /question/recommend/page` | ✅ 一致 | - |
| 相似问题 | `GET /question/similar/tag` | `GET /question/similar/tag` | ✅ 一致 | - |
| 问题链接 | `GET /question/link` | `GET /question/link` | ✅ 一致 | - |
| **答案相关** |
| 答案信息 | `GET /answer/info` | `GET /answer/info` | ✅ 一致 | - |
| 答案列表 | `GET /answer/page` | `GET /answer/page` | ✅ 一致 | - |
| **评论相关** |
| 评论列表 | `GET /comment/page` | `GET /comment/page` | ✅ 一致 | - |
| 获取评论 | `GET /comment` | `GET /comment` | ✅ 一致 | - |
| **个人页面相关** |
| 个人用户信息 | `GET /personal/user/info` | `GET /personal/user/info` | ✅ 一致 | - |
| 个人问答排行 | `GET /personal/qa/top` | `GET /personal/qa/top` | ✅ 一致 | - |
| 个人问题页面 | `GET /personal/question/page` | `GET /personal/question/page` | ✅ 一致 | - |
| 个人答案页面 | `GET /personal/answer/page` | `GET /personal/answer/page` | ✅ 一致 | - |
| 个人评论页面 | `GET /personal/comment/page` | `GET /personal/comment/page` | ✅ 一致 | - |
| **用户相关** |
| 用户信息 | `GET /user/info` | `GET /user/info` | ✅ 一致 | - |
| 用户排行榜 | `GET /user/ranking` | `GET /user/ranking` | ✅ 一致 | - |
| 员工信息 | `GET /user/staff` | `GET /user/staff` | ✅ 一致 | - |
| **搜索相关** |
| 搜索 | `GET /search` | `GET /search` | ✅ 一致 | - |
| 搜索描述 | `GET /search/desc` | `GET /search/desc` | ✅ 一致 | - |
| **排名相关** |
| 个人排名页面 | `GET /personal/rank/page` | `GET /personal/rank/page` | ✅ 一致 | - |
| **徽章相关** |
| 徽章信息 | `GET /badge` | ❌ 缺失 | ❌ 需要添加 |
| 徽章奖励列表 | `GET /badge/awards/page` | ❌ 缺失 | ❌ 需要添加 |
| 用户最近徽章 | `GET /badge/user/awards/recent` | ❌ 缺失 | ❌ 需要添加 |
| 用户所有徽章 | `GET /badge/user/awards` | ❌ 缺失 | ❌ 需要添加 |
| 徽章列表 | `GET /badges` | ❌ 缺失 | ❌ 需要添加 |
| **反应/元数据相关** |
| 获取反应 | `GET /meta/reaction` | ❌ 缺失 | ❌ 需要添加 |
| **修订相关** |
| 修订列表 | `GET /revisions` | ❌ 缺失 | ❌ 需要添加 |

## 🔧 需要修正的问题

### 1. 缺失的模块和路由

#### 徽章模块 (Badge Module)
```typescript
// 需要创建 src/modules/badge/
GET /badge - 获取徽章信息
GET /badge/awards/page - 徽章奖励列表  
GET /badge/user/awards/recent - 用户最近徽章
GET /badge/user/awards - 用户所有徽章
GET /badges - 徽章列表
```

#### 元数据/反应模块 (Meta Module)
```typescript
// 需要创建 src/modules/meta/
GET /meta/reaction - 获取反应信息
PUT /meta/reaction - 添加或更新反应 (需要认证)
```

#### 修订模块 (Revision Module)
```typescript
// 需要创建 src/modules/revision/
GET /revisions - 修订列表 (可选认证)
GET /revisions/unreviewed - 未审核修订列表 (需要认证)
PUT /revisions/audit - 修订审核 (需要认证)
GET /revisions/edit/check - 检查是否可以更新修订 (需要认证)
GET /reviewing/type - 获取审核类型 (需要认证)
```

### 2. 控制器组织问题

当前我们创建了一些不必要的分离：
- `TagsController` 和 `TagController` - 应该合并
- `QuestionTagsController` - 应该放在问题模块中
- `PersonalController` - 这些路由应该分散到各自的模块中

### 3. 路由前缀问题

Go项目中的一些路由我们放错了位置：
- `GET /personal/*` 路由应该分散到各个模块中
- `GET /question/tags` 应该在问题模块中，不需要单独的控制器

## 📋 修正计划

1. **创建缺失的模块**：
   - Badge Module (徽章模块)
   - Meta Module (元数据模块) 
   - Revision Module (修订模块)

2. **重新组织现有控制器**：
   - 合并标签相关控制器
   - 将个人页面路由分散到各模块
   - 移除不必要的控制器分离

3. **确保路由地址完全一致**：
   - 对照Go项目逐一检查每个路由
   - 确保HTTP方法、路径、参数都一致

4. **完善权限控制**：
   - 确保每个路由的认证要求与Go项目一致
   - 实现正确的可选认证逻辑

## 🎯 结论

虽然我们的整体架构设计是正确的，但在具体的路由地址和模块组织上还有一些不一致的地方。需要：

1. 补充缺失的徽章、元数据、修订模块
2. 重新组织控制器结构
3. 确保所有路由地址与Go项目完全一致
4. 实现正确的可选认证业务逻辑
