import { Injectable } from '@nestjs/common';

@Injectable()
export class RankService {
  async getRankPersonalWithPage(query: any, userId?: string) {
    // TODO: 实现个人排名页面逻辑
    return { data: [], total: 0 };
  }
}
