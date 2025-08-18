import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { databaseConfig } from './config/database.config';
import { QuestionModule } from './modules/question/question.module';
import { RoleModule } from './modules/role/role.module';
import { PowerModule } from './modules/power/power.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AnswerModule } from './modules/answer/answer.module';
import { CommentModule } from './modules/comment/comment.module';
import { VoteModule } from './modules/vote/vote.module';
import { TagModule } from './modules/tag/tag.module';
import { SearchModule } from './modules/search/search.module';
import { ActivityModule } from './modules/activity/activity.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { CollectionModule } from './modules/collection/collection.module';
import { FollowModule } from './modules/follow/follow.module';
import { ReportModule } from './modules/report/report.module';
import { UploadModule } from './modules/upload/upload.module';
import { RankModule } from './modules/rank/rank.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    QuestionModule,
    RoleModule,
    PowerModule,
    PermissionModule,
    AnswerModule,
    CommentModule,
    VoteModule,
    TagModule,
    SearchModule,
    ActivityModule,
    NotificationModule,
    AdminModule,
    CollectionModule,
    FollowModule,
    ReportModule,
    UploadModule,
    RankModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AppModule {}
