import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseTypeDto } from './create-warehouse-type.dto';

export class UpdateWarehouseTypeDto extends PartialType(
  CreateWarehouseTypeDto,
) {}
