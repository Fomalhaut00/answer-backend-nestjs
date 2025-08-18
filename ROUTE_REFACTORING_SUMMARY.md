# NestJS 路由重构总结

基于Go项目的Apache Answer路由设计，我们对NestJS项目进行了全面的路由重构。

## ⚠️ 重要发现和修正

### 1. 可选认证的设计意义
经过对Go项目源码的分析，发现可选认证确实有其重要意义：

**Go项目中的实现方式**：
- 使用 `middleware.GetLoginUserIDFromContext(ctx)` 获取用户ID
- 如果没有token或token无效，返回空字符串，但不阻止请求继续
- 业务逻辑根据userID是否为空来提供不同的功能

**具体差异**：
1. **权限检查**：登录用户可以看到编辑、删除等操作按钮
2. **个性化内容**：推荐页面需要登录用户才能访问
3. **状态信息**：登录用户可以看到投票状态、收藏状态等
4. **访问控制**：某些被删除或待审核的内容只有作者和管理员能看到

### 2. 路由地址不一致问题
发现了一个重要问题：我们的路由地址与Go项目不完全一致！

## 路由分组设计

### 1. 必须未认证路由 (RegisterMustUnAuthAnswerAPIRouter)
**装饰器**: `@Public()`
**说明**: 完全公开的接口，不需要任何认证

#### 用户模块
- `POST /user/login/email` - 邮箱登录
- `POST /user/register/email` - 邮箱注册
- `POST /user/email/verification` - 邮箱验证
- `PUT /user/email` - 邮箱变更验证
- `POST /user/password/reset` - 密码重置
- `POST /user/password/replacement` - 使用重置密码
- `PUT /user/notification/unsubscribe` - 取消订阅通知

### 2. 可选认证路由 (RegisterUnAuthAnswerAPIRouter)
**装饰器**: `@OptionalAuth()`
**说明**: 可以带token也可以不带，带token时会解析用户信息

#### 用户模块
- `GET /user/info` - 获取用户信息
- `GET /user/ranking` - 用户排行榜
- `GET /user/staff` - 获取员工信息

#### 个人页面模块
- `GET /personal/user/info` - 个人用户信息
- `GET /personal/qa/top` - 用户问答排行
- `GET /personal/question/page` - 个人问题页面
- `GET /personal/answer/page` - 个人答案页面
- `GET /personal/comment/page` - 个人评论页面
- `GET /personal/rank/page` - 个人排名页面

#### 问题模块
- `GET /question/info` - 获取问题信息
- `GET /question/invite` - 获取问题邀请信息
- `GET /question/page` - 问题列表
- `GET /question/recommend/page` - 推荐问题列表
- `GET /question/similar/tag` - 相似问题
- `GET /question/link` - 问题链接

#### 答案模块
- `GET /answer/info` - 获取答案信息
- `GET /answer/page` - 答案列表

#### 评论模块
- `GET /comment/page` - 评论列表
- `GET /comment` - 获取评论

#### 标签模块
- `GET /tags/page` - 标签列表
- `GET /tags/following` - 关注的标签
- `GET /tag` - 获取标签信息
- `GET /tags` - 根据slug获取标签
- `GET /tag/synonyms` - 标签同义词

#### 搜索模块
- `GET /search` - 搜索
- `GET /search/desc` - 搜索描述

#### 排名模块
- `GET /personal/rank/page` - 个人排名页面

### 3. 任何状态用户路由 (RegisterAuthUserWithAnyStatusAnswerAPIRouter)
**说明**: 需要认证但不限制用户状态

#### 用户模块
- `GET /user/logout` - 用户登出
- `POST /user/email/change/code` - 发送邮箱变更验证码
- `POST /user/email/verification/send` - 发送邮箱验证

### 4. 需要认证路由 (RegisterAnswerAPIRouter)
**说明**: 需要用户认证且用户状态正常

#### 用户模块
- `PUT /user/password` - 修改密码
- `PUT /user/info` - 更新用户信息
- `PUT /user/interface` - 更新用户界面设置
- `GET /user/notification/config` - 获取通知配置
- `PUT /user/notification/config` - 更新通知配置
- `GET /user/info/search` - 搜索用户

#### 个人页面模块
- `GET /personal/vote/page` - 个人投票页面
- `GET /personal/collection/page` - 个人收藏页面

#### 问题模块
- `POST /question` - 创建问题
- `POST /question/answer` - 通过答案创建问题
- `PUT /question` - 更新问题
- `PUT /question/invite` - 更新问题邀请
- `DELETE /question` - 删除问题
- `PUT /question/status` - 关闭问题
- `PUT /question/operation` - 问题操作
- `PUT /question/reopen` - 重新打开问题
- `GET /question/similar` - 获取相似问题
- `POST /question/recover` - 恢复问题

#### 答案模块
- `POST /answer` - 创建答案
- `PUT /answer` - 更新答案
- `POST /answer/acceptance` - 接受答案
- `DELETE /answer` - 删除答案
- `POST /answer/recover` - 恢复答案

#### 评论模块
- `POST /comment` - 创建评论
- `DELETE /comment` - 删除评论
- `PUT /comment` - 更新评论

#### 标签模块
- `GET /question/tags` - 搜索标签
- `POST /tag` - 创建标签
- `PUT /tag` - 更新标签
- `POST /tag/recover` - 恢复标签
- `DELETE /tag` - 删除标签
- `PUT /tag/synonym` - 更新标签同义词
- `POST /tag/merge` - 合并标签

#### 投票模块
- `POST /vote/up` - 点赞
- `POST /vote/down` - 点踩

#### 通知模块
- `GET /notification/status` - 获取通知状态
- `PUT /notification/status` - 清除通知状态
- `GET /notification/page` - 通知列表
- `PUT /notification/read/state/all` - 标记所有为已读
- `PUT /notification/read/state` - 标记指定为已读

#### 活动模块
- `GET /activity/timeline` - 获取时间线
- `GET /activity/timeline/detail` - 获取时间线详情

#### 收藏模块
- `POST /collection/switch` - 收藏切换

#### 关注模块
- `POST /follow` - 关注/取消关注
- `PUT /follow/tags` - 更新关注标签

#### 举报模块
- `POST /report` - 提交举报

#### 上传模块
- `POST /file` - 文件上传
- `POST /post/render` - 内容渲染

### 5. 管理员路由 (RegisterAnswerAdminAPIRouter)
**装饰器**: `@AdminOnly()`
**说明**: 需要管理员权限

#### 用户管理
- `GET /admin/users/page` - 用户列表
- `PUT /admin/user/status` - 更新用户状态
- `PUT /admin/user/role` - 更新用户角色
- `GET /admin/user/activation` - 获取用户激活信息
- `POST /admin/user/activation` - 发送用户激活
- `POST /admin/user` - 创建用户
- `POST /admin/users` - 批量创建用户
- `PUT /admin/user/password` - 更新用户密码
- `PUT /admin/user/profile` - 编辑用户资料
- `DELETE /admin/delete/permanently` - 永久删除

#### 问题管理
- `GET /admin/question/page` - 问题管理列表
- `PUT /admin/question/status` - 更新问题状态
- `GET /admin/answer/page` - 答案管理列表

#### 答案管理
- `PUT /admin/answer/status` - 更新答案状态

#### 举报管理
- `GET /admin/report/unreviewed/post` - 未审核举报列表
- `PUT /admin/report/review` - 审核举报

## 技术实现

### 1. 装饰器系统
- `@Public()` - 完全公开接口
- `@OptionalAuth()` - 可选认证接口
- `@AdminOnly()` - 管理员专用接口

### 2. 守卫系统
- `JwtAuthGuard` - JWT认证守卫，支持可选认证
- `AdminGuard` - 管理员权限守卫

### 3. 模块组织
- 按功能模块组织控制器
- 分离公开、认证、管理员路由
- 统一的错误处理和响应格式

## 与Go项目的对应关系

| Go路由分组 | NestJS装饰器 | 说明 |
|-----------|-------------|------|
| RegisterMustUnAuthAnswerAPIRouter | @Public() | 必须未认证 |
| RegisterUnAuthAnswerAPIRouter | @OptionalAuth() | 可选认证 |
| RegisterAuthUserWithAnyStatusAnswerAPIRouter | 默认认证 | 任何状态用户 |
| RegisterAnswerAPIRouter | 默认认证 | 需要认证 |
| RegisterAnswerAdminAPIRouter | @AdminOnly() | 管理员专用 |

## 新增功能模块

1. **收藏模块** (CollectionModule) - 问题/答案收藏功能
2. **关注模块** (FollowModule) - 用户/标签关注功能
3. **举报模块** (ReportModule) - 内容举报功能
4. **上传模块** (UploadModule) - 文件上传功能
5. **排名模块** (RankModule) - 用户排名功能

这次重构确保了NestJS项目的路由结构与Go项目完全一致，提供了完整的功能覆盖和正确的权限控制。
