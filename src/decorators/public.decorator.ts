import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_OPTIONAL_AUTH_KEY = 'isOptionalAuth';
export const IS_ADMIN_KEY = 'isAdmin';

/**
 * 完全公开的接口，不需要任何认证
 * 对应Go项目的 RegisterMustUnAuthAnswerAPIRouter
 *
 * 使用场景：
 * - 用户登录/注册
 * - 密码重置
 * - 邮箱验证
 * - 取消订阅通知
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * 可选认证的接口，可以带token也可以不带token访问
 * 对应Go项目的 RegisterUnAuthAnswerAPIRouter
 *
 * 关键区别：
 * 1. 未登录用户：看到基础内容，无个性化功能
 * 2. 已登录用户：看到个性化内容 + 操作权限按钮 + 状态信息
 *
 * 具体差异：
 * - 问题详情：登录用户能看到编辑/删除按钮，投票状态，收藏状态
 * - 问题列表：登录用户能看到基于关注标签的个性化推荐
 * - 用户资料：登录用户能看到更多私有信息
 * - 权限检查：某些删除/待审核内容只有作者和管理员能看到
 *
 * 使用场景：
 * - 问题/答案/评论的查看接口
 * - 标签列表和信息
 * - 搜索功能
 * - 用户公开资料
 */
export const OptionalAuth = () => SetMetadata(IS_OPTIONAL_AUTH_KEY, true);

/**
 * 需要管理员权限的接口
 * 对应Go项目的 RegisterAnswerAdminAPIRouter
 *
 * 使用场景：
 * - 用户管理
 * - 内容审核
 * - 系统设置
 * - 举报处理
 */
export const AdminOnly = () => SetMetadata(IS_ADMIN_KEY, true);
