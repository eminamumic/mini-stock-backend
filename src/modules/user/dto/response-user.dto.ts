import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user', example: 1 })
  id: number;

  @ApiProperty({ description: 'Username of the user', example: 'emina.mumic' })
  username: string;

  @ApiProperty({ description: 'First name of the user', example: 'Emina' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Mumic' })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'emina@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Is the user account active?', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp of the last login',
    example: '2023-10-26T10:00:00.000Z',
  })
  lastLoginAt: Date;

  @ApiProperty({
    description: 'Timestamp of user creation',
    example: '2023-01-15T08:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Role of the user', example: 'employee' })
  userRole: string;
}
