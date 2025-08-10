import { IsInt, IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateRolePowerRelDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsString()
  @IsNotEmpty()
  powerType: string;
}

export class UpdateRolePowerRelDto {
  @IsOptional()
  @IsInt()
  roleId?: number;

  @IsOptional()
  @IsString()
  powerType?: string;
}

export class BatchCreateRolePowerRelDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsArray()
  @IsString({ each: true })
  powerTypes: string[];
}

export class GetRolePowerListDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;
}

export class GetUserPowerListDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class RolePowerRelResponse {
  id: number;
  roleId: number;
  powerType: string;
  createdAt: Date;
  updatedAt: Date;
  role?: {
    id: number;
    name: string;
    description: string;
  };
  power?: {
    name: string;
    description: string;
  };
}
