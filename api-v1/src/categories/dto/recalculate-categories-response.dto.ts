import { ApiProperty } from '@nestjs/swagger';

export class RecalculateCategoriesResponseDto {
  @ApiProperty({ example: 125 })
  operations_processed!: number;

  @ApiProperty({ example: 8 })
  categories_count!: number;

  @ApiProperty({ type: [String], example: ['Продукты', 'Переводы'] })
  categories!: string[];
}
