import { IsOptional, IsString, IsNumber, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RolePageDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @IsOptional()
  @IsString()
  query?: string;
}

export class UpdateUserRoleDto {
  @IsInt()
  @Min(1)
  role_id: number;
}

export class GetRoleResp {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export class RoleMappingResp {
  [key: number]: {
    id: number;
    name: string;
    description: string;
  };
}
