import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockMovementDto {
  @ApiProperty({
    description: 'Optional process number associated with the movement.',
    example: 223,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  processNumber?: number;

  @ApiProperty({
    description: 'Type of stock movement (e.g., "In", "Out", "Transfer").',
    example: 'In',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  movementType: string;

  @ApiProperty({
    description: 'The ID of the product involved in the movement.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Product ID must be a positive number.' })
  productId: number;

  @ApiProperty({
    description: 'The ID of the specific batch involved in the movement.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Batch ID must be a positive number.' })
  batchId: number;

  @ApiProperty({
    description: 'The quantity of the product moved.',
    example: 10.5,
    type: 'number',
    format: 'float',
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Quantity cannot be negative.' })
  quantity: number;

  @ApiProperty({
    description:
      'The ID of the source warehouse (if movement is "Out" or "Transfer").',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Source Warehouse ID must be a positive number.' })
  sourceWarehouseId?: number;

  @ApiProperty({
    description:
      'The ID of the destination warehouse (if movement is "In" or "Transfer").',
    example: 2,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Destination Warehouse ID must be a positive number.' })
  destinationWarehouseId?: number;

  @ApiProperty({
    description: 'The ID of the employee responsible for the movement.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Employee ID must be a positive number.' })
  employeeId: number;

  @ApiProperty({
    description:
      'The ID of the supplier involved in the movement (e.g., for "In" movements).',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Supplier ID must be a positive number.' })
  supplierId?: number;

  @ApiProperty({
    description:
      'Reference document number for the movement (e.g., invoice, delivery note).',
    example: 'INV-2024-001',
    maxLength: 100,
    required: true,
  })
  @IsString()
  @MaxLength(100)
  referenceDocument: string;

  @ApiProperty({
    description: 'Additional notes about the stock movement.',
    example: 'Damaged during transit, needs inspection.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
