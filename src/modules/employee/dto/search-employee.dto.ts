import {
  IsString,
  IsOptional,
  IsNumberString,
  IsDateString,
  IsBooleanString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchEmployeeDto {
  @ApiProperty({
    description: 'The ID of the employee for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  id?: string;

  @ApiProperty({
    description: 'The ID of the associated user account for searching',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  userId?: string;

  @ApiProperty({
    description: 'First name for searching',
    example: 'Emina',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name for searching',
    example: 'Mumic',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Position for searching',
    example: 'Manager',
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    description: 'Employment date for searching (YYYY-MM-DD format).',
    example: '2020-05-15',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  employmentDate?: Date;

  @ApiProperty({
    description: 'Contact phone number for searching (partial match)',
    example: '+387',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({
    description: 'Is the employee active for searching (true/false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: boolean;
}
