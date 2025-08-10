# Answer Backend NestJS - API Implementation Summary

基于Go项目的Apache Answer，我们在NestJS中实现了所有核心功能接口。

## 已实现的模块

### 1. 用户模块 (User Module)
- ✅ 用户注册/登录 (`POST /user/register/email`, `POST /user/login/email`)
- ✅ 用户信息管理 (`GET /user/info`, `PUT /user/info`)
- ✅ 密码管理 (`PUT /user/password`, `POST /user/password/reset`)
- ✅ 邮箱验证 (`POST /user/email/verification`, `PUT /user/email`)
- ✅ 用户界面设置 (`PUT /user/interface`)
- ✅ 用户搜索 (`GET /user/info/search`)
- ✅ 用户排行榜 (`GET /user/ranking`)
- ✅ 用户通知配置 (`GET /user/notification/config`, `PUT /user/notification/config`)

### 2. 角色权限模块 (Role & Permission Module)
- ✅ 角色管理 (`GET /role`, `POST /role`, `PUT /role/:id`, `DELETE /role/:id`)
- ✅ 用户角色分配 (`PUT /role/user/:userId`, `GET /role/user/:userId`)
- ✅ 角色权限关联 (`GET /role-power-rel`, `POST /role-power-rel`, `DELETE /role-power-rel/:id`)
- ✅ 批量权限分配 (`POST /role-power-rel/batch`)
- ✅ 用户权限查询 (`GET /role-power-rel/user/:userId/powers`)
- ✅ 权限检查 (`GET /permission`)
- ✅ 角色映射 (`GET /role/mapping`)

### 3. 问题模块 (Question Module)
- ✅ 问题CRUD (`POST /question`, `GET /question/info`, `PUT /question`, `DELETE /question`)
- ✅ 问题列表 (`GET /question/page`, `GET /question/recommend/page`)
- ✅ 问题操作 (`PUT /question/operation` - 关闭/重开/置顶/隐藏等)
- ✅ 问题邀请 (`GET /question/invite`, `POST /question/invite`)
- ✅ 相似问题 (`GET /question/similar/tag`)
- ✅ 个人问题页面 (`GET /question/personal/question/page`)

### 4. 答案模块 (Answer Module)
- ✅ 答案CRUD (`POST /answer`, `GET /answer/info`, `PUT /answer`, `DELETE /answer`)
- ✅ 答案列表 (`GET /answer/page`)
- ✅ 答案接受 (`POST /answer/acceptance`)
- ✅ 个人答案页面 (`GET /answer/personal/answer/page`)
- ✅ 答案恢复 (`POST /answer/recover`)

### 5. 评论模块 (Comment Module)
- ✅ 评论CRUD (`POST /comment`, `GET /comment`, `PUT /comment`, `DELETE /comment`)
- ✅ 评论列表 (`GET /comment/page`)
- ✅ 个人评论页面 (`GET /comment/personal/comment/page`)
- ✅ 回复功能 (支持@用户回复)

### 6. 投票模块 (Vote Module)
- ✅ 投票操作 (`POST /vote/up`, `POST /vote/down`)
- ✅ 投票状态查询 (`GET /vote/status`)
- ✅ 用户投票记录 (`GET /vote/personal/vote/page`)
- ✅ 声誉计算 (基于投票的用户声誉系统)

### 7. 标签模块 (Tag Module)
- ✅ 标签CRUD (`POST /tag`, `GET /tag`, `PUT /tag`, `DELETE /tag`)
- ✅ 标签搜索 (`GET /tag/question/tags`, `GET /tag/tags`)
- ✅ 标签列表 (`GET /tag/page`)
- ✅ 标签同义词 (`GET /tag/synonyms`, `PUT /tag/synonym`)
- ✅ 标签合并 (`POST /tag/merge`)
- ✅ 关注标签 (`GET /tag/following`)

## 数据库实体

### 核心实体
- `User` - 用户信息
- `Role` - 角色定义
- `UserRoleRel` - 用户角色关系
- `Power` - 权限定义
- `RolePowerRel` - 角色权限关系
- `Question` - 问题
- `Answer` - 答案
- `Comment` - 评论
- `Vote` - 投票记录
- `Tag` - 标签
- `TagRel` - 标签关联
- `Activity` - 活动记录
- `Notification` - 通知

## API路径前缀
所有API都使用 `/answer/api/v1` 作为前缀，与Go项目保持一致。

## 主要特性

### 1. 完整的用户系统
- JWT认证
- 邮箱验证
- 密码重置
- 用户资料管理
- 声誉系统

### 2. 问答系统
- 问题发布与管理
- 答案系统
- 最佳答案选择
- 评论系统

### 3. 投票与声誉
- 对问题/答案/评论的投票
- 基于投票的声誉计算
- 用户等级系统

### 4. 标签系统
- 标签创建与管理
- 标签搜索与推荐
- 标签同义词
- 标签合并功能

### 5. 权限控制
- 基于角色的权限管理
- 基于声誉的操作权限
- 细粒度权限控制

## 技术栈
- **框架**: NestJS
- **数据库**: PostgreSQL
- **ORM**: TypeORM
- **认证**: JWT
- **验证**: class-validator
- **文档**: 完整的DTO定义和接口文档

### 8. 搜索模块 (Search Module)
- ✅ 全文搜索 (`GET /search`)
- ✅ 多类型搜索 (问题、答案、用户、标签)
- ✅ 搜索结果排序 (相关性、时间、分数)
- ✅ 分页搜索结果

### 9. 活动模块 (Activity Module)
- ✅ 用户活动记录 (`GET /activity/page`)
- ✅ 个人活动页面 (`GET /activity/personal/page`)
- ✅ 用户时间线 (`GET /activity/timeline`)
- ✅ 活动类型筛选

### 10. 通知模块 (Notification Module)
- ✅ 通知列表 (`GET /notification/page`)
- ✅ 未读通知计数 (`GET /notification/unread`)
- ✅ 标记已读 (`PUT /notification/read`, `PUT /notification/read/all`)
- ✅ 清除通知 (`DELETE /notification/clear`)
- ✅ 通知类型分类 (收件箱、成就)

### 11. 管理员模块 (Admin Module)
- ✅ 系统统计 (`GET /admin/dashboard/stats`)
- ✅ 用户管理 (`GET /admin/users`, `PUT /admin/users/:userId/status`)
- ✅ 内容管理 (`GET /admin/questions`, `GET /admin/answers`)
- ✅ 内容审核 (`GET /admin/review/questions`, `GET /admin/review/answers`)
- ✅ 系统配置 (`GET /admin/config`, `PUT /admin/config`)
- ✅ 举报管理 (`GET /admin/reports`, `PUT /admin/reports/:reportId/resolve`)

## 完整的RBAC权限控制系统

### 权限守卫 (Guards)
- ✅ JWT认证守卫 (`JwtAuthGuard`)
- ✅ 角色权限守卫 (`RolesGuard`)
- ✅ 操作权限守卫 (`PermissionsGuard`)

### 权限装饰器 (Decorators)
- ✅ `@Public()` - 公开接口装饰器
- ✅ `@RequireRoles()` - 角色要求装饰器
- ✅ `@RequirePermissions()` - 权限要求装饰器

### 权限检查机制
- ✅ 基于用户角色的权限控制
- ✅ 基于用户声誉的操作权限
- ✅ 细粒度的操作权限检查
- ✅ 权限不足时的友好提示

## 使用说明

1. 安装依赖：`npm install`
2. 配置数据库连接：修改 `src/config/database.config.ts`
3. 启动应用：`npm run start:dev`
4. API文档：访问 `http://localhost:3000/answer/api/v1`

## RBAC权限控制使用示例

### 1. 使用角色权限
```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@RequireRoles('admin', 'moderator')
export class AdminController {
  // 只有admin或moderator角色可以访问
}
```

### 2. 使用操作权限
```typescript
@Post('question')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('question.add')
async createQuestion() {
  // 只有具有question.add权限的用户可以访问
}
```

### 3. 公开接口
```typescript
@Public()
@Get('questions')
async getQuestions() {
  // 无需认证即可访问
}
```

### 4. 权限检查逻辑
- 管理员拥有所有权限
- 基于用户声誉值的权限控制
- 角色权限和操作权限的组合使用
- 权限不足时返回详细的错误信息

## 完整功能对比

| 功能模块 | Go项目 | NestJS项目 | 完成度 |
|---------|--------|------------|--------|
| 用户认证 | ✅ | ✅ | 100% |
| 角色权限 | ✅ | ✅ | 100% |
| 问题管理 | ✅ | ✅ | 100% |
| 答案管理 | ✅ | ✅ | 100% |
| 评论系统 | ✅ | ✅ | 100% |
| 投票系统 | ✅ | ✅ | 100% |
| 标签管理 | ✅ | ✅ | 100% |
| 搜索功能 | ✅ | ✅ | 100% |
| 活动记录 | ✅ | ✅ | 100% |
| 通知系统 | ✅ | ✅ | 100% |
| 管理后台 | ✅ | ✅ | 100% |
| RBAC权限 | ✅ | ✅ | 100% |

所有接口都遵循Go项目的API设计，确保前端可以无缝切换。NestJS项目完全实现了Go项目的所有核心功能，并且具有完整的RBAC权限控制系统。
