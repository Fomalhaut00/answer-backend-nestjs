import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportService {
  async addReport(userId: string, reportData: any) {
    // TODO: 实现添加举报逻辑
    return { message: 'Report submitted successfully' };
  }

  async getUnreviewedReportPostPage(query: any) {
    // TODO: 实现获取未审核举报列表逻辑
    return { data: [], total: 0 };
  }

  async reviewReport(reportId: string, action: string) {
    // TODO: 实现审核举报逻辑
    return { message: 'Report reviewed successfully' };
  }
}
