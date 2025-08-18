import { Injectable } from '@nestjs/common';

@Injectable()
export class CollectionService {
  async collectionSwitch(userId: string, objectId: string) {
    // TODO: 实现收藏切换逻辑
    return { message: 'Collection switched successfully' };
  }
}
