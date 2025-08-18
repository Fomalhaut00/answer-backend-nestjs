import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowService {
  async follow(userId: string, objectId: string, isCancel?: boolean) {
    // TODO: 实现关注/取消关注逻辑
    return { message: isCancel ? 'Unfollowed successfully' : 'Followed successfully' };
  }

  async updateFollowTags(userId: string, tagIds: string[]) {
    // TODO: 实现更新关注标签逻辑
    return { message: 'Follow tags updated successfully' };
  }
}
