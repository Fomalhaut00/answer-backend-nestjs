# NestJS项目API完善计划

## 🔍 当前状态分析

### ✅ 已实现的模块
1. **UserController** - 基本用户功能 (约60%完成)
2. **QuestionController** - 问题管理 (约70%完成)
3. **AnswerController** - 答案管理 (约60%完成)
4. **CommentController** - 评论管理 (约50%完成)
5. **VoteController** - 投票功能 (约40%完成)
6. **TagController** - 标签管理 (约80%完成)
7. **SearchController** - 搜索功能 (约30%完成)
8. **ActivityController** - 活动记录 (约40%完成)
9. **NotificationController** - 通知管理 (约60%完成)
10. **RoleController** - 角色管理 (约50%完成)
11. **PowerController** - 权限管理 (约40%完成)
12. **AdminController** - 管理员功能 (约30%完成)

### ❌ 缺失的模块
1. **LangController** - 国际化语言
2. **SiteInfoController** - 站点信息配置
3. **ReportController** - 举报功能
4. **FollowController** - 关注功能
5. **CollectionController** - 收藏功能
6. **RevisionController** - 版本修订
7. **RankController** - 排名功能
8. **ReasonController** - 原因管理
9. **ThemeController** - 主题管理
10. **DashboardController** - 仪表板
11. **UploadController** - 文件上传
12. **PluginController** - 插件管理
13. **ReviewController** - 审核功能
14. **MetaController** - 元数据管理
15. **BadgeController** - 徽章系统

## 🎯 优先级分级

### 🔥 高优先级 (核心功能)
1. **SiteInfoController** - 站点配置是系统基础
2. **CollectionController** - 收藏是核心用户功能
3. **FollowController** - 关注功能增强用户粘性
4. **ReportController** - 举报功能保证内容质量
5. **UploadController** - 文件上传是基础功能
6. **RevisionController** - 版本控制保证内容质量

### 🟡 中优先级 (增强功能)
7. **RankController** - 排名功能增加竞争性
8. **ReviewController** - 内容审核功能
9. **DashboardController** - 管理后台核心
10. **ReasonController** - 原因管理支持举报等功能
11. **LangController** - 国际化支持

### 🟢 低优先级 (扩展功能)
12. **BadgeController** - 徽章系统增加游戏化
13. **ThemeController** - 主题定制
14. **PluginController** - 插件系统
15. **MetaController** - 元数据管理

## 📋 具体实施计划

### 第一阶段：核心功能补充

#### 1. SiteInfoController
```typescript
@Controller('siteinfo')
export class SiteInfoController {
  // 公开接口
  @Public()
  @Get()
  async getSiteInfo() { }
  
  @Public()
  @Get('legal')
  async getSiteLegalInfo() { }
}

@Controller('admin/siteinfo')
export class AdminSiteInfoController {
  // 管理员接口
  @Get('general')
  async getGeneral() { }
  
  @Put('general')
  async updateGeneral() { }
  
  @Get('interface')
  async getInterface() { }
  
  @Put('interface')
  async updateInterface() { }
  
  // ... 其他设置接口
}
```

#### 2. CollectionController
```typescript
@Controller('collection')
export class CollectionController {
  @Post('switch')
  async collectionSwitch() { }
  
  @Get('personal/collection/page')
  async getPersonalCollectionPage() { }
}
```

#### 3. FollowController
```typescript
@Controller('follow')
export class FollowController {
  @Post()
  async follow() { }
  
  @Put('tags')
  async updateFollowTags() { }
}
```

#### 4. ReportController
```typescript
@Controller('report')
export class ReportController {
  @Post()
  async addReport() { }
  
  @Get('unreviewed/post')
  async getUnreviewedReportPostPage() { }
  
  @Put('review')
  async reviewReport() { }
}
```

#### 5. UploadController
```typescript
@Controller('file')
export class UploadController {
  @Post()
  async uploadFile() { }
  
  @Post('post/render')
  async postRender() { }
}
```

### 第二阶段：增强功能

#### 6. RevisionController
```typescript
@Controller('revisions')
export class RevisionController {
  @Public()
  @Get()
  async getRevisionList() { }
  
  @Get('unreviewed')
  async getUnreviewedRevisionList() { }
  
  @Put('audit')
  async revisionAudit() { }
  
  @Get('edit/check')
  async checkCanUpdateRevision() { }
  
  @Get('reviewing/type')
  async getReviewingType() { }
}
```

#### 7. RankController
```typescript
@Controller('rank')
export class RankController {
  @Get('personal/rank/page')
  async getRankPersonalWithPage() { }
}
```

#### 8. ReviewController
```typescript
@Controller('review')
export class ReviewController {
  @Get('pending/post/page')
  async getUnreviewedPostPage() { }
  
  @Put('pending/post')
  async updateReview() { }
}
```

### 第三阶段：管理功能

#### 9. DashboardController
```typescript
@Controller('admin/dashboard')
export class DashboardController {
  @Get()
  async getDashboardInfo() { }
}
```

#### 10. LangController
```typescript
@Controller('language')
export class LangController {
  @Public()
  @Get('config')
  async getLangMapping() { }
  
  @Public()
  @Get('options')
  async getUserLangOptions() { }
  
  @Get('admin/options')
  async getAdminLangOptions() { }
}
```

## 🔧 现有Controller需要补充的接口

### UserController 需要补充
```typescript
// 公开接口
@Public()
@Get('personal/user/info')
async getOtherUserInfoByUsername() { }

@Public()
@Get('ranking')
async getUserRanking() { }

@Public()
@Get('staff')
async getUserStaff() { }

// 认证接口
@Get('action/record')
async getActionRecord() { }

@Post('email/change/code')
async userChangeEmailSendCode() { }

@Post('email/verification/send')
async userVerifyEmailSend() { }
```

### QuestionController 需要补充
```typescript
// 公开接口
@Public()
@Get('invite')
async getQuestionInviteUserInfo() { }

@Public()
@Get('recommend/page')
async getQuestionRecommendPage() { }

@Public()
@Get('similar/tag')
async getSimilarQuestion() { }

@Public()
@Get('personal/qa/top')
async getUserTop() { }

@Public()
@Get('link')
async getQuestionLink() { }

// 认证接口
@Post('answer')
async addQuestionByAnswer() { }

@Put('invite')
async updateQuestionInviteUser() { }

@Put('status')
async closeQuestion() { }

@Put('reopen')
async reopenQuestion() { }

@Get('similar')
async getSimilarQuestions() { }

@Post('link')
async addQuestionLink() { }
```

### 其他Controller类似需要补充...

## 📊 实施时间估算

- **第一阶段** (核心功能): 2-3周
- **第二阶段** (增强功能): 2-3周  
- **第三阶段** (管理功能): 1-2周
- **接口补充** (现有Controller): 1-2周

**总计**: 6-10周完成100%API兼容

## 🎯 成功标准

1. **API路径100%匹配**: 所有Go项目的API路径在NestJS中都有对应实现
2. **功能逻辑一致**: 每个接口的业务逻辑与Go项目保持一致
3. **数据结构兼容**: 请求和响应的数据结构完全兼容
4. **权限控制一致**: 认证和授权逻辑与Go项目保持一致

## 🚀 下一步行动

1. **立即开始**: 从SiteInfoController开始实施
2. **并行开发**: 可以同时进行多个Controller的开发
3. **测试验证**: 每完成一个Controller就进行功能测试
4. **文档更新**: 及时更新API文档和使用说明
