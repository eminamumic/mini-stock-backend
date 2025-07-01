import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'New password for the user.',
    example: 'NewStrongPassword456!',
    minLength: 8,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiProperty({
    description: 'Is the user account active?',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Role of the user (e.g., "admin", "employee", "viewer")',
    example: 'admin',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userRole?: string;
}
