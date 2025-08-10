import { IsArray, IsString, IsOptional } from 'class-validator';

export class GetPermissionDto {
  @IsArray()
  @IsString({ each: true })
  actions: string[];
}

export class PermissionResponse {
  has_permission: boolean;
  tip?: string;
  rank?: number;
}

export class PermissionMemberAction {
  action: string;
  name: string;
  type: string;
}

// 权限常量定义
export const PERMISSIONS = {
  // 管理员权限
  ADMIN_ACCESS: 'admin.access',
  
  // 问题权限
  QUESTION_ADD: 'question.add',
  QUESTION_EDIT: 'question.edit',
  QUESTION_EDIT_WITHOUT_REVIEW: 'question.edit_without_review',
  QUESTION_DELETE: 'question.delete',
  QUESTION_CLOSE: 'question.close',
  QUESTION_REOPEN: 'question.reopen',
  QUESTION_VOTE_UP: 'question.vote_up',
  QUESTION_VOTE_DOWN: 'question.vote_down',
  QUESTION_PIN: 'question.pin',
  QUESTION_UNPIN: 'question.unpin',
  QUESTION_HIDE: 'question.hide',
  QUESTION_SHOW: 'question.show',
  
  // 答案权限
  ANSWER_ADD: 'answer.add',
  ANSWER_EDIT: 'answer.edit',
  ANSWER_EDIT_WITHOUT_REVIEW: 'answer.edit_without_review',
  ANSWER_DELETE: 'answer.delete',
  ANSWER_ACCEPT: 'answer.accept',
  ANSWER_VOTE_UP: 'answer.vote_up',
  ANSWER_VOTE_DOWN: 'answer.vote_down',
  ANSWER_INVITE_SOMEONE_TO_ANSWER: 'answer.invite_someone_to_answer',
  
  // 评论权限
  COMMENT_ADD: 'comment.add',
  COMMENT_EDIT: 'comment.edit',
  COMMENT_DELETE: 'comment.delete',
  COMMENT_VOTE_UP: 'comment.vote_up',
  COMMENT_VOTE_DOWN: 'comment.vote_down',
  
  // 举报权限
  REPORT_ADD: 'report.add',
  
  // 标签权限
  TAG_ADD: 'tag.add',
  TAG_EDIT: 'tag.edit',
  TAG_EDIT_SLUG_NAME: 'tag.edit_slug_name',
  TAG_EDIT_WITHOUT_REVIEW: 'tag.edit_without_review',
  TAG_DELETE: 'tag.delete',
  TAG_SYNONYM: 'tag.synonym',
  TAG_USE_RESERVED_TAG: 'tag.use_reserved_tag',
  
  // 其他权限
  LINK_URL_LIMIT: 'link.url_limit',
  VOTE_DETAIL: 'vote.detail',
  ANSWER_AUDIT: 'answer.audit',
  QUESTION_AUDIT: 'question.audit',
  TAG_AUDIT: 'tag.audit'
} as const;
