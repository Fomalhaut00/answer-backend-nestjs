import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, EmailStatus, UserStatus } from '../../entities/user.entity';
import { EmailLoginDto } from './dto/email-login.dto';
import {
  CreateUserDto,
  UpdateUserInfoDto,
  UpdateUserInterfaceDto,
  ChangePasswordDto,
  ResetPasswordDto,
  UseResetPasswordDto,
  VerifyEmailDto,
  ChangeEmailDto,
  SearchUserDto
} from './dto/create-user.dto';
import {
  UserRankingDto,
  UserStaffDto,
  UserActionRecordDto
} from './dto/user-query.dto';
import {
  UpdateUserNotificationConfigDto
} from './dto/user-notification.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user with email already exists
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if user with username already exists
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username }
    });
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.pass, salt);

    // Create new user
    const user = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      pass: hashedPassword,
      mailStatus: EmailStatus.TO_BE_VERIFIED,
      status: UserStatus.AVAILABLE,
      displayName: createUserDto.display_name || createUserDto.username,
      language: createUserDto.language || '',
      avatar: '',
      bio: '',
      bioHTML: '',
      website: '',
      location: '',
      mobile: '',
      ipInfo: '',
      isAdmin: false,
      colorScheme: '',
    });

    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { 
      sub: user.id,
      email: user.email,
      username: user.username 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        username: user.username,
        email: user.email,
        display_name: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        language: user.language,
      }
    };
  }

  async loginWithEmail(emailLoginDto: EmailLoginDto) {
    const { email, pass } = emailLoginDto;
    
    // Find user by email
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where('user.email = :email', { email })
    .addSelect('user.pass')
    .getOne();
    console.log(pass, user);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or pass');
    }
    console.log(pass, user);

    // Verify pass
    const ispassValid = await bcrypt.compare(pass, user.pass);
    console.log(ispassValid);
    
    if (!ispassValid) {
      throw new UnauthorizedException('Invalid email or pass');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id,
      email: user.email,
      username: user.username 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        language: user.language,
        status: user.status,
      }
    };
  }

  async logout(userId: string) {
    // 在实际应用中，这里可能需要将token加入黑名单
    // 或者更新用户的最后登录时间
    await this.userRepository.update(userId, {
      lastLoginDate: new Date()
    });

    return { message: 'Logout successful' };
  }

  async getUserInfoByUserID(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id', 'username', 'displayName', 'avatar', 'bio', 'bioHTML',
        'website', 'location', 'rank', 'status', 'createdAt', 'updatedAt',
        'followCount', 'answerCount', 'questionCount', 'language', 'colorScheme'
      ]
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_info: {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        bio_html: user.bioHTML,
        website: user.website,
        location: user.location,
        rank: user.rank,
        status: user.status,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        follow_count: user.followCount,
        answer_count: user.answerCount,
        question_count: user.questionCount,
        language: user.language,
        color_scheme: user.colorScheme
      }
    };
  }

  async getUserInfoByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: [
        'id', 'username', 'displayName', 'avatar', 'bio', 'bioHTML',
        'website', 'location', 'rank', 'status', 'createdAt', 'updatedAt',
        'followCount', 'answerCount', 'questionCount', 'language', 'colorScheme'
      ]
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_info: {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        bio_html: user.bioHTML,
        website: user.website,
        location: user.location,
        rank: user.rank,
        status: user.status,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        follow_count: user.followCount,
        answer_count: user.answerCount,
        question_count: user.questionCount,
        language: user.language,
        color_scheme: user.colorScheme
      }
    };
  }

  async updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Partial<User> = {};
    if (updateUserInfoDto.display_name !== undefined) {
      updateData.displayName = updateUserInfoDto.display_name;
    }
    if (updateUserInfoDto.avatar !== undefined) {
      updateData.avatar = updateUserInfoDto.avatar;
    }
    if (updateUserInfoDto.mobile !== undefined) {
      updateData.mobile = updateUserInfoDto.mobile;
    }
    if (updateUserInfoDto.bio !== undefined) {
      updateData.bio = updateUserInfoDto.bio;
      // 在实际应用中，这里应该将markdown转换为HTML
      updateData.bioHTML = updateUserInfoDto.bio;
    }
    if (updateUserInfoDto.website !== undefined) {
      updateData.website = updateUserInfoDto.website;
    }
    if (updateUserInfoDto.location !== undefined) {
      updateData.location = updateUserInfoDto.location;
    }

    await this.userRepository.update(userId, updateData);

    return { message: 'User info updated successfully' };
  }

  async updateUserInterface(userId: string, updateUserInterfaceDto: UpdateUserInterfaceDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Partial<User> = {};
    if (updateUserInterfaceDto.language !== undefined) {
      updateData.language = updateUserInterfaceDto.language;
    }
    if (updateUserInterfaceDto.color_scheme !== undefined) {
      updateData.colorScheme = updateUserInterfaceDto.color_scheme;
    }

    await this.userRepository.update(userId, updateData);

    return { message: 'User interface updated successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.pass')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(changePasswordDto.old_pass, user.pass);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    // 加密新密码
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.pass, salt);

    await this.userRepository.update(userId, { pass: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordDto.email }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 在实际应用中，这里应该发送重置密码邮件
    // 生成重置码并保存到数据库或缓存中
    const resetCode = Math.random().toString(36).substring(2, 15);

    // 这里应该发送邮件，暂时返回成功消息
    return {
      message: 'Password reset email sent successfully',
      // 在开发环境中可以返回重置码，生产环境中不应该返回
      reset_code: resetCode
    };
  }

  async useResetPassword(useResetPasswordDto: UseResetPasswordDto) {
    // 在实际应用中，这里应该验证重置码的有效性
    // 暂时简单处理，假设所有重置码都有效

    // 这里应该根据重置码找到对应的用户
    // 暂时返回成功消息
    console.log('Resetting password with code:', useResetPasswordDto.code);

    // 在实际应用中，这里应该更新对应用户的密码
    return { message: 'Password reset successfully' };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    // 在实际应用中，这里应该验证邮箱验证码
    // 暂时简单处理，假设所有验证码都有效
    console.log('Verifying email with code:', verifyEmailDto.code);

    return { message: 'Email verified successfully' };
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 在实际应用中，这里应该发送验证邮件
    const verificationCode = Math.random().toString(36).substring(2, 15);

    return {
      message: 'Verification email sent successfully',
      // 在开发环境中可以返回验证码，生产环境中不应该返回
      verification_code: verificationCode
    };
  }

  async sendChangeEmailCode(userId: string, changeEmailDto: ChangeEmailDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.pass')
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(changeEmailDto.pass, user.pass);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    // 检查新邮箱是否已被使用
    const existingUser = await this.userRepository.findOne({
      where: { email: changeEmailDto.email }
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 在实际应用中，这里应该发送更改邮箱的验证码
    const changeCode = Math.random().toString(36).substring(2, 15);

    return {
      message: 'Change email code sent successfully',
      // 在开发环境中可以返回验证码，生产环境中不应该返回
      change_code: changeCode
    };
  }

  async changeEmail(userId: string, changeEmailDto: ChangeEmailDto) {
    // 在实际应用中，这里应该验证更改邮箱的验证码
    // 暂时简单处理

    await this.userRepository.update(userId, {
      email: changeEmailDto.email,
      mailStatus: EmailStatus.TO_BE_VERIFIED
    });

    return { message: 'Email changed successfully' };
  }

  async getUserNotificationConfig(userId: string) {
    // 在实际应用中，这里应该从用户通知配置表中获取配置
    // 暂时返回默认配置
    console.log('Getting notification config for user:', userId);
    return {
      config: {
        inbox: true,
        all_new_question: false,
        all_new_question_for_following_tags: true,
        someone_answer: true,
        someone_comment: true,
        someone_reply: true,
        someone_vote_up: true,
        someone_vote_down: false,
        someone_accept: true,
        someone_follow: true,
        email: true
      }
    };
  }

  async updateUserNotificationConfig(userId: string, updateConfigDto: UpdateUserNotificationConfigDto) {
    // 在实际应用中，这里应该更新用户通知配置表
    // 暂时返回成功消息
    console.log('Updating notification config for user:', userId, updateConfigDto);
    return { message: 'Notification config updated successfully' };
  }

  async unsubscribeNotification(code: string) {
    // 在实际应用中，这里应该根据取消订阅码更新用户的通知设置
    // 暂时返回成功消息
    console.log('Unsubscribing with code:', code);
    return { message: 'Unsubscribed successfully' };
  }

  async searchUsers(searchUserDto: SearchUserDto) {
    const { query, limit = 20 } = searchUserDto;

    const users = await this.userRepository.find({
      where: [
        { username: Like(`%${query}%`) },
        { displayName: Like(`%${query}%`) }
      ],
      select: ['id', 'username', 'displayName', 'avatar', 'rank'],
      take: limit,
      order: { rank: 'DESC' }
    });

    return {
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank
      }))
    };
  }

  async getUserRanking(userRankingDto: UserRankingDto) {
    const { page = 1, size = 20 } = userRankingDto;
    const skip = (page - 1) * size;

    const [users, total] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'displayName', 'avatar', 'rank', 'createdAt'],
      order: { rank: 'DESC' },
      skip,
      take: size
    });

    return {
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank,
        created_at: user.createdAt
      })),
      total,
      page,
      size
    };
  }

  async getUserStaff(userStaffDto: UserStaffDto) {
    const { page = 1, size = 20 } = userStaffDto;
    const skip = (page - 1) * size;

    // 在实际应用中，这里应该查询管理员和版主用户
    // 暂时查询rank较高的用户作为staff
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.rank > :minRank', { minRank: 1000 })
      .select(['user.id', 'user.username', 'user.displayName', 'user.avatar', 'user.rank', 'user.createdAt'])
      .orderBy('user.rank', 'DESC')
      .skip(skip)
      .take(size);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        rank: user.rank,
        created_at: user.createdAt
      })),
      total,
      page,
      size
    };
  }

  async getUserActionRecord(userId: string, actionRecordDto: UserActionRecordDto) {
    const { page = 1, size = 20 } = actionRecordDto;

    // 在实际应用中，这里应该从活动记录表中查询用户的活动记录
    // 暂时返回空数据
    console.log('Getting action record for user:', userId);
    return {
      activities: [],
      total: 0,
      page,
      size
    };
  }

  async getPersonalUserInfo(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: [
        'id', 'username', 'displayName', 'avatar', 'bio', 'bioHTML',
        'website', 'location', 'rank', 'status', 'createdAt',
        'followCount', 'answerCount', 'questionCount'
      ]
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user_info: {
        id: user.id,
        username: user.username,
        display_name: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        bio_html: user.bioHTML,
        website: user.website,
        location: user.location,
        rank: user.rank,
        status: user.status,
        created_at: user.createdAt,
        follow_count: user.followCount,
        answer_count: user.answerCount,
        question_count: user.questionCount
      }
    };
  }
}