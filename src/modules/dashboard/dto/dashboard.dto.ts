// Dashboard统计信息响应DTO
export class DashboardInfoResponse {
  // 用户统计
  user_count: number;
  new_user_count: number; // 今日新增用户

  // 问题统计
  question_count: number;
  new_question_count: number; // 今日新增问题

  // 答案统计
  answer_count: number;
  new_answer_count: number; // 今日新增答案

  // 评论统计
  comment_count: number;
  new_comment_count: number; // 今日新增评论

  // 投票统计
  vote_count: number;
  new_vote_count: number; // 今日新增投票

  // 系统信息
  app_start_time: Date;
  app_version: string;
  go_version: string;
  database_version: string;
  
  // 时间统计
  today_date: string;
  timezone: string;
}

// 用户增长趋势数据
export class UserGrowthData {
  date: string;
  user_count: number;
  new_users: number;
}

// 内容增长趋势数据
export class ContentGrowthData {
  date: string;
  question_count: number;
  answer_count: number;
  comment_count: number;
}

// 活跃度统计数据
export class ActivityStatsData {
  date: string;
  active_users: number;
  questions_created: number;
  answers_created: number;
  votes_cast: number;
}
