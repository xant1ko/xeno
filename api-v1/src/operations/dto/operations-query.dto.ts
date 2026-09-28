import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum OperationType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class OperationsQueryDto {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 50, minimum: 1, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit: number = 50;

  @ApiPropertyOptional({
    enum: OperationType,
    description: 'Направление операции: доход — положительная сумма, расход — отрицательная.',
  })
  @IsOptional()
  @IsEnum(OperationType)
  type?: OperationType;
}
