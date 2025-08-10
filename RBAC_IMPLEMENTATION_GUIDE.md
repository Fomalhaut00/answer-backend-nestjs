# RBAC权限控制系统实现指南

本项目实现了完整的基于角色的访问控制(RBAC)系统，参考了Go项目Apache Answer的权限设计。

## 权限系统架构

### 1. 三层权限模型
- **角色层**: 用户被分配到不同的角色（如admin、moderator、user）
- **权限层**: 每个角色通过RolePowerRel表关联不同的操作权限
- **声誉层**: 基于用户声誉值的动态权限控制

### 2. 核心数据表
- **User**: 用户基本信息
- **Role**: 角色定义（admin、moderator、user等）
- **Power**: 权限定义（question.add、answer.edit等）
- **UserRoleRel**: 用户-角色关联表
- **RolePowerRel**: 角色-权限关联表（核心权限控制表）

### 3. 核心组件

#### 守卫 (Guards)
- `JwtAuthGuard`: JWT认证守卫，验证用户身份
- `RolesGuard`: 角色权限守卫，检查用户角色
- `PermissionsGuard`: 操作权限守卫，基于RolePowerRel表检查具体操作权限

#### 装饰器 (Decorators)
- `@Public()`: 标记公开接口，无需认证
- `@RequireRoles()`: 要求特定角色
- `@RequirePermissions()`: 要求特定操作权限

#### 权限管理API
- `GET /role-power-rel`: 获取所有角色权限关系
- `POST /role-power-rel`: 创建角色权限关系
- `POST /role-power-rel/batch`: 批量分配权限给角色
- `GET /role-power-rel/role/:roleId`: 获取角色的所有权限
- `GET /role-power-rel/user/:userId/powers`: 获取用户的所有权限
- `DELETE /role-power-rel/:id`: 删除角色权限关系

## 使用示例

### 1. 基本认证
```typescript
// 需要登录的接口
@Controller('user')
export class UserController {
  @Get('profile')
  async getProfile(@Request() req) {
    // 自动应用JwtAuthGuard，需要有效的JWT token
    return this.userService.getProfile(req.user.sub);
  }
}
```

### 2. 公开接口
```typescript
// 无需认证的公开接口
@Controller('question')
export class QuestionController {
  @Public()
  @Get('page')
  async getQuestions() {
    // 任何人都可以访问，无需登录
    return this.questionService.getQuestions();
  }
}
```

### 3. 角色权限控制
```typescript
// 只有管理员可以访问
@Controller('admin')
@UseGuards(RolesGuard)
@RequireRoles('admin')
export class AdminController {
  @Get('users')
  async getUsers() {
    // 只有admin角色的用户可以访问
  }

  @RequireRoles('admin', 'moderator')
  @Get('reports')
  async getReports() {
    // admin或moderator角色都可以访问
  }
}
```

### 4. 操作权限控制
```typescript
// 基于具体操作权限的控制
@Controller('question')
export class QuestionController {
  @UseGuards(PermissionsGuard)
  @RequirePermissions('question.add')
  @Post()
  async createQuestion() {
    // 需要question.add权限（通常需要1声誉值）
  }

  @UseGuards(PermissionsGuard)
  @RequirePermissions('question.edit')
  @Put(':id')
  async updateQuestion() {
    // 需要question.edit权限（通常需要2000声誉值）
  }

  @UseGuards(PermissionsGuard)
  @RequirePermissions('question.delete')
  @Delete(':id')
  async deleteQuestion() {
    // 需要question.delete权限（通常需要10000声誉值）
  }
}
```

### 5. 组合权限控制
```typescript
@Controller('vote')
export class VoteController {
  @UseGuards(PermissionsGuard)
  @RequirePermissions('question.vote_up')
  @Post('up')
  async voteUp() {
    // 需要投票权限（通常需要15声誉值）
  }

  @UseGuards(PermissionsGuard)
  @RequirePermissions('question.vote_down')
  @Post('down')
  async voteDown() {
    // 投票反对需要更高权限（通常需要125声誉值）
  }
}
```

### 6. 权限管理示例
```typescript
// 为角色批量分配权限
@Post('role-power-rel/batch')
async batchAssignPermissions() {
  const dto = {
    roleId: 2, // moderator角色
    powerTypes: [
      'question.edit',
      'answer.edit',
      'comment.delete',
      'tag.edit'
    ]
  };
  return this.rolePowerRelService.batchCreate(dto);
}

// 获取用户的所有权限
@Get('user/:userId/permissions')
async getUserPermissions(@Param('userId') userId: string) {
  return this.rolePowerRelService.getUserPowerList(userId);
}

// 检查用户是否有特定权限
async checkUserPermission(userId: string, permission: string): Promise<boolean> {
  const userPermissions = await this.rolePowerRelService.getUserPowerList(userId);
  return userPermissions.includes(permission);
}
```

## 权限配置

### 1. 声誉值要求
```typescript
// 在PermissionService中配置的权限要求
const rankRequirements: Record<string, number> = {
  'question.add': 1,
  'question.edit': 2000,
  'question.delete': 10000,
  'question.vote_up': 15,
  'question.vote_down': 125,
  'answer.add': 1,
  'answer.edit': 2000,
  'comment.add': 50,
  'tag.add': 1500,
  // ... 更多权限配置
};
```

### 2. 角色权限
```typescript
// 角色权限检查逻辑
private checkRolePermission(role: Role, action: string): boolean {
  // 管理员和版主拥有大部分权限
  if (role.name === 'admin' || role.name === 'moderator') {
    return true;
  }
  return false;
}
```

## 权限检查流程

### 1. 认证流程
```
请求 → JwtAuthGuard → 验证JWT → 提取用户信息 → 继续处理
```

### 2. 角色权限检查
```
请求 → RolesGuard → 获取用户角色 → 检查角色要求 → 允许/拒绝
```

### 3. 操作权限检查
```
请求 → PermissionsGuard → 获取用户信息 → 检查声誉值 → 检查角色权限 → 允许/拒绝
```

## 错误处理

### 1. 认证失败
```json
{
  "statusCode": 401,
  "message": "Access token is required"
}
```

### 2. 角色权限不足
```json
{
  "statusCode": 403,
  "message": "Insufficient role. Required: admin. Current: user"
}
```

### 3. 操作权限不足
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions. Required: question.edit. You need 2000 reputation to perform this action"
}
```

## 最佳实践

### 1. 权限粒度
- 使用细粒度的权限控制，如`question.add`、`question.edit`等
- 避免过于宽泛的权限，如`question.*`

### 2. 角色设计
- 设计清晰的角色层次：`user` → `moderator` → `admin`
- 每个角色有明确的职责范围

### 3. 声誉系统
- 基于用户行为动态调整声誉值
- 声誉值与权限挂钩，激励用户积极参与

### 4. 安全考虑
- 敏感操作需要多重验证
- 记录所有权限相关的操作日志
- 定期审查权限配置

## 扩展功能

### 1. 动态权限
可以扩展系统支持动态权限配置，允许在运行时修改权限要求。

### 2. 权限继承
实现角色权限继承，子角色自动继承父角色的权限。

### 3. 临时权限
支持临时权限授予，如临时版主权限。

### 4. 权限审计
记录所有权限检查和授权操作，用于安全审计。

这个RBAC系统完全兼容Go项目的权限设计，确保了前后端的一致性。
