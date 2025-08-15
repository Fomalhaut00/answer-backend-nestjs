# Go项目与NestJS项目API路由对照表

## 🔍 Go项目路由分析

基于`internal/router/answer_api_router.go`文件，Go项目的路由分为4个主要组：

### 1. RegisterMustUnAuthAnswerAPIRouter (无需认证)
```go
// i18n
GET  /language/config                    # 语言配置
GET  /language/options                   # 用户语言选项

// siteinfo  
GET  /siteinfo                          # 站点信息
GET  /siteinfo/legal                    # 法律信息

// user
GET  /user/info                         # 用户信息
GET  /user/action/record                # 用户操作记录(需认证)
POST /user/login/email                  # 邮箱登录
POST /user/register/email               # 邮箱注册
POST /user/email/verification           # 邮箱验证
PUT  /user/email                        # 修改邮箱
POST /user/password/reset               # 重置密码
POST /user/password/replacement         # 替换密码
PUT  /user/notification/unsubscribe     # 取消通知订阅

// plugins
GET  /plugin/status                     # 插件状态
```

### 2. RegisterUnAuthAnswerAPIRouter (公开访问)
```go
// user
GET  /personal/user/info                # 个人用户信息
GET  /user/ranking                      # 用户排名
GET  /user/staff                        # 员工信息

// answer
GET  /answer/info                       # 答案信息
GET  /answer/page                       # 答案分页
GET  /personal/answer/page              # 个人答案分页

// question
GET  /question/info                     # 问题信息
GET  /question/invite                   # 问题邀请信息
GET  /question/page                     # 问题分页
GET  /question/recommend/page           # 推荐问题分页
GET  /question/similar/tag              # 相似问题
GET  /personal/qa/top                   # 个人问答排行
GET  /personal/question/page            # 个人问题分页
GET  /question/link                     # 问题链接

// comment
GET  /comment/page                      # 评论分页
GET  /personal/comment/page             # 个人评论分页
GET  /comment                           # 评论详情

// revision
GET  /revisions                         # 修订列表

// tag
GET  /tags/page                         # 标签分页
GET  /tags/following                    # 关注的标签
GET  /tag                               # 标签信息
GET  /tags                              # 标签列表
GET  /tag/synonyms                      # 标签同义词

// search
GET  /search                            # 搜索
GET  /search/desc                       # 搜索描述

// rank
GET  /personal/rank/page                # 个人排名分页

// reaction
GET  /meta/reaction                     # 反应元数据

// badges
GET  /badge                             # 徽章信息
GET  /badge/awards/page                 # 徽章奖励分页
GET  /badge/user/awards/recent          # 用户最近徽章
GET  /badge/user/awards                 # 用户所有徽章
GET  /badges                            # 徽章列表
```

### 3. RegisterAnswerAPIRouter (需要认证)
```go
// revisions
GET  /revisions/unreviewed              # 未审核修订
PUT  /revisions/audit                   # 审核修订
GET  /revisions/edit/check              # 检查编辑权限
GET  /reviewing/type                    # 审核类型

// comment
POST /comment                           # 添加评论
DELETE /comment                         # 删除评论
PUT  /comment                           # 更新评论

// report
POST /report                            # 添加举报
GET  /report/unreviewed/post            # 未审核举报
PUT  /report/review                     # 审核举报

// review
GET  /review/pending/post/page          # 待审核内容分页
PUT  /review/pending/post               # 更新审核

// vote
POST /vote/up                           # 点赞
POST /vote/down                         # 点踩

// follow
POST /follow                            # 关注
PUT  /follow/tags                       # 更新关注标签

// tag
GET  /question/tags                     # 问题标签搜索
POST /tag                               # 添加标签
PUT  /tag                               # 更新标签
POST /tag/recover                       # 恢复标签
DELETE /tag                             # 删除标签
PUT  /tag/synonym                       # 更新标签同义词
POST /tag/merge                         # 合并标签

// collection
POST /collection/switch                 # 收藏开关
GET  /personal/collection/page          # 个人收藏分页

// question
POST /question                          # 添加问题
POST /question/answer                   # 通过答案添加问题
PUT  /question                          # 更新问题
PUT  /question/invite                   # 更新问题邀请
DELETE /question                        # 删除问题
PUT  /question/status                   # 关闭问题
PUT  /question/operation                # 问题操作
PUT  /question/reopen                   # 重新开放问题
GET  /question/similar                  # 相似问题
POST /question/recover                  # 恢复问题

// answer
POST /answer                            # 添加答案
PUT  /answer                            # 更新答案
POST /answer/acceptance                 # 接受答案
DELETE /answer                          # 删除答案
POST /answer/recover                    # 恢复答案

// user
PUT  /user/password                     # 修改密码
PUT  /user/info                         # 更新用户信息
PUT  /user/interface                    # 更新用户界面
GET  /user/notification/config          # 获取通知配置
PUT  /user/notification/config          # 更新通知配置
GET  /user/info/search                  # 搜索用户

// vote
GET  /personal/vote/page                # 个人投票分页

// reason
GET  /reasons                           # 原因列表

// permission
GET  /permission                        # 权限信息

// notification
GET  /notification/status               # 通知状态
PUT  /notification/status               # 清除通知状态
GET  /notification/page                 # 通知分页
PUT  /notification/read/state/all       # 全部标记已读
PUT  /notification/read/state           # 标记已读

// upload file
POST /file                              # 上传文件
POST /post/render                       # 渲染内容

// activity
GET  /activity/timeline                 # 活动时间线
GET  /activity/timeline/detail          # 活动时间线详情

// plugin
GET  /user/plugin/configs               # 用户插件配置列表
GET  /user/plugin/config                # 用户插件配置
PUT  /user/plugin/config                # 更新用户插件配置

// meta
PUT  /meta/reaction                     # 添加或更新反应
```

### 4. RegisterAnswerAdminAPIRouter (管理员接口)
```go
// question & answer admin
GET  /question/page                     # 管理员问题分页
PUT  /question/status                   # 管理员更新问题状态
GET  /answer/page                       # 管理员答案分页
PUT  /answer/status                     # 管理员更新答案状态

// user admin
GET  /users/page                        # 用户分页
PUT  /user/status                       # 更新用户状态
PUT  /user/role                         # 更新用户角色 ⭐
GET  /user/activation                   # 用户激活
POST /user/activation                   # 发送用户激活
POST /user                              # 添加用户
POST /users                             # 批量添加用户
PUT  /user/password                     # 更新用户密码
PUT  /user/profile                      # 编辑用户资料
DELETE /delete/permanently              # 永久删除

// reason
GET  /reasons                           # 原因列表

// language
GET  /language/options                  # 管理员语言选项

// theme
GET  /theme/options                     # 主题选项

// siteinfo admin
GET  /siteinfo/general                  # 通用设置
PUT  /siteinfo/general                  # 更新通用设置
GET  /siteinfo/interface                # 界面设置
PUT  /siteinfo/interface                # 更新界面设置
GET  /siteinfo/branding                 # 品牌设置
PUT  /siteinfo/branding                 # 更新品牌设置
GET  /siteinfo/write                    # 写作设置
PUT  /siteinfo/write                    # 更新写作设置
GET  /siteinfo/legal                    # 法律设置
PUT  /siteinfo/legal                    # 更新法律设置
GET  /siteinfo/seo                      # SEO设置
PUT  /siteinfo/seo                      # 更新SEO设置
GET  /siteinfo/login                    # 登录设置
PUT  /siteinfo/login                    # 更新登录设置
GET  /siteinfo/custom-css-html          # 自定义CSS/HTML
PUT  /siteinfo/custom-css-html          # 更新自定义CSS/HTML
GET  /siteinfo/theme                    # 主题设置
PUT  /siteinfo/theme                    # 保存主题设置
GET  /siteinfo/users                    # 用户设置
PUT  /siteinfo/users                    # 更新用户设置
GET  /setting/smtp                      # SMTP设置
PUT  /setting/smtp                      # 更新SMTP设置
GET  /setting/privileges                # 权限设置 ⭐
PUT  /setting/privileges                # 更新权限设置 ⭐

// dashboard
GET  /dashboard                         # 仪表板信息

// roles
GET  /roles                             # 角色列表 ⭐

// plugin admin
GET  /plugins                           # 插件列表
PUT  /plugin/status                     # 更新插件状态
GET  /plugin/config                     # 插件配置
PUT  /plugin/config                     # 更新插件配置

// badge admin
GET  /badges                            # 徽章列表
PUT  /badge/status                      # 更新徽章状态
```

## 🎯 关键发现

1. **角色管理**: Go项目中只有 `GET /roles` 获取角色列表
2. **用户角色管理**: 通过 `PUT /user/role` 更新用户角色
3. **权限管理**: 通过 `GET/PUT /setting/privileges` 管理权限配置
4. **没有独立的rel相关API**: 证实了我们之前的重构是正确的

## ✅ NestJS项目需要补充的接口

基于对照分析，我们需要在NestJS项目中补充大量缺失的接口以达到100%兼容。
