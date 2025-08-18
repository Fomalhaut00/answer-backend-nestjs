/**
 * 路由配置
 * 基于Go项目的路由分组设计
 */

export interface RouteGroup {
  prefix: string;
  description: string;
  authRequired: boolean;
  adminRequired: boolean;
  optionalAuth: boolean;
}

export const ROUTE_GROUPS = {
  // 必须未认证的路由 (对应Go的RegisterMustUnAuthAnswerAPIRouter)
  MUST_UNAUTH: {
    prefix: '',
    description: '必须未认证的路由，如登录注册',
    authRequired: false,
    adminRequired: false,
    optionalAuth: false,
  } as RouteGroup,

  // 可选认证的路由 (对应Go的RegisterUnAuthAnswerAPIRouter)
  OPTIONAL_AUTH: {
    prefix: '',
    description: '可选认证的路由，如问题列表、答案查看等',
    authRequired: false,
    adminRequired: false,
    optionalAuth: true,
  } as RouteGroup,

  // 任何状态用户的路由 (对应Go的RegisterAuthUserWithAnyStatusAnswerAPIRouter)
  AUTH_ANY_STATUS: {
    prefix: '',
    description: '任何状态用户的路由，如登出、邮箱验证等',
    authRequired: true,
    adminRequired: false,
    optionalAuth: false,
  } as RouteGroup,

  // 需要认证的路由 (对应Go的RegisterAnswerAPIRouter)
  AUTH_REQUIRED: {
    prefix: '',
    description: '需要认证的路由，如发布问题、投票等',
    authRequired: true,
    adminRequired: false,
    optionalAuth: false,
  } as RouteGroup,

  // 管理员路由 (对应Go的RegisterAnswerAdminAPIRouter)
  ADMIN_ONLY: {
    prefix: 'admin',
    description: '管理员专用路由',
    authRequired: true,
    adminRequired: true,
    optionalAuth: false,
  } as RouteGroup,
} as const;

/**
 * 路由映射配置
 * 定义每个控制器方法应该属于哪个路由分组
 */
export const ROUTE_MAPPING = {
  // 用户相关路由
  user: {
    // 必须未认证
    mustUnauth: [
      'POST /user/login/email',
      'POST /user/register/email',
      'POST /user/email/verification',
      'PUT /user/email',
      'POST /user/password/reset',
      'POST /user/password/replacement',
      'PUT /user/notification/unsubscribe',
    ],
    // 可选认证
    optionalAuth: [
      'GET /user/info',
      'GET /personal/user/info',
      'GET /user/ranking',
      'GET /user/staff',
    ],
    // 任何状态用户
    authAnyStatus: [
      'GET /user/logout',
      'POST /user/email/change/code',
      'POST /user/email/verification/send',
    ],
    // 需要认证
    authRequired: [
      'PUT /user/password',
      'PUT /user/info',
      'PUT /user/interface',
      'GET /user/notification/config',
      'PUT /user/notification/config',
      'GET /user/info/search',
      'GET /user/action/record',
    ],
    // 管理员
    adminOnly: [
      'GET /admin/users/page',
      'PUT /admin/user/status',
      'PUT /admin/user/role',
      'GET /admin/user/activation',
      'POST /admin/user/activation',
      'POST /admin/user',
      'POST /admin/users',
      'PUT /admin/user/password',
      'PUT /admin/user/profile',
    ],
  },

  // 问题相关路由
  question: {
    // 可选认证
    optionalAuth: [
      'GET /question/info',
      'GET /question/invite',
      'GET /question/page',
      'GET /question/recommend/page',
      'GET /question/similar/tag',
      'GET /personal/qa/top',
      'GET /personal/question/page',
      'GET /question/link',
    ],
    // 需要认证
    authRequired: [
      'POST /question',
      'POST /question/answer',
      'PUT /question',
      'PUT /question/invite',
      'DELETE /question',
      'PUT /question/status',
      'PUT /question/operation',
      'PUT /question/reopen',
      'GET /question/similar',
      'POST /question/recover',
    ],
    // 管理员
    adminOnly: [
      'GET /admin/question/page',
      'PUT /admin/question/status',
    ],
  },

  // 答案相关路由
  answer: {
    // 可选认证
    optionalAuth: [
      'GET /answer/info',
      'GET /answer/page',
      'GET /personal/answer/page',
    ],
    // 需要认证
    authRequired: [
      'POST /answer',
      'PUT /answer',
      'POST /answer/acceptance',
      'DELETE /answer',
      'POST /answer/recover',
    ],
    // 管理员
    adminOnly: [
      'GET /admin/answer/page',
      'PUT /admin/answer/status',
    ],
  },

  // 评论相关路由
  comment: {
    // 可选认证
    optionalAuth: [
      'GET /comment/page',
      'GET /personal/comment/page',
      'GET /comment',
    ],
    // 需要认证
    authRequired: [
      'POST /comment',
      'DELETE /comment',
      'PUT /comment',
    ],
  },

  // 标签相关路由
  tag: {
    // 可选认证
    optionalAuth: [
      'GET /tags/page',
      'GET /tags/following',
      'GET /tag',
      'GET /tags',
      'GET /tag/synonyms',
    ],
    // 需要认证
    authRequired: [
      'GET /question/tags',
      'POST /tag',
      'PUT /tag',
      'POST /tag/recover',
      'DELETE /tag',
      'PUT /tag/synonym',
      'POST /tag/merge',
    ],
  },

  // 投票相关路由
  vote: {
    // 需要认证
    authRequired: [
      'POST /vote/up',
      'POST /vote/down',
      'GET /personal/vote/page',
    ],
  },

  // 搜索相关路由
  search: {
    // 可选认证
    optionalAuth: [
      'GET /search',
      'GET /search/desc',
    ],
  },

  // 通知相关路由
  notification: {
    // 需要认证
    authRequired: [
      'GET /notification/status',
      'PUT /notification/status',
      'GET /notification/page',
      'PUT /notification/read/state/all',
      'PUT /notification/read/state',
    ],
  },

  // 活动相关路由
  activity: {
    // 需要认证
    authRequired: [
      'GET /activity/timeline',
      'GET /activity/timeline/detail',
    ],
  },
} as const;
