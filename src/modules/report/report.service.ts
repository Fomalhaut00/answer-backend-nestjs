import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
import { AddReportDto, UnreviewedReportPageDto, ReviewReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  // 添加举报
  async addReport(addReportDto: AddReportDto, userId: string) {
    const { object_id, object_type, report_type, content } = addReportDto;

    const report = this.reportRepository.create({
      userId,
      objectId: object_id,
      objectType: object_type,
      reportType: report_type,
      content: content || '',
      status: 'pending'
    });

    await this.reportRepository.save(report);

    return {
      message: 'Report submitted successfully',
      report_id: report.id
    };
  }

  // 获取未审核举报分页
  async getUnreviewedReportPostPage(query: UnreviewedReportPageDto) {
    const { page = 1, page_size = 20, object_type } = query;
    const skip = (page - 1) * page_size;

    const queryBuilder = this.reportRepository.createQueryBuilder('report')
      .where('report.status = :status', { status: 'pending' });

    if (object_type) {
      queryBuilder.andWhere('report.objectType = :objectType', { objectType: object_type });
    }

    const [reports, total] = await queryBuilder
      .skip(skip)
      .take(page_size)
      .orderBy('report.createdAt', 'DESC')
      .getManyAndCount();

    return {
      reports: reports.map(report => ({
        report_id: report.id,
        object_id: report.objectId,
        object_type: report.objectType,
        report_type: report.reportType,
        content: report.content,
        user_id: report.userId,
        created_at: report.createdAt,
        status: report.status
      })),
      total,
      page,
      page_size,
      total_pages: Math.ceil(total / page_size)
    };
  }

  // 审核举报
  async reviewReport(reviewReportDto: ReviewReportDto, reviewerId: string) {
    const { report_id, action, reason } = reviewReportDto;

    const report = await this.reportRepository.findOne({ where: { id: report_id } });
    if (!report) {
      throw new Error('Report not found');
    }

    report.status = action === 'approve' ? 'approved' : 'rejected';
    report.reviewerId = reviewerId;
    report.reviewReason = reason || '';
    report.reviewedAt = new Date();

    await this.reportRepository.save(report);

    return {
      message: `Report ${action}d successfully`,
      report_id: report.id,
      status: report.status
    };
  }
}
