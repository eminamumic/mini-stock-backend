import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'The ID of the user account associated with this employee. ',
    example: 1,
    required: false,
    nullable: true,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'User ID must be a positive number.' })
  userId?: number;

  @ApiProperty({
    description: 'First name of the employee',
    example: 'Emina',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the employee',
    example: 'Mumic',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Position or job title of the employee',
    example: 'Sales Manager',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @ApiProperty({
    description: 'Date of employment for the employee (YYYY-MM-DD format).',
    example: '2020-05-15',
    type: 'string',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  employmentDate: Date;

  @ApiProperty({
    description: 'Contact phone number of the employee',
    example: '+38761123456',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;
}
