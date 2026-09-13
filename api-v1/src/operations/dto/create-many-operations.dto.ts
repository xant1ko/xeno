import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOperationDto } from './create-operation.dto';

export class CreateManyOperationsDto {
  @ApiProperty({ type: [CreateOperationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOperationDto)
  operations!: CreateOperationDto[];
}
