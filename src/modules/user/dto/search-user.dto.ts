import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBooleanString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto {
  @ApiProperty({
    description: 'The ID of the user for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: number;

  @ApiProperty({
    description: 'Username for searching',
    example: 'emina.mumic',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'First name for searching',
    example: 'Emina',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name for searching (partial match)',
    example: 'Mumic',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email address for searching',
    example: 'emina@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Is the user active for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;

  @ApiProperty({
    description: 'User role for searching',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  userRole?: string;

  @ApiProperty({
    description: 'Users created after this date (ISO 8601 format)',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdAtAfter?: string;
}
