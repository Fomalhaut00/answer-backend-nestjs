import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, EmailStatus, UserStatus } from '../../entities/user.entity';
import { EmailLoginDto } from './dto/email-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
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
} 